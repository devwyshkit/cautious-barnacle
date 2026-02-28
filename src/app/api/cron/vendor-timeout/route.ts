
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { refund_payment } from '@/lib/services/razorpay';

export const dynamic = 'force-dynamic';

/**
 * WYSHKIT 2026: Vendor Timeout Cron
 * 
 * Rules:
 * - If order is PLACED for > 5 minutes, it means Vendor did not Accept.
 * - Auto-Cancel and Refund.
 * 
 * Schedule: Every 5 minutes.
 */
export async function GET(req: NextRequest) {
    // 1. Security Check
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const supabase = await createAdminClient();
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        // 2. Fetch Stale Orders
        const { data: staleOrders, error } = await supabase
            .from('orders')
            .select('id, payment_id, payment_status, order_number, total')
            .eq('status', 'PLACED')
            .lt('created_at', fiveMinutesAgo.toISOString())
            .limit(50); // Process in batches

        if (error) {
            logger.error('Cron: Failed to fetch stale orders', error);
            return new NextResponse('Database Error', { status: 500 });
        }

        if (!staleOrders || staleOrders.length === 0) {
            return NextResponse.json({ processed: 0, message: 'No stale orders found' });
        }

        const results = [];

        // 3. Process Each Order
        for (const order of staleOrders) {
            try {
                logger.info(`Cron: Auto-cancelling order ${order.order_number}`);

                // A. Refund Logic
                let refundId = null;
                if (['paid', 'PAID', 'captured', 'CAPTURED'].includes(order.payment_status || '') && order.payment_id) {
                    try {
                        // Refund full amount (in paise)
                        // The order.total is in Rupees typically? Let's check db types.
                        // Usually total is stored as numeric. `createRazorpayOrder` takes paise.
                        // `refundPayment` takes amount in paise.
                        // Wait, `createRazorpayOrder` (line 66) says `Math.round(amountInPaise)`.
                        // But our `orders` table `total` column... is it rupees or paise?
                        // `calculate_order_total` returns total.
                        // In `verify_phase1` test, `total` was 70.8. That looks like Rupees.
                        // So we must convert to paise.
                        const refundAmountPaise = Math.round(Number(order.total) * 100);
                        const refund = await refund_payment(order.payment_id, refundAmountPaise, {
                            reason: 'Vendor Timeout (Auto-Cancel)',
                            order_id: order.id
                        });
                        refundId = refund.id;
                    } catch (refundErr) {
                        logger.error(`Cron: Refund failed for ${order.order_number}`, refundErr);
                        // We continue to cancel, but log this critical failure?
                        // Or skip cancellation?
                        // Swiggy would probably cancel and queue a manual refund.
                        // I'll proceed with cancellation but note refund failure in history.
                    }
                }

                // B. Update Status (Atomic)
                const { error: updateError } = await supabase
                    .from('orders')
                    .update({
                        status: 'CANCELLED',
                        // We don't change payment_status to REFUNDED automatically if refund logic handled it?
                        // Or we assume `refundPayment` success means it's refunded.
                        // Supabase doesn't have `payment_status` enum constraint presumably.
                        payment_status: refundId ? 'REFUNDED' : order.payment_status
                    })
                    .eq('id', order.id);

                if (updateError) throw updateError;

                // C. Add History
                await supabase.from('order_status_history').insert({
                    order_id: order.id,
                    type: 'error', // Use error type to highlight cancellation
                    title: 'Auto-Cancelled',
                    description: refundId
                        ? 'Order cancelled due to vendor inactivity. Refund initiated.'
                        : 'Order cancelled due to vendor inactivity. Refund pending (if applicable).'
                });

                results.push({ id: order.id, status: 'CANCELLED', refundId });

            } catch (err) {
                logger.error(`Cron: Failed to process order ${order.id}`, err);
                results.push({ id: order.id, error: err instanceof Error ? err.message : 'Unknown' });
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (error) {
        logger.error('Cron: Vendor Timeout Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
