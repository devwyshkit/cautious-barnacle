'use server';

import { create_razorpay_order, verify_payment } from '@/lib/services/razorpay';
import { createClient } from '@/lib/supabase/server';
import { logError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/logging/logger';
import { hasAnyPersonalization } from '@/lib/utils/personalization';

// WYSHKIT 2026: Node-level recalculateOrderTotal removed.
// We now use the database-level 'calculate_order_total' RPC for authority.

import { DraftLineItem } from '@/lib/types/personalization';
import { type PricingBreakdown } from '@/lib/constants/pricing';
import type { Database, Json } from '@/lib/supabase/database.types';
import { create_order, get_order_with_history } from '@/lib/actions/orders';


interface DraftMetadata {
    gstin?: string | null;
    delivery_instructions?: string | null;
    coupon_code?: string | null;
    use_wallet?: boolean;
    pricing?: PricingBreakdown;
    distance_km?: number | null;
    delivery_fee?: number | null;
}

// WYSHKIT 2026: Single-Trip Pricing Recalculation via Database RPC
// Authority moves from Node.js logic to Postgres Logic
export async function create_payment_order(
    amount: number, // Client-provided amount (for validation)
    currency: string = 'INR',
    payload: {
        address_id: string;
        draft_items: DraftLineItem[];
        pricing: PricingBreakdown;
        gstin?: string;
        applied_coupon?: { code: string } | null;
        wallet_discount?: number;
        use_wallet?: boolean;
        delivery_instructions?: string;
        delivery_fee?: number;
        distance_km?: number;
    }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { error: 'Unauthorized', status: 401 };
        if (!payload.draft_items || payload.draft_items.length === 0) return { error: 'No items in cart', status: 400 };
        if (!payload.address_id || payload.address_id === 'guest_location') return { error: 'Please select a valid delivery address.', status: 400 };

        // WYSHKIT 2026: Pricing and delivery fees are strictly computed by the database RPC.
        // Redundant fetch/calc removed for Absolute Truth (DRY).
        const delivery_fee = payload.pricing?.delivery_fee || 40;
        const distance_km = 0; // Distance not strictly needed for payment verification if delivery_fee is passed

        // 1.5. WYSHKIT 2026: CLEANUP PREVIOUS RESERVATIONS (Self-Lockout Prevention)
        await supabase.from('stock_reservations').delete().eq('user_id', user.id);

        // 1.6. WYSHKIT 2026: BATCHED INVENTORY CHECK (F4)
        const stock_checks = payload.draft_items.map(async (item) => {
            const v_id = item.selected_variant_id || null;
            const item_id = item.item_id;
            const qty_needed = item.quantity || 1;

            const { data: available_stock, error: stock_error } = await supabase.rpc('get_available_stock', {
                p_variant_id: v_id || undefined,
                p_item_id: item_id,
                p_exclude_user_id: user.id
            });

            if (stock_error) throw new Error(`Stock verification failed for ${item.item_name || item_id}`);
            const available = Number(available_stock) || 0;
            if (available < qty_needed) {
                throw new Error(`Insufficient stock for "${item.item_name || 'Item'}". Only ${available} available.`);
            }
            return true;
        });

        try {
            await Promise.all(stock_checks);
        } catch (err) {
            const e = err as Error;
            logger.error('Inventory check failed', { error: e.message });
            return { error: e.message, status: 409 };
        }

        // 2. FETCH PRICING FROM DB RPC
        const { calculateOrderTotalRPC } = await import('@/lib/actions/pricing');
        const pricingItems = payload.draft_items.map((item) => ({
            item_id: item.item_id,
            variant_id: item.selected_variant_id || null,
            quantity: item.quantity,
            has_personalization: !!item.personalization?.enabled,
            personalization_option_id: item.personalization?.option_id || null,
            selected_addons: item.selected_addons || []
        }));

        const { data: pricingData, error: pricingErrorMsg } = await calculateOrderTotalRPC(
            pricingItems,
            delivery_fee, // Ensure delivery fee exactly matches the frontend override logic
            payload.address_id,
            payload.applied_coupon?.code || undefined,
            distance_km || undefined,
            payload.use_wallet || false,
            user.id
        );

        const pricing = pricingData;

        if (pricingErrorMsg || !pricing) {
            return { error: pricingErrorMsg || 'Pricing verification failed', status: 400 };
        }

        // 3. SECURE VALIDATION
        const server_amount = Math.round(pricing.total * 100);
        const client_amount = Math.round(amount);

        if (Math.abs(server_amount - client_amount) > 100) {
            logger.warn('Price mismatch detected', { server_amount, client_amount, userId: user.id });
        }

        if (Math.abs(server_amount - client_amount) > (client_amount * 0.5)) {
            logger.error('Price mismatch detected (critical)', { server_amount, client_amount, userId: user.id });
            return { error: 'Price discrepancy too high. Please refresh cart.', status: 400 };
        }

        // 4. PERSIST DRAFT (WYSHKIT 2026: Bypass Razorpay Notes Limit)
        const { data: draft, error: draft_error } = await supabase
            .from('draft_orders')
            .insert({
                user_id: user.id,
                items: payload.draft_items.map((item) => ({
                    item_id: item.item_id,
                    variant_id: item.selected_variant_id || null,
                    quantity: item.quantity,
                    has_personalization: !!item.personalization?.enabled,
                    personalization_config: item.personalization || null,
                    selected_addons: item.selected_addons || [],
                })) as unknown as Json,
                address_id: payload.address_id,
                metadata: {
                    gstin: payload.gstin || null,
                    delivery_instructions: (payload.delivery_instructions || '').trim(),
                    coupon_code: payload.applied_coupon?.code || null,
                    use_wallet: !!(payload.wallet_discount && payload.wallet_discount > 0),
                    pricing: pricingData,
                    distance_km: distance_km,
                    delivery_fee: delivery_fee
                } as unknown as Json
            })
            .select('id')
            .single();

        if (draft_error) {
            logger.error('Failed to create draft order', draft_error);
            return { error: 'Failed to prepare order', status: 500 };
        }

        // 5. RAZORPAY ORDER
        const receipt = `order_${Date.now()}`;
        const order = await create_razorpay_order(
            server_amount,
            currency,
            receipt,
            {
                userId: user.id,
                draftId: draft.id,
            }
        );

        // 6. HARDENING P0: STOCK RESERVATION
        const reservation_inserts = payload.draft_items.map((item) => ({
            user_id: user.id,
            payment_intent_id: order.id,
            item_id: item.item_id,
            variant_id: item.selected_variant_id || null,
            quantity: item.quantity || 1,
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        }));

        const { error: reserve_error } = await supabase
            .from('stock_reservations')
            .insert(reservation_inserts);

        if (reserve_error) {
            logger.error('Failed to reserve stock', reserve_error);
        }

        return {
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                draftId: draft.id
            },
            error: null
        };
    } catch (error) {
        logError(error, 'create_payment_order');
        return { error: 'Failed to create payment order', status: 500 };
    }
}

// WYSHKIT 2026: Atomic Payment Verification & Order Placement
export async function verify_payment_signature(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    payload: {
        draft_id: string; // F4: Use Draft ID for reliability
    }
) {
    try {
        const { verify_payment } = await import('@/lib/services/razorpay');
        const { create_order, get_order_with_history } = await import('@/lib/actions/orders');
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            logger.error('verify_payment_signature: user not found in session');
            return { error: 'User session not found', status: 401 };
        }

        // 1. Fetch Draft Data
        const { data: draft, error: draft_error } = await supabase
            .from('draft_orders')
            .select('*')
            .eq('id', payload.draft_id)
            .single();

        if (draft_error || !draft) {
            logger.error('verify_payment_signature: draft not found', { draftId: payload.draft_id });
            return { error: 'Order session expired. Please try again.', status: 404 };
        }

        // 2. Verification Logic
        const is_valid = await verify_payment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );
        if (!is_valid) return { error: 'Invalid payment signature', status: 400 };

        // WYSHKIT 2026: Idempotency Check (Anti-Double-Ordering)
        const { data: existing_order } = await supabase
            .from('orders')
            .select('id, order_number, has_personalization')
            .eq('razorpay_order_id', razorpay_order_id)
            .maybeSingle();

        if (existing_order) {
            logger.info('verify_payment_signature: order already exists (webhook won)', { orderId: existing_order.id });

            // WYSHKIT 2026: Fetch full details for the success overlay
            const { order: order_with_details } = await get_order_with_history(existing_order.id);

            return {
                success: true,
                verified: true,
                order_id: existing_order.id,
                order_number: existing_order.order_number,
                has_personalization: existing_order.has_personalization,
                order: order_with_details || existing_order,
                error: null,
            };
        }

        // 3. ATOMIC ORDER PLACEMENT
        const metadata = (draft.metadata as unknown as DraftMetadata) || {};

        // Calculate personalization flag for UI feedback
        const draft_items = (draft.items as unknown as DraftLineItem[]) || [];
        const has_pers = hasAnyPersonalization(draft_items);

        const order_result = await create_order({
            address_id: draft.address_id || '',
            items: draft_items.map(item => ({
                item_id: item.item_id,
                variant_id: item.selected_variant_id,
                quantity: item.quantity,
                has_personalization: !!item.personalization?.enabled,
                personalization_config: item.personalization,
                selected_addons: item.selected_addons
            })),
            razorpay_order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            coupon_code: metadata.coupon_code || undefined,
            use_wallet: metadata.use_wallet,
            gstin: metadata.gstin || undefined,
            delivery_instructions: metadata.delivery_instructions || undefined,
            distance_km: metadata.distance_km || undefined,
            delivery_fee: metadata.delivery_fee || undefined,
            user_id: user.id,
            useAdmin: true
        });

        if (!('success' in order_result) || !order_result.success) {
            return { error: ('error' in order_result ? (order_result as any).error : 'Failed to finalize order') || 'Failed to finalize order', status: 500 };
        }

        // Cleanup draft
        await supabase.from('draft_orders').delete().eq('id', draft.id);

        return {
            success: true,
            verified: true,
            order_id: (order_result as any).order_id,
            order_number: (order_result as any).order_number,
            has_personalization: has_pers,
            order: (order_result as any).order, // Enriched Data from RPC
            error: null,
        };
    } catch (error) {
        logError(error, 'verify_payment_signature');
        return { error: 'Payment verification failed', status: 500 };
    }
}

/**
 * WYSHKIT 2026: Cleanup logic for stale draft orders.
 * This can be called from a maintenance worker or cron job.
 */
export async function cleanup_draft_orders() {
    try {
        const { createAdminClient } = await import('@/lib/supabase/server');
        const supabase = await createAdminClient();
        const { error } = await supabase
            .from('draft_orders')
            .delete()
            .lt('expires_at', new Date().toISOString());

        if (error) {
            logger.error('Failed to cleanup draft orders', error);
            return { success: false, error };
        }

        return { success: true };
    } catch (error) {
        logError(error, 'cleanup_draft_orders');
        return { success: false, error };
    }
}
