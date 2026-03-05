import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { ORDER_STATUS } from '@/lib/types/order-status';
import type { Database, Json } from '@/lib/supabase/database.types';

/**
 * SHIPROCKET WEBHOOK HANDLER
 * Receives delivery status updates from Shiprocket and updates WyshKit order status.
 * https://www.shiprocket.in/help/webhooks-settings/
 */
export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const body = JSON.parse(bodyText);

        // Shiprocket sends a signature or tokens if configured. 
        // For now, we'll log and process based on awb and status.
        logger.info('Shiprocket Webhook received', { body });

        const { order_id, status, awb } = body;

        if (!order_id && !awb) {
            return NextResponse.json({ error: 'Missing identifier' }, { status: 400 });
        }

        const supabase = await createAdminClient();

        // 1. Log Webhook for Audit
        const { data: log, error: logError } = await supabase
            .from('webhook_logs')
            .upsert({
                source: 'shiprocket',
                external_id: awb || order_id,
                payload: body as unknown as Json
            }, { onConflict: 'external_id' })
            .select()
            .single();

        if (logError && logError.code !== '23505') {
            logger.error('Shiprocket Webhook: Failed to log payload', logError);
        }

        // 2. Map Shiprocket status to WyshKit ORDER_STATUS
        // Shiprocket statuses: https://www.shiprocket.in/help/shiprocket-order-status-codes/
        let targetStatus: string | null = null;
        const srStatus = status?.toLowerCase();

        switch (srStatus) {
            case 'picked up':
                targetStatus = ORDER_STATUS.OUT_FOR_DELIVERY;
                break;
            case 'delivered':
                targetStatus = ORDER_STATUS.DELIVERED;
                break;
            case 'cancelled':
                targetStatus = ORDER_STATUS.CANCELLED;
                break;
            case 'out for delivery':
                targetStatus = ORDER_STATUS.OUT_FOR_DELIVERY;
                break;
            case 'rto initiated':
            case 'rto delivered':
                targetStatus = ORDER_STATUS.CANCELLED; // Or RTO state if added
                break;
            default:
                logger.info('Shiprocket Webhook: Status ignored', { status: srStatus, order_id });
                return NextResponse.json({ message: 'Status skipped' });
        }

        // 3. Perform Idempotent Transition via RPC
        const { data: transitioned, error: transitionError } = await supabase.rpc('transition_order', {
            p_order_id: order_id, // This should match our internal ID if passed correctly in payload
            p_target_status: targetStatus as Database['public']['Enums']['order_status'],
            p_metadata: { webhook_log_id: log?.id, sr_status: srStatus } as unknown as Json
        });

        if (transitionError) {
            logger.error('Shiprocket Webhook: RPC Transition failed', transitionError);
            return NextResponse.json({ error: transitionError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error('Shiprocket Webhook: Internal error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
