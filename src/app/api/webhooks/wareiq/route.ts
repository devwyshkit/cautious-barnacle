import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { ORDER_STATUS } from '@/lib/types/order-status';
import type { Database, Json } from '@/lib/supabase/database.types';

/**
 * WAREIQ WEBHOOK HANDLER
 * 
 * Documentation: https://api.hklogisticsgroup.com/v1/webhooks
 * Doctrine: Swiggy 2026 - Zero Overengineering, Realtime-First
 */
export async function POST(req: NextRequest) {
    try {
        // 1. Security Check: Custom Header Authorization
        const secretHeader = req.headers.get('X-Wyshkit-Secret');
        const expectedSecret = 'b57e842183c544e78a631e5f03494e1d'; // Internal handshake key

        if (secretHeader !== expectedSecret) {
            logger.warn('WareIQ Webhook: Unauthorized access attempt', {
                ua: req.headers.get('user-agent'),
                ip: req.headers.get('x-forwarded-for')
            });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        logger.info('WareIQ Webhook: Payload received', { body });

        // WareIQ Payload Structure (Common pattern):
        // { event: "shipment.status_update", data: { order_number: "...", status: "...", awb: "..." } }
        const { event, data } = body;
        const { order_number, status, awb } = data || {};

        if (!order_number && !awb) {
            logger.error('WareIQ Webhook: Missing identifiers in payload', { body });
            return NextResponse.json({ error: 'Missing identifier' }, { status: 400 });
        }

        const supabase = await createAdminClient();

        // 2. Log Webhook for Audit
        const { data: log, error: logError } = await supabase
            .from('webhook_logs')
            .upsert({
                source: 'wareiq',
                external_id: awb || order_number,
                payload: body as unknown as Json
            }, { onConflict: 'external_id' })
            .select()
            .single();

        if (logError && logError.code !== '23505') {
            logger.error('WareIQ Webhook: Failed to log payload', logError);
        }

        // 3. Map WareIQ status to WyshKit ORDER_STATUS
        // Common WareIQ/HKLogistics statuses to map
        let targetStatus: string | null = null;
        const wareiqStatus = (status || '').toLowerCase();

        switch (wareiqStatus) {
            case 'assigned':
            case 'ready_to_ship':
                targetStatus = ORDER_STATUS.PACKED;
                break;
            case 'shipped':
            case 'in_transit':
            case 'out_for_delivery':
                targetStatus = ORDER_STATUS.OUT_FOR_DELIVERY;
                break;
            case 'delivered':
                targetStatus = ORDER_STATUS.DELIVERED;
                break;
            case 'cancelled':
                targetStatus = ORDER_STATUS.CANCELLED;
                break;
            case 'rto':
                targetStatus = ORDER_STATUS.CANCELLED; // Map RTO to cancelled for simplicity in V1
                break;
            default:
                logger.info('WareIQ Webhook: Unmapped status ignored', { wareiqStatus, order_number });
                return NextResponse.json({ message: 'Status skipped' });
        }

        // 4. Perform Idempotent Transition via RPC
        // WareIQ order_number usually matches our generated order_number
        const { data: transitioned, error: transitionError } = await (supabase.rpc as any)('transition_order_by_number', {
            p_order_number: order_number,
            p_target_status: targetStatus as Database['public']['Enums']['order_status'],
            p_metadata: {
                webhook_log_id: log?.id,
                wareiq_event: event,
                wareiq_status: status
            } as unknown as Json
        });

        if (transitionError) {
            // Attempt transition by ID as fallback if order_number doesn't match or is numeric
            logger.warn('WareIQ Webhook: RPC order_number transition failed, attempting ID fallback', { transitionError });

            const { error: idTransitionError } = await supabase.rpc('transition_order', {
                p_order_id: order_number, // Sometimes numeric string is the Internal ID
                p_target_status: targetStatus as Database['public']['Enums']['order_status'],
                p_metadata: { webhook_log_id: log?.id } as unknown as Json
            });

            if (idTransitionError) {
                logger.error('WareIQ Webhook: All transition attempts failed', idTransitionError);
                return NextResponse.json({ error: idTransitionError.message }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, event });
    } catch (error) {
        logger.error('WareIQ Webhook: Internal error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
