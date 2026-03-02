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

        // 2. SETTLEMENT CALCULATION (WYSHKIT 2026 Model - Enforcing Law 1)
        // [PURIFIED] Authority moves to Postgres Kernel.
        const { data: rawSettlementData, error: settlementError } = await supabase.rpc('calculate_vendor_settlement', {
            p_order_id: order_id
        });

        const settlementData = rawSettlementData as {
            success: boolean;
            net_settlement_amount: number;
            commission_amount: number;
        } | null;

        if (settlementError || !settlementData?.success) {
            logger.error('Kernel settlement calculation failed', { settlementError, order_id });
            throw new Error('Kernel settlement calculation failed');
        }

        const net_settlement = settlementData.net_settlement_amount;
        const commission_amount = settlementData.commission_amount;

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
            await credit_wyshkit_money_on_delivery(order_id, order.user_id, Number(order.total));
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
