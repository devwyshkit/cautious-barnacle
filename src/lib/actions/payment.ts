'use server';

import { createRazorpayOrder, verifyPayment } from '@/lib/services/razorpay';
import { createClient } from '@/lib/supabase/server';
import { logError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/logging/logger';
import { hasAnyPersonalization } from '@/lib/utils/personalization';
import { calculateHaversineDistance } from '@/lib/utils/distance';
import { getDeliveryFeeByDistance } from '@/lib/utils/pricing';

// WYSHKIT 2026: Node-level recalculateOrderTotal removed.
// We now use the database-level 'calculate_order_total' RPC for authority.

import { DraftLineItem } from '@/lib/types/personalization';
import type { Database, Json } from '@/lib/supabase/database.types';
import { createOrder, getOrderWithHistory } from '@/lib/actions/orders';

export interface PricingResult {
    subtotal: number;
    total: number;
    gst?: number;
    delivery_fee: number;
    platform_fee?: number;
    discount?: number;
    savings?: number;
    error?: string;
}

interface DraftMetadata {
    gstin?: string | null;
    deliveryInstructions?: string | null;
    couponCode?: string | null;
    useWallet?: boolean;
    pricing?: PricingResult;
    distanceKm?: number | null;
    deliveryFee?: number | null;
}

// WYSHKIT 2026: Single-Trip Pricing Recalculation via Database RPC
// Authority moves from Node.js logic to Postgres Logic
export async function createPaymentOrder(
    amount: number, // Client-provided amount (for validation)
    currency: string = 'INR',
    payload: {
        addressId: string;
        draftItems: DraftLineItem[];
        pricing: PricingResult;
        gstin?: string;
        appliedCoupon?: { code: string } | null;
        walletDiscount?: number;
        useWallet?: boolean;
        deliveryInstructions?: string;
    }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { error: 'Unauthorized', status: 401 };
        if (!payload.draftItems || payload.draftItems.length === 0) return { error: 'No items in cart', status: 400 };

        // 1. Resolve address and distance for accurate delivery fee calculation
        const { data: address } = await supabase
            .from('addresses')
            .select('latitude, longitude')
            .eq('id', payload.addressId)
            .maybeSingle();

        let deliveryFee = 40; // Default minimum
        let distanceKm = null;

        if (address?.latitude && address?.longitude) {
            // Fetch partner coordinates from the first item
            const firstItemId = payload.draftItems[0].item_id;
            const { data: itemData } = await supabase
                .from('items')
                .select('partner_id, partners(latitude, longitude)')
                .eq('id', firstItemId)
                .single();

            const partnerLat = (itemData as any)?.partners?.latitude;
            const partnerLng = (itemData as any)?.partners?.longitude;

            if (partnerLat && partnerLng) {
                distanceKm = calculateHaversineDistance(
                    address.latitude,
                    address.longitude,
                    partnerLat,
                    partnerLng
                );
                deliveryFee = getDeliveryFeeByDistance(distanceKm);
            }
        }

        // 1.5. WYSHKIT 2026: CLEANUP PREVIOUS RESERVATIONS (Self-Lockout Prevention)
        await supabase.from('stock_reservations').delete().eq('user_id', user.id);

        // 1.6. WYSHKIT 2026: BATCHED INVENTORY CHECK (F4)
        const stockChecks = payload.draftItems.map(async (item) => {
            const vId = item.selected_variant_id || null;
            const itemId = item.item_id;
            const qtyNeeded = item.quantity || 1;

            const { data: availableStock, error: stockError } = await supabase.rpc('get_available_stock', {
                p_variant_id: vId || undefined,
                p_item_id: itemId,
                p_exclude_user_id: user.id
            });

            if (stockError) throw new Error(`Stock verification failed for ${item.item_name || itemId}`);
            const available = Number(availableStock) || 0;
            if (available < qtyNeeded) {
                throw new Error(`Insufficient stock for "${item.item_name || 'Item'}". Only ${available} available.`);
            }
            return true;
        });

        try {
            await Promise.all(stockChecks);
        } catch (err) {
            const e = err as Error;
            logger.error('Inventory check failed', { error: e.message });
            return { error: e.message, status: 409 };
        }

        // 2. FETCH PRICING FROM DB RPC
        const { data: pricingData, error: pricingError } = await supabase.rpc('calculate_order_total', {
            p_cart_items: payload.draftItems.map((item) => ({
                itemId: item.item_id,
                quantity: item.quantity,
                variantId: item.selected_variant_id || null,
                personalization_option_id: item.personalization?.option_id || null,
                hasPersonalization: !!item.personalization?.enabled,
                selectedAddons: item.selected_addons || []
            })) as unknown as Json,
            p_delivery_fee_override: deliveryFee,
            p_address_id: payload.addressId,
            p_coupon_code: payload.appliedCoupon?.code || undefined,
            p_distance_km: distanceKm || undefined,
            p_use_wallet: payload.useWallet || false,
            p_user_id: user.id
        });

        const pricing = pricingData as unknown as PricingResult;

        if (pricingError || pricing?.error) {
            return { error: pricing?.error || 'Pricing verification failed', status: 400 };
        }

        // 3. SECURE VALIDATION
        const serverAmount = Math.round(pricing.total * 100);
        const clientAmount = Math.round(amount);

        if (Math.abs(serverAmount - clientAmount) > 100) {
            logger.warn('Price mismatch detected', { serverAmount, clientAmount, userId: user.id });
        }

        if (Math.abs(serverAmount - clientAmount) > (clientAmount * 0.5)) {
            logger.error('Price mismatch detected (critical)', { serverAmount, clientAmount, userId: user.id });
            return { error: 'Price discrepancy too high. Please refresh cart.', status: 400 };
        }

        // 4. PERSIST DRAFT (WYSHKIT 2026: Bypass Razorpay Notes Limit)
        const { data: draft, error: draftError } = await supabase
            .from('draft_orders')
            .insert({
                user_id: user.id,
                items: payload.draftItems.map((item) => ({
                    item_id: item.item_id,
                    variant_id: item.selected_variant_id || null,
                    quantity: item.quantity,
                    has_personalization: !!item.personalization?.enabled,
                    personalization: item.personalization || null,
                    selected_addons: item.selected_addons || [],
                })) as unknown as Json,
                address_id: payload.addressId,
                metadata: {
                    gstin: payload.gstin || null,
                    deliveryInstructions: (payload.deliveryInstructions || '').trim(),
                    couponCode: payload.appliedCoupon?.code || null,
                    useWallet: !!(payload.walletDiscount && payload.walletDiscount > 0),
                    pricing: pricingData,
                    distanceKm: distanceKm,
                    deliveryFee: deliveryFee
                } as unknown as Json
            })
            .select('id')
            .single();

        if (draftError) {
            logger.error('Failed to create draft order', draftError);
            return { error: 'Failed to prepare order', status: 500 };
        }

        // 5. RAZORPAY ORDER
        const receipt = `order_${Date.now()}`;
        const order = await createRazorpayOrder(
            serverAmount,
            currency,
            receipt,
            {
                userId: user.id,
                draftId: draft.id,
            }
        );

        // 6. HARDENING P0: STOCK RESERVATION
        const reservationInserts = payload.draftItems.map((item) => ({
            user_id: user.id,
            payment_intent_id: order.id,
            item_id: item.item_id,
            variant_id: item.selected_variant_id || null,
            quantity: item.quantity || 1,
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        }));

        const { error: reserveError } = await supabase
            .from('stock_reservations')
            .insert(reservationInserts);

        if (reserveError) {
            logger.error('Failed to reserve stock', reserveError);
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
        logError(error, 'CreatePaymentOrder');
        return { error: 'Failed to create payment order', status: 500 };
    }
}

// WYSHKIT 2026: Atomic Payment Verification & Order Placement
export async function verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    payload: {
        draftId: string; // F4: Use Draft ID for reliability
    }
) {
    try {
        const { verifyPayment } = await import('@/lib/services/razorpay');
        const { createOrder, getOrderWithHistory } = await import('@/lib/actions/orders');
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            logger.error('verifyPaymentSignature: user not found in session');
            return { error: 'User session not found', status: 401 };
        }

        // 1. Fetch Draft Data
        const { data: draft, error: draftError } = await supabase
            .from('draft_orders')
            .select('*')
            .eq('id', payload.draftId)
            .single();

        if (draftError || !draft) {
            logger.error('verifyPaymentSignature: draft not found', { draftId: payload.draftId });
            return { error: 'Order session expired. Please try again.', status: 404 };
        }

        // 2. Verification Logic
        const isValid = await verifyPayment(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );
        if (!isValid) return { error: 'Invalid payment signature', status: 400 };

        // WYSHKIT 2026: Idempotency Check (Anti-Double-Ordering)
        const { data: existingOrder } = await supabase
            .from('orders')
            .select('id, order_number, has_personalization')
            .eq('razorpay_order_id', razorpayOrderId)
            .maybeSingle();

        if (existingOrder) {
            logger.info('verifyPaymentSignature: order already exists (webhook won)', { orderId: existingOrder.id });

            // WYSHKIT 2026: Fetch full details for the success overlay
            const { order: orderWithDetails } = await getOrderWithHistory(existingOrder.id);

            return {
                success: true,
                verified: true,
                orderId: existingOrder.id,
                orderNumber: existingOrder.order_number,
                hasPersonalization: existingOrder.has_personalization,
                order: orderWithDetails || existingOrder,
                error: null,
            };
        }

        // 3. ATOMIC ORDER PLACEMENT
        const metadata = (draft.metadata as unknown as DraftMetadata) || {};

        // Calculate personalization flag for UI feedback
        const draftItems = (draft.items as unknown as DraftLineItem[]) || [];
        const hasPers = hasAnyPersonalization(draftItems);

        const orderResult = await createOrder({
            addressId: draft.address_id || '',
            items: draftItems as any, // Internal cast to RPC shape
            razorpayOrderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            couponCode: metadata.couponCode || undefined,
            useWallet: metadata.useWallet,
            gstin: metadata.gstin || undefined,
            deliveryInstructions: metadata.deliveryInstructions || undefined,
            distanceKm: metadata.distanceKm || undefined,
            deliveryFee: metadata.deliveryFee || undefined,
            userId: user.id,
            useAdmin: true
        });

        if (!('success' in orderResult) || !orderResult.success) {
            return { error: ('error' in orderResult ? (orderResult as any).error : 'Failed to finalize order') || 'Failed to finalize order', status: 500 };
        }

        // Cleanup draft
        await supabase.from('draft_orders').delete().eq('id', draft.id);

        return {
            success: true,
            verified: true,
            orderId: (orderResult as any).orderId,
            orderNumber: (orderResult as any).orderNumber,
            hasPersonalization: hasPers,
            order: (orderResult as any).order, // Enriched Data from RPC
            error: null,
        };
    } catch (error) {
        logError(error, 'VerifyPaymentSignature');
        return { error: 'Payment verification failed', status: 500 };
    }
}

/**
 * WYSHKIT 2026: Cleanup logic for stale draft orders.
 * This can be called from a maintenance worker or cron job.
 */
export async function cleanupDraftOrders() {
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
        logError(error, 'CleanupDraftOrders');
        return { success: false, error };
    }
}
