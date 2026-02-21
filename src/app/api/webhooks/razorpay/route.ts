import { NextRequest, NextResponse } from 'next/server';
import { validateWebhookSignature } from '@/lib/services/razorpay';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { log } from '@/lib/logging/logger';
import { create_order } from '@/lib/actions/orders';
import { handleAPIError } from '@/lib/utils/error-handler';
import Razorpay from 'razorpay';

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

    const event = JSON.parse(body);

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
      const razorpayOrderId = event.payload.payment?.entity?.order_id;
      const razorpayPaymentId = event.payload.payment?.entity?.id;

      if (!razorpayOrderId || !razorpayPaymentId) {
        return NextResponse.json({ received: true, message: 'Missing order_id or payment_id' });
      }

      try {
        // Fetch order from Razorpay to get notes (contains draftId, userId)
        const razorpayOrder = await razorpayInstance.orders.fetch(razorpayOrderId);
        const notes = (razorpayOrder.notes as any) || {};

        const userId = String(notes.userId || notes.user_id || '');
        const draftId = String(notes.draftId || notes.draft_id || '');

        if (!userId || !draftId) {
          log.error('[webhooks/razorpay] Missing required data in notes', { notes });
          return NextResponse.json({ error: 'Missing required data in payment notes' }, { status: 400 });
        }

        // Fetch draft order
        const { data: draft, error: draftError } = await supabase
          .from('draft_orders')
          .select('*')
          .eq('id', draftId)
          .single();

        if (draftError || !draft) {
          log.error('[webhooks/razorpay] Draft not found', { draftId, error: draftError });
          return NextResponse.json({ received: true, message: 'Draft not found or expired' });
        }

        // Check if order already exists (Idempotency)
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('razorpay_order_id', razorpayOrderId)
          .maybeSingle();

        if (existingOrder) {
          log.info('[webhooks/razorpay] Idempotency hit: Order already processed by client/browser', { orderId: existingOrder.id, razorpayOrderId });
          return NextResponse.json({ received: true, message: 'Order already processed' });
        }

        // Place order using draft data (Trigger-first model)
        const metadata = (draft.metadata as any) || {};
        const orderData = {
          address_id: draft.address_id,
          items: (draft.items as any[]).map(item => ({
            item_id: item.item_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            has_personalization: item.has_personalization,
            personalization_config: item.personalization_config,
            selected_addons: item.selected_addons
          })),
          razorpay_order_id: razorpayOrderId,
          payment_id: razorpayPaymentId,
          coupon_code: metadata.coupon_code || metadata.couponCode,
          use_wallet: metadata.use_wallet || metadata.useWallet || false,
          gstin: metadata.gstin,
          delivery_instructions: metadata.delivery_instructions || metadata.deliveryInstructions,
          distance_km: metadata.distance_km || metadata.distanceKm,
          user_id: userId,
          use_admin: true
        };

        const result = await create_order(orderData);

        if ('error' in result) {
          throw new Error((result as any).error || 'Failed to create order atomically');
        }

        // Cleanup draft after successful placement
        await supabase.from('draft_orders').delete().eq('id', draft.id);

        log.info('[webhooks/razorpay] Order created atomically via triggers and draft cleaned', { orderId: (result as any).orderId, razorpayOrderId });
        return NextResponse.json({ received: true, orderId: (result as any).orderId });

      } catch (error) {
        log.error('[webhooks/razorpay] Error creating order from payment', error, { razorpayOrderId });
        return NextResponse.json({ error: 'Failed to create order, will retry' }, { status: 500 });
      }
    }

    // Handle payment.failed event
    if (event.event === 'payment.failed') {
      const razorpayOrderId = event.payload.payment?.entity?.order_id;
      const errorDescription = event.payload.payment?.entity?.error_description || 'Unknown error';

      log.warn('[webhooks/razorpay] Payment failed', { razorpayOrderId, errorDescription });

      try {
        const razorpayOrder = await razorpayInstance.orders.fetch(String(razorpayOrderId));
        const draftId = razorpayOrder.notes?.draftId || razorpayOrder.notes?.draft_id;

        if (draftId) {
          await supabase.from('draft_orders').delete().eq('id', String(draftId));
          log.info('[webhooks/razorpay] Failed payment draft cleaned', { draftId, razorpayOrderId });
        }

      } catch (err) {
        log.error('[webhooks/razorpay] Failed to clean draft on payment.failed', err, { razorpayOrderId });
      }

      return NextResponse.json({ received: true });
    }

    // Handle refund.processed event
    if (event.event === 'refund.processed') {
      const paymentId = event.payload.refund?.entity?.payment_id;
      const refundId = event.payload.refund?.entity?.id;

      log.info('[webhooks/razorpay] Refund processed', { paymentId, refundId });

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, order_number')
        .eq('payment_id', paymentId)
        .maybeSingle();

      if (order && !orderError) {
        await supabase.from('orders').update({
          payment_status: 'REFUNDED',
          status: 'REFUNDED',
          updated_at: new Date().toISOString()
        }).eq('id', order.id);

        await (supabase as any).rpc('log_order_status_history', {
          p_order_id: order.id,
          p_type: 'refund',
          p_title: 'Refund Processed',
          p_description: `Payment refund (ID: ${refundId}) has been successfully processed.`,
          p_metadata: { paymentId, refundId }
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
