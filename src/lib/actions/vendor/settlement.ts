'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { credit_wyshkit_money_on_delivery } from '../user/cashback';
import { logger } from '@/lib/logging/logger';
import type { PricingBreakdown } from '@/lib/types/pricing';

/**
 * WYSHKIT 2026: Post-Delivery Business Logic
 * Triggered by Shadowfax 'delivered' webhook or manual override.
 * Logic:
 * 1. Calculate and Record Settlement (Vendor Revenue)
 * 2. Credit Customer Cashback
 * 3. Flag Invoice as Ready
 */
export async function trigger_post_delivery_events(order_id: string) {
    try {
        const supabase = await createAdminClient();

        // 1. Fetch Order with Vendor Details
        const { data: order, error: fetch_error } = await supabase
            .from('orders')
            .select(`
        *,
        vendor:vendors(commission_percentage)
      `)
            .eq('id', order_id)
            .single();

        if (fetch_error || !order) {
            logger.error('Order not found for settlement', fetch_error, { order_id });
            throw new Error('Order not found for settlement');
        }

        // Idempotency: Don't process if already settled
        const order_data = order as any;
        if (order_data.net_settlement_amount !== null && order_data.net_settlement_amount > 0) {
            logger.info('Order already settled, skipping post-delivery events', { order_id });
            return { success: true, message: 'Already settled' };
        }

        // 2. SETTLEMENT CALCULATION (WYSHKIT 2026 Model)
        // [PURIFIED] trust vendor.commission_percentage for settlement authority
        const vendor = order.vendor as any;
        const commission_rate = Number(vendor?.commission_percentage ?? 18) / 100;

        const total = Number(order.total);
        const subtotal = Number(order.subtotal);
        const personalization_charges = Number(order.personalization_charges || 0);
        const platform_fee = Number(order.platform_fee || 0);

        // commission_basis = products + personalization (service fee)
        const commission_basis = subtotal + personalization_charges;
        const commission_amount = Math.round(commission_basis * commission_rate);

        // Razorpay Fees (Approx 2% + GST) - captured during payment or estimated if missing
        const razorpay_fees = Math.round(total * 0.02);

        // Net to Vendor = Total - Commission - RP Fees - Platform Fee
        const net_settlement = total - commission_amount - razorpay_fees - platform_fee;

        // 3. PERSIST SETTLEMENT & TRIGGER POST-DELIVERY STATE
        const { error: update_error } = await supabase
            .from('orders')
            .update({
                commission_amount: commission_amount,
                net_settlement_amount: Math.max(0, net_settlement),
                delivered_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', order_id);

        if (update_error) throw update_error;

        // 4. CREDIT WYSHKIT MONEY (Customer Reward)
        try {
            await credit_wyshkit_money_on_delivery(order_id, order.user_id, total);
        } catch (wyshkit_money_error) {
            // Minor failure, don't crash the whole flow but log it
            logger.error('WyshKit Money credit failed', wyshkit_money_error, { order_id });
        }

        logger.info('Post-delivery events triggered successfully', { order_id, net_settlement });
        return { success: true };

    } catch (error) {
        logger.error('Failed to trigger post-delivery events', error, { order_id });
        return { success: false, error: 'Internal logic failure' };
    }
}
