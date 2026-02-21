import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { update_order_status } from '@/lib/actions/partner/partner-actions';
import { logger } from '@/lib/logging/logger';
import { ORDER_STATUS } from '@/lib/types/order-status';

/**
 * SHADOWFAX WEBHOOK HANDLER (F11)
 * Receives delivery status updates from Shadowfax and updates WyshKit order status.
 */
export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);
    const headers = req.headers;

    // WYSHKIT 2026: Security Hardening (HMAC Verification)
    const { ShadowfaxService } = await import('@/lib/services/shadowfax');
    const signature = headers.get('X-Shadowfax-Signature') || headers.get('x-shadowfax-signature') || '';

    if (!ShadowfaxService.verifyWebhook(bodyText, signature)) {
      logger.warn('Shadowfax Webhook: Invalid signature or unauthorized attempt', { signature });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Shadowfax Webhook received', { body });

    const { client_order_id, status, awb_number } = body;

    if (!client_order_id) {
      return NextResponse.json({ error: 'Missing client_order_id' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // 1. Log Webhook for Audit (Elite Pattern)
    const { data: log, error: logError } = await supabase.from('webhook_logs').insert({
      source: 'shadowfax',
      external_id: awb_number || client_order_id,
      payload: body
    }).select().single();

    if (logError) {
      logger.error('Shadowfax Webhook: Failed to log payload', logError);
      // We continue even if log fails, but it's not ideal
    }

    // 2. Map Shadowfax status to WyshKit ORDER_STATUS
    let targetStatus: string | null = null;
    switch (status?.toLowerCase()) {
      case 'picked_up':
      case 'in_transit':
        targetStatus = ORDER_STATUS.OUT_FOR_DELIVERY;
        break;
      case 'delivered':
        targetStatus = ORDER_STATUS.DELIVERED;
        break;
      case 'cancelled':
      case 'returned':
      case 'failed':
        targetStatus = ORDER_STATUS.CANCELLED;
        break;
      default:
        logger.info('Shadowfax Webhook: Unmapped status ignored', { status, client_order_id });
        return NextResponse.json({ message: 'Status unmapped' });
    }

    // 3. Perform Idempotent Transition via RPC
    const { data: transitioned, error: transitionError } = await supabase.rpc('transition_order_status', {
      p_order_id: client_order_id,
      p_new_status: targetStatus,
      p_metadata: { webhook_log_id: log?.id }
    });

    if (transitionError) {
      logger.error('Shadowfax Webhook: RPC Transition failed', transitionError);
      return NextResponse.json({ error: transitionError.message }, { status: 500 });
    }

    if (transitioned) {
      // 4. Mark log as processed
      if (log) {
        await supabase.from('webhook_logs').update({ processed_at: new Date().toISOString() }).eq('id', log.id);
      }

      // 5. Trigger Post-Delivery Events
      if (targetStatus === ORDER_STATUS.DELIVERED) {
        try {
          const { trigger_post_delivery_events } = await import('@/lib/actions/partner/settlement');
          await trigger_post_delivery_events(client_order_id);
        } catch (postDeliveryError) {
          logger.error('Shadowfax Webhook: Post-delivery triggers failed', postDeliveryError);
        }
      }
      logger.info('Shadowfax Webhook: Processed successfully', { client_order_id, targetStatus });
    } else {
      logger.info('Shadowfax Webhook: No transition needed (Idempotent)', { client_order_id, targetStatus });
    }


    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Shadowfax Webhook: Internal error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
