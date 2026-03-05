'use server';

import { create_razorpay_order, verify_payment } from '@/lib/services/razorpay';
import { createClient } from '@/lib/supabase/server';
import { logError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/logging/logger';
import { hasAnyPersonalization } from '@/lib/utils/personalization';

// WYSHKIT 2026: Node-level recalculateOrderTotal removed.
// We now use the database-level 'calculate_order_total' RPC for authority.

import { CartProduct } from '@/lib/types/personalization';
import type { PricingBreakdown } from '@/lib/types/pricing';
import type { WalletInfo } from '../user/wallet';
import type { Database, Json } from '@/lib/supabase/database.types';
import { get_order_with_history } from '../commerce/orders';
import { executeCommerceIntent } from '../commerce/intent-engine';


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
        draft_products: CartProduct[];
        pricing: PricingBreakdown;
        gstin?: string;
        applied_coupon?: { code: string } | null;
        wallet_discount?: number;
        use_wallet?: boolean;
        delivery_instructions?: string;
        delivery_fee?: number;
        // [PURGED] WYSHKIT 2026: distance_km must be server-resolved.
    }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        logger.info('create_payment_order: starting', { userId: user?.id, productsCount: payload.draft_products?.length, addressId: payload.address_id });

        if (!user) return { error: 'Unauthorized', status: 401 };
        if (!payload.draft_products || payload.draft_products.length === 0) return { error: 'No products in cart', status: 400 };
        if (!payload.address_id || payload.address_id === 'guest_location') return { error: 'Please select a valid delivery address.', status: 400 };

        // WYSHKIT 2026: Pricing and delivery fees are strictly computed by the database RPC.
        // [PURGED] distance_km override logic.
        const delivery_fee = undefined; // Force RPC to compute from address context

        // 1.5. [PURGED] WYSHKIT 2026: Manual stock reservations are superseded by atomic place_atomic_order.

        // 2. FETCH PRICING FROM DB RPC
        const { calculateOrderTotalRPC } = await import('./pricing');
        const pricingProducts = payload.draft_products.map((product) => ({
            product_id: product.product_id as string,
            variant_id: product.variant_id || null,
            quantity: product.quantity,
            has_personalization: !!product.personalization?.enabled,
            personalization_option_id: product.personalization?.option_id || null,
            selected_addons: product.selected_addons || []
        }));

        const { data: pricingData, error: pricingErrorMsg } = await calculateOrderTotalRPC(
            pricingProducts,
            delivery_fee, // Ensure delivery fee exactly matches the frontend override logic
            payload.address_id,
            payload.applied_coupon?.code || undefined,
            payload.use_wallet || false,
            user.id
        );

        const pricing = pricingData;
        logger.info('create_payment_order: pricing result', { pricing, pricingErrorMsg });

        if (pricingErrorMsg || !pricing) {
            return { error: pricingErrorMsg || 'Pricing verification failed', status: 400 };
        }

        // 3. SECURE VALIDATION (WYSHKIT 2026: Absolute Arithmetic)
        // We trust the total_paise directly from the kernel RPC result for payment.
        const server_amount = pricing.total_paise || Math.round(pricing.total * 100);
        const client_amount = Math.round(amount);

        if (Math.abs(server_amount - client_amount) > 100) {
            logger.warn('Price mismatch detected', { server_amount, client_amount, userId: user.id });
        }

        if (Math.abs(server_amount - client_amount) > (client_amount * 0.5)) {
            logger.error('Price mismatch detected (critical)', { server_amount, client_amount, userId: user.id });
            return { error: 'Price discrepancy too high. Please refresh cart.', status: 400 };
        }

        // 4. PERSIST METADATA TO CHECKOUT SESSION (WYSHKIT 2026)
        const { error: session_error } = await supabase.rpc('update_checkout_session', {
            p_user_id: user.id,
            p_applied_coupon: payload.applied_coupon?.code || undefined,
            p_gstin: payload.gstin || undefined,
            p_selected_address_id: payload.address_id,
            p_use_wallet: !!(payload.wallet_discount && payload.wallet_discount > 0)
        });

        if (session_error) {
            logger.error('Failed to update checkout session', session_error);
            return { error: 'Failed to prepare order session', status: 500 };
        }

        logger.info('create_payment_order: session updated');

        const { data: session } = await supabase.from('checkout_sessions').select('id').eq('user_id', user.id).single();
        const sessionId = session?.id || user.id;

        // WYSHKIT 2026: Deterministic Webhook Snapshotting
        // Save the exact cart payload to `snapshot_products` so the webhook doesn't rely on the live cart.
        if (session?.id) {
            const snapshotProducts = payload.draft_products.map(product => ({
                product_id: product.product_id,
                variant_id: product.variant_id || null,
                quantity: product.quantity,
                personalization: product.personalization || null,
                selected_addons: product.selected_addons || []
            }));
            await supabase.from('checkout_sessions').update({ snapshot_products: snapshotProducts as any }).eq('id', session.id);
        }

        // 5. PRE-PAYMENT HARDENING (WYSHKIT 2026)
        // Verify stock availability one last time before opening the gateway
        const { verifyStockAvailability } = await import('@/lib/actions/commerce/inventory');
        const stockCheck = await verifyStockAvailability(
            payload.draft_products.map(p => ({
                product_id: p.product_id,
                variant_id: p.variant_id,
                quantity: p.quantity
            }))
        );

        if (!stockCheck.success) {
            return {
                error: `INSUFFICIENT_STOCK: ${stockCheck.outOfStockProduct || 'One or more items'}`,
                status: 400
            };
        }

        // 6. RAZORPAY ORDER
        const receipt = `order_${Date.now()}`;
        const order = await create_razorpay_order(
            server_amount,
            currency,
            receipt,
            {
                userId: user.id,
                sessionId: sessionId,
            }
        );

        logger.info('create_payment_order: razorpay order created', { razorpayOrderId: order.id });

        // 6. [PURGED] STOCK RESERVATION (Moving to Absolute Atomicity in DB)

        return {
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                sessionId: sessionId
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
        const { get_order_with_history } = await import('../commerce/orders');
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            logger.error('verify_payment_signature: user not found in session');
            return { error: 'User session not found', status: 401 };
        }

        // 1. Fetch Session & Cart Data
        const { data: session, error: session_error } = await supabase
            .from('checkout_sessions')
            .select('*')
            .eq('id', payload.draft_id)
            .single();

        if (session_error || !session) {
            logger.error('verify_payment_signature: session not found', { sessionId: payload.draft_id });
            return { error: 'Order session expired. Please try again.', status: 404 };
        }

        // WYSHKIT 2026: Deterministic Execution via Session Snapshot
        // Bypassing the mutable `v_active_cart_detailed` to prevent race conditions during transaction settlement.
        const cart_products = session.snapshot_products as any[];

        if (!cart_products || cart_products.length === 0) {
            return { error: 'Your checkout session expired or is invalid. Cannot finalize order.', status: 400 };
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
        const has_pers = cart_products.some(product => (product.personalization as any)?.enabled);

        const order_result = await executeCommerceIntent({
            intent: 'PLACE_ORDER',
            payload: {
                razorpay_order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                products: cart_products.map(product => ({
                    product_id: product.product_id ?? '',
                    variant_id: product.variant_id,
                    quantity: product.quantity,
                    personalization: product.personalization,
                    selected_addons: product.selected_addons
                })) as any,
                address_id: session.selected_address_id || undefined,
                coupon_code: session.applied_coupon || undefined,
                use_wallet: session.use_wallet || false,
                gstin: session.gstin || undefined,
                // [DEPRECATION] instructions/distance moved to RPC context or hardcoded defaults
            }
        });

        if (!order_result.success) {
            return { error: order_result.error || 'Failed to finalize order', status: 500 };
        }

        const order_id = (order_result.data as any)?.order_id;
        const order_number = (order_result.data as any)?.order_number;

        // Session cleanup happens inside executeCommerceIntent('PLACE_ORDER') switch case
        // But for guard:
        await supabase.from('checkout_sessions').delete().eq('id', session.id);

        return {
            success: true,
            verified: true,
            order_id: order_id,
            order_number: order_number,
            has_personalization: has_pers,
            order: {
                ...order_result.data as any,
                id: order_id
            },
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
export async function cleanup_stale_sessions() {
    try {
        const { createAdminClient } = await import('@/lib/supabase/server');
        const supabase = await createAdminClient();
        const { error } = await supabase
            .from('checkout_sessions')
            .delete()
            .lt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        if (error) {
            logger.error('Failed to cleanup sessions', error);
            return { success: false, error };
        }

        return { success: true };
    } catch (error) {
        logError(error, 'cleanup_stale_sessions');
        return { success: false, error };
    }
}
