import { createAdminClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { ORDER_STATUS } from '@/lib/types/order-status';

/**
 * ENFORCE DESIGN DEADLINES (Wyshkit 2026)
 * Scans for:
 * 1. Confirmed orders where customer hasn't shared details for 24h (Cancel/Partial Refund)
 * 2. Preview Ready orders where customer hasn't actioned for 24h (Auto-Approve)
 */
export async function enforce_design_deadlines() {
    // WYSHKIT 2026: Design deadlines are now managed by a separate worker 
    // that monitors metadata fields. Placeholder for future expansion.
    return { count: 0 };
}

/**
 * ENFORCE ACCEPTANCE DEADLINES (Hyperlocal Speed)
 * Scans for orders in PLACED state that have passed their accept_deadline (5m)
 * Automatically cancels and issues a FULL refund since vendor failed to act.
 */
export async function enforce_acceptance_deadlines() {
    try {
        const supabase = await createAdminClient();
        const now_iso = new Date().toISOString();

        const five_minutes_ago = new Date(Date.now() - 5 * 60 * 1000).toISOString();

        const { data: expired_orders, error } = await supabase
            .from('orders')
            .select('id, order_number, payment_status, payment_id, total')
            .eq('status', ORDER_STATUS.PLACED)
            .lt('created_at', five_minutes_ago);

        if (error) throw error;
        if (!expired_orders || expired_orders.length === 0) return { count: 0 };

        let processed_count = 0;
        for (const order of expired_orders) {
            let payment_updates = {};
            if (['paid', 'PAID', 'captured', 'CAPTURED'].includes(order.payment_status || '') && order.payment_id) {
                try {
                    const { refund_payment } = await import('@/lib/services/razorpay');
                    const refund_amount_paise = Math.round(Number(order.total) * 100);
                    await refund_payment(order.payment_id, refund_amount_paise);
                    payment_updates = {
                        payment_status: 'refunded',
                        refunded_amount: order.total
                    };
                } catch (refund_error) {
                    logger.error(`Auto-refund failed for expired order ${order.order_number}`, refund_error);
                }
            }

            // WYSHKIT 2026: Use transition_order RPC for atomic cancellation
            await supabase.rpc('transition_order', {
                p_order_id: order.id,
                p_target_status: ORDER_STATUS.CANCELLED,
                p_metadata: {
                    reason: 'acceptance_timeout',
                    cancelled_by: 'system',
                    ...payment_updates
                } as any
            });
            processed_count++;
        }

        return { count: processed_count };
    } catch (error) {
        logger.error('enforce_acceptance_deadlines failed', error);
        return { error: 'Internal error' };
    }
}
