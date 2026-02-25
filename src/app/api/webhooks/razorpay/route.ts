import { NextRequest, NextResponse } from 'next/server';
import { validateWebhookSignature } from '@/lib/services/razorpay';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { Database, Json } from '@/lib/supabase/database.types';
import { log } from '@/lib/logging/logger';

import { executeCommerceIntent } from '@/lib/actions/commerce/intent-engine';
import { handleAPIError } from '@/lib/utils/error-handler';
import Razorpay from 'razorpay';
import { z } from 'zod';

const RazorpayWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string(),
        order_id: z.string().nullable(),
        amount: z.number(),
        currency: z.string(),
        status: z.string(),
        notes: z.record(z.string(), z.unknown()).optional(),
        error_description: z.string().optional(),
      })
    }).optional(),
    refund: z.object({
      entity: z.object({
        id: z.string(),
        payment_id: z.string(),
        amount: z.number(),
      })
    }).optional(),
  })
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    const isValid = validateWebhookSignature(body, signature, secret);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }


    const parseResult = RazorpayWebhookSchema.safeParse(JSON.parse(body));
    if (!parseResult.success) {
      log.error('[webhooks/razorpay] Invalid webhook payload', parseResult.error, { body });
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }
    const event = parseResult.data;

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    let supabase
    try {
      supabase = await createAdminClient();
    } catch (clientError) {
      log.error('[webhooks/razorpay] Failed to create Supabase client', clientError, { path: '/api/webhooks/razorpay' });
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    // Handle payment.captured event (NEW FLOW: Create order from payment)
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;

      if (!razorpayOrderId || !razorpayPaymentId) {
        return NextResponse.json({ received: true, message: 'Missing order_id or payment_id' });
      }

      try {
        // Fetch order from Razorpay to get notes (contains draftId, userId)
        const razorpayOrder = await razorpayInstance.orders.fetch(razorpayOrderId);
        const notes = (razorpayOrder.notes as Record<string, unknown>) || {};

        const userId = String(notes.userId || notes.user_id || '');
        const draftId = String(notes.draftId || notes.draft_id || '');

        if (!userId || !draftId) {
          log.error('[webhooks/razorpay] Missing required data in notes', { notes });
          return NextResponse.json({ error: 'Missing required data in payment notes' }, { status: 400 });
        }

        // Fetch checkout session
        const { data: session, error: sessionError } = await supabase
          .from('checkout_sessions')
          .select('*')
          .eq('id', draftId)
          .single();

        if (sessionError || !session) {
          log.error('[webhooks/razorpay] Session not found', { sessionId: draftId, error: sessionError });
          return NextResponse.json({ received: true, message: 'Session not found or expired' });
        }

        // Fetch snapshot_items from session for true determinism
        const cart_items = session.snapshot_items as any[];

        if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
          log.error('[webhooks/razorpay] Cart snapshot empty for session', { sessionId: draftId });
          return NextResponse.json({ received: true, message: 'Cart snapshot empty' });
        }

        // Check if order already exists (Idempotency - Layer 1: Orders Table)
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('razorpay_order_id', razorpayOrderId)
          .maybeSingle();

        if (existingOrder) {
          log.info('[webhooks/razorpay] Idempotency hit: Order already processed', { orderId: existingOrder.id, razorpayOrderId });
          return NextResponse.json({ received: true, message: 'Order already processed' });
        }

        // Idempotency - Layer 2: Webhook Logs (Elite Pattern)
        const { error: logError } = await supabase
          .from('webhook_logs')
          .upsert({
            source: 'razorpay',
            external_id: razorpayPaymentId,
            payload: body as unknown as Json
          }, { onConflict: 'external_id' });

        if (logError && 'code' in logError && logError.code === '23505') {
          log.info('[webhooks/razorpay] Idempotency hit: Payment already logged', { razorpayPaymentId });
          return NextResponse.json({ received: true, message: 'Payment already processed' });
        }

        // Place order using session data and current cart
        const order_result = await executeCommerceIntent({
          intent: 'PLACE_ORDER',
          payload: {
            razorpay_order_id: razorpayOrderId,
            payment_id: razorpayPaymentId,
            products: cart_items.map(product => ({
              product_id: product.product_id!,
              variant_id: product.variant_id ?? null,
              quantity: product.quantity!,
              personalization: (product.personalization as Record<string, any>) ?? null,
              selected_addons: (product.selected_addons as any[]) ?? null
            })),
            address_id: session.selected_address_id || undefined,
            coupon_code: session.applied_coupon || undefined,
            use_wallet: session.use_wallet || false,
            gstin: session.gstin || undefined,
          }
        });

        if (!order_result.success) {
          throw new Error(String(order_result.error || 'Failed to create order atomically'));
        }

        // Cleanup session after successful placement
        await supabase.from('checkout_sessions').delete().eq('id', session.id);

        log.info('[webhooks/razorpay] Order created atomically via triggers and draft cleaned', { order_id: (order_result.data as any).order_id, razorpayOrderId });
        return NextResponse.json({ received: true, order_id: (order_result.data as any).order_id });

      } catch (error) {
        log.error('[webhooks/razorpay] Error creating order from payment', error, { razorpayOrderId });
        return NextResponse.json({ error: 'Failed to create order, will retry' }, { status: 500 });
      }
    }

    // Handle payment.failed event
    if (event.event === 'payment.failed') {
      const paymentEntity = event.payload.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const errorDescription = paymentEntity?.error_description || 'Unknown error';

      log.warn('[webhooks/razorpay] Payment failed', { razorpayOrderId, errorDescription });

      try {
        const razorpayOrder = await razorpayInstance.orders.fetch(String(razorpayOrderId));
        const draftId = razorpayOrder.notes?.draftId || razorpayOrder.notes?.draft_id;

        if (draftId) {
          await supabase.from('checkout_sessions').delete().eq('id', String(draftId));
          log.info('[webhooks/razorpay] Failed payment session cleaned', { sessionId: draftId, razorpayOrderId });
        }

      } catch (err) {
        log.error('[webhooks/razorpay] Failed to clean draft on payment.failed', err, { razorpayOrderId });
      }

      return NextResponse.json({ received: true });
    }

    // Handle refund.processed event
    if (event.event === 'refund.processed') {
      const refundEntity = event.payload.refund?.entity;
      const paymentId = refundEntity?.payment_id;
      const refundId = refundEntity?.id;

      log.info('[webhooks/razorpay] Refund processed', { paymentId, refundId });

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, order_number')
        .eq('payment_id', String(paymentId))
        .maybeSingle();

      if (order && !orderError) {
        await supabase.from('orders').update({
          payment_status: 'REFUNDED',
          status: 'REFUNDED',
          updated_at: new Date().toISOString()
        }).eq('id', order.id);

        await supabase.rpc('log_order_status_history', {
          p_order_id: order.id,
          p_status: 'REFUNDED',
          p_title: 'Refund Processed',
          p_description: `Payment refund (ID: ${refundId}) has been successfully processed.`,
          p_metadata: { paymentId, refundId } as unknown as Json
        });
      }

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    log.error('[webhooks/razorpay] Unexpected error', error, { path: '/api/webhooks/razorpay' });
    return handleAPIError(error, 500);
  }
}
