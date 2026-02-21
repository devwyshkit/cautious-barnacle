'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { credit_cashback_on_delivery } from './cashback';
import { logger } from '@/lib/logging/logger';
import { PRICING } from '@/lib/constants/pricing';

/**
 * WYSHKIT 2026: Post-Delivery Business Logic
 * Triggered by Shadowfax 'delivered' webhook or manual override.
 * Logic:
 * 1. Calculate and Record Settlement (Partner Revenue)
 * 2. Credit Customer Cashback
 * 3. Flag Invoice as Ready
 */
export async function trigger_post_delivery_events(order_id: string) {
    try {
        const supabase = await createAdminClient();

        // 1. Fetch Order with Partner Details
        const { data: order, error: fetch_error } = await supabase
            .from('orders')
            .select(`
        *,
        partner:partners(commission_percentage)
      `)
            .eq('id', order_id)
            .single();

        if (fetch_error || !order) {
            logger.error('Order not found for settlement', fetch_error, { order_id });
            throw new Error('Order not found for settlement');
        }

        // Idempotency: Don't process if already settled
        if (order.net_settlement_amount !== null && order.net_settlement_amount > 0) {
            logger.info('Order already settled, skipping post-delivery events', { order_id });
            return { success: true, message: 'Already settled' };
        }

        // 2. SETTLEMENT CALCULATION (Swiggy 2026 Model)
        const total = Number(order.total);
        const commission_rate = Number((order.partner as any)?.commission_percentage || 15) / 100;

        // Items + Service revenue for commission basis
        const commission_basis = Number(order.subtotal) + Number(order.personalization_charges || 0);
        const commission_amount = Math.round(commission_basis * commission_rate);

        // Razorpay Fees (Approx 2% + GST) - Standard estimation
        const razorpay_fees = Math.round(total * 0.02);

        // Platform Fee (WyshKit Revenue)
        const platform_fee = Number(order.platform_fee || PRICING.PLATFORM_FEE);

        // Net to Partner = Total - Commission - RP Fees - Platform Fee
        // Note: GST is collected by partner and handled in their proforma/tax filing
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

        // 4. CREDIT CASHBACK (Customer Reward)
        try {
            await credit_cashback_on_delivery(order_id, order.user_id, total);
        } catch (cashback_error) {
            // Minor failure, don't crash the whole flow but log it
            logger.error('Cashback credit failed', cashback_error, { order_id });
        }

        logger.info('Post-delivery events triggered successfully', { order_id, net_settlement });
        return { success: true };

    } catch (error) {
        logger.error('Failed to trigger post-delivery events', error, { order_id });
        return { success: false, error: 'Internal logic failure' };
    }
}
