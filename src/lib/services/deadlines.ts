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
    try {
        const supabase = await createAdminClient();
        const now = new Date();
        const now_iso = now.toISOString();
        const twenty_four_hours_ago = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

        let processed_count = 0;

        // 1. CLEANUP: No Personalization Details for 24h
        // WYSHKIT 2026: Partial Refund Policy - Partner slot reservation fee (₹50) retained.
        const { data: detail_timeouts } = await supabase
            .from('orders')
            .select('id, order_number, payment_id, total, payment_status')
            .eq('status', ORDER_STATUS.CONFIRMED)
            .eq('has_personalization', true)
            .is('personalization_input', null)
            .lt('created_at', twenty_four_hours_ago);

        if (detail_timeouts && detail_timeouts.length > 0) {
            for (const order of detail_timeouts) {
                let payment_updates = {};
                const partner_stake = 50; // Partner compensation for reservation slot
                const refund_amount = Math.max(0, (Number(order.total) || 0) - partner_stake);

                if (['paid', 'PAID', 'captured', 'CAPTURED'].includes(order.payment_status || '') && order.payment_id) {
                    try {
                        const { refund_payment } = await import('@/lib/services/razorpay');
                        const refund_amount_paise = Math.round(refund_amount * 100);
                        await refund_payment(order.payment_id, refund_amount_paise);
                        payment_updates = {
                            payment_status: 'partial_refunded',
                            refunded_amount: refund_amount
                        };
                    } catch (e) {
                        logger.error(`Auto-refund failed for design timeout ${order.order_number}`, e);
                    }
                }

                await supabase.from('orders').update({
                    status: ORDER_STATUS.CANCELLED,
                    updated_at: now_iso,
                    cancellation_reason: `Design deadline expired (24h). Partner compensated ₹${partner_stake} for time slot.`,
                    cancelled_by: 'system',
                    ...payment_updates
                }).eq('id', order.id);

                await (supabase as any).rpc('log_order_status_history', {
                    p_order_id: order.id,
                    p_type: 'auto_cancelled_timeout',
                    p_title: 'Order Cancelled',
                    p_description: `Personalization details were not shared within 24 hours. A refund of ₹${refund_amount} has been initiated (₹${partner_stake} retained for partner).`,
                    p_metadata: {
                        reason: 'design_timeout',
                        original_total: order.total,
                        refund_amount: refund_amount,
                        partner_stake: partner_stake
                    }
                });
                processed_count++;
            }
        }

        // 2. AUTO-APPROVE: No Preview Action for 24h
        // WYSHKIT 2026: "Silence is Consent" - Move to APPROVED so production can start.
        const { data: preview_timeouts } = await supabase
            .from('orders')
            .select('id, order_number')
            .eq('status', ORDER_STATUS.PREVIEW_READY)
            .lt('preview_uploaded_at', twenty_four_hours_ago);

        if (preview_timeouts && preview_timeouts.length > 0) {
            for (const order of preview_timeouts) {
                const { data: preview } = await supabase
                    .from('preview_submissions')
                    .select('id')
                    .eq('order_id', order.id)
                    .eq('status', 'pending')
                    .order('submitted_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (preview) {
                    await supabase.from('preview_submissions').update({ status: 'approved' }).eq('id', preview.id);
                    await supabase.from('orders').update({
                        status: ORDER_STATUS.APPROVED,
                        approved_at: now_iso,
                        updated_at: now_iso
                    }).eq('id', order.id);

                    await (supabase as any).rpc('log_order_status_history', {
                        p_order_id: order.id,
                        p_type: 'auto_approved',
                        p_title: 'Design Auto-Approved',
                        p_description: 'The design has been auto-approved after 24 hours of inactivity. Production will begin shortly.',
                        p_metadata: { reason: 'preview_timeout' }
                    });
                    processed_count++;
                }
            }
        }

        return { count: processed_count };
    } catch (error) {
        logger.error('enforce_design_deadlines failed', error);
        return { error: 'Internal error' };
    }
}

/**
 * ENFORCE ACCEPTANCE DEADLINES (Hyperlocal Speed)
 * Scans for orders in PLACED state that have passed their accept_deadline (5m)
 * Automatically cancels and issues a FULL refund since partner failed to act.
 */
export async function enforce_acceptance_deadlines() {
    try {
        const supabase = await createAdminClient();
        const now_iso = new Date().toISOString();

        const { data: expired_orders, error } = await supabase
            .from('orders')
            .select('id, order_number, payment_status, payment_id, total')
            .eq('status', ORDER_STATUS.PLACED)
            .lt('accept_deadline', now_iso);

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

            await supabase.from('orders').update({
                status: ORDER_STATUS.CANCELLED,
                updated_at: now_iso,
                cancelled_by: 'system',
                cancellation_reason: 'Partner acceptance timeout (5m)',
                ...payment_updates
            }).eq('id', order.id);

            await (supabase as any).rpc('log_order_status_history', {
                p_order_id: order.id,
                p_type: 'auto_cancelled_deadline',
                p_title: 'Order Expired',
                p_description: 'Order automatically cancelled as the partner did not accept it within the deadline. Full refund initiated.',
                p_metadata: { reason: 'acceptance_timeout' }
            });
            processed_count++;
        }

        return { count: processed_count };
    } catch (error) {
        logger.error('enforce_acceptance_deadlines failed', error);
        return { error: 'Internal error' };
    }
}
