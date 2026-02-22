'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { Database, Json } from '@/lib/supabase/database.types';
import type { Order, Tables, OrderDetails, OrderWithRelations, OrderStatusHistory } from '@/lib/supabase/types';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/logging/logger';
import { hasItemPersonalization } from '@/lib/utils/personalization';
import { withTrace } from '@/lib/observability/tracer';

// WYSHKIT 2026: Strict Payload Validation (Swiggy Standard)
// [PURGED] placeOrderSchema and PlaceOrderPayload (Superseded by Intent Engine)


async function log_order_status_history(order_id: string, type: string, title: string, description: string, metadata: Record<string, unknown> = {}) {
  const supabase = await createAdminClient();
  const { error } = await supabase.rpc('log_order_status_history', {
    p_order_id: order_id,
    p_type: type,
    p_title: title,
    p_description: description,
    p_metadata: metadata as Json
  });

  if (error) logError(error, 'OrderStatusHistory');
}

export async function submit_order_personalization(order_id: string, personalization_input: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  return withTrace('submit_order_personalization', async (span) => {
    try {
      if (!order_id || order_id.trim() === '') {
        return { success: false, error: 'Invalid Order ID' };
      }
      span.setAttribute('order_id', order_id);

      logger.info(`[submitOrderPersonalization] Starting for order: ${order_id}`, {
        order_id,
        personalization_input: Object.keys(personalization_input),
        has_details: Object.values(personalization_input).some((v: any) => v.text || v.image_url)
      });

      // 1. Verify Ownership & Fetch Current State
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "Unauthorized" };
      }
      span.setAttribute('user_id', user.id);

      const { data: order, error: fetch_error } = await supabase
        .from('orders')
        .select('id, user_id, status')
        .eq('id', order_id)
        .single();

      if (fetch_error || !order) {
        return { success: false, error: "Order not found" };
      }

      // Strict ownership check
      if (order.user_id !== user.id) {
        logger.error(`[submitOrderPersonalization] Unauthorized attempt by ${user.id} for order ${order_id}`);
        return { success: false, error: "Unauthorized" };
      }

      // 2. Validate Current State
      // WYSHKIT 2026: "Momentum First" - Allow upload during PLACED, but only move status for CONFIRMED.
      const can_submit = ([ORDER_STATUS.PLACED, ORDER_STATUS.CONFIRMED, ORDER_STATUS.DETAILS_RECEIVED, ORDER_STATUS.REVISION_REQUESTED] as string[]).includes(order.status);

      if (!can_submit) {
        return { success: false, error: `Cannot submit details in ${order.status} state.` };
      }

      // 3. Determine Next Status
      // Only move to DETAILS_RECEIVED if we were already CONFIRMED or in the loop.
      // If PLACED, we stay PLACED until the partner commits (Accepts).
      const next_status = order.status === ORDER_STATUS.PLACED ? ORDER_STATUS.PLACED : ORDER_STATUS.DETAILS_RECEIVED;

      // 3. WYSHKIT 2026: Atomic Submission
      const admin_supabase = await createAdminClient();
      const { data: result, error: rpc_error } = await admin_supabase.rpc('submit_order_personalization_atomic' as any, {
        p_order_id: order_id,
        p_personalization_input: personalization_input as unknown as Json
      });

      if (rpc_error) {
        logger.error(`[submitOrderPersonalization] RPC failed`, rpc_error);
        throw rpc_error;
      }

      const rpcResult = result as any;
      if (!rpcResult.success) {
        throw new Error(rpcResult.error || 'Failed to submit personalization');
      }

      await log_order_status_history(order_id, 'personalization_submitted', 'Details Shared', 'You have shared the personalization details with the partner.', { personalization: personalization_input });

      revalidateTag(`order-${order_id}`);
      revalidateTag('orders');
      return { success: true };
    } catch (error) {
      logError(error, `SubmitPersonalization:${order_id}`);
      const { error: errMsg } = handleActionError(error);
      return { success: false, error: errMsg };
    }
  }, { order_id });
}

/**
 * WYSHKIT 2026: Enforce HARD LIMIT on revisions (5 attempts total).
 * Corresponds to Break #2.
 */


export async function mark_order_as_packed(order_id: string) {
  try {
    if (!order_id || order_id.trim() === '') {
      return { success: false, error: 'Invalid Order ID' };
    }
    const { update_order_status } = await import('@/lib/actions/partner/partner-actions');
    const result = await update_order_status(order_id, ORDER_STATUS.PACKED);

    if (!result.success) {
      throw new Error(result.error);
    }

    revalidateTag(`order-${order_id}`);
    revalidateTag('orders');
    return { success: true };
  } catch (error) {
    logError(error, `MarkAsPacked:${order_id}`);
    const { error: errMsg } = handleActionError(error);
    return { success: false, error: errMsg };
  }
}

export async function approve_preview(preview_submission_id: string, order_id: string) {
  try {
    const admin_supabase = await createAdminClient();

    // 1. Get the preview and its linked item
    const { data: preview, error: fetch_error } = await admin_supabase
      .from('preview_submissions')
      .select('order_item_id')
      .eq('id', preview_submission_id)
      .single();

    if (fetch_error || !preview) throw new Error('Preview not found');

    // 2. Approve the preview
    const { error: preview_error } = await admin_supabase
      .from('preview_submissions')
      .update({ status: 'approved' })
      .eq('id', preview_submission_id);

    if (preview_error) throw preview_error;

    // 3. Update the specific item status to IN_PRODUCTION (Liability Shift)
    if (preview.order_item_id) {
      await admin_supabase
        .from('order_items')
        .update({
          status: ORDER_STATUS.IN_PRODUCTION,
          liability_shifted_at: new Date().toISOString()
        })
        .eq('id', preview.order_item_id);
    }

    // 4. Check if ALL personalized items are approved/in_production
    const { data: items } = await admin_supabase
      .from('order_items')
      .select('id, status, is_personalized')
      .eq('order_id', order_id);

    const personalized_items = (items || []).filter(i => i.is_personalized);
    const active_personalized_items = personalized_items.filter(i => i.status !== ORDER_STATUS.CANCELLED && i.status !== ORDER_STATUS.REFUNDED);
    const all_active_approved = active_personalized_items.length > 0 && active_personalized_items.every(i => i.status === ORDER_STATUS.IN_PRODUCTION);

    // 5. Update Order Status
    const { error: order_error } = await admin_supabase
      .from('orders')
      .update({
        status: all_active_approved ? ORDER_STATUS.IN_PRODUCTION : ORDER_STATUS.PREVIEW_READY,
        approved_at: all_active_approved ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id);

    if (order_error) throw order_error;

    await log_order_status_history(order_id, 'preview_approved', 'Preview Approved', `You have approved the preview. Engraving has begun (Liability Shifted).`, {
      preview_submission_id: preview_submission_id,
      order_item_id: preview.order_item_id
    });

    revalidateTag(`order-${order_id}`);
    revalidateTag('orders');
    return { success: true };
  } catch (error) {
    logError(error, `ApprovePreview:${order_id}`);
    const { error: errMsg } = handleActionError(error);
    return { success: false, error: errMsg };
  }
}

export async function cancel_order_item(order_item_id: string, order_id: string, reason: string = 'Preview Rejected') {
  try {
    const admin_supabase = await createAdminClient();

    // 1. Fetch order item and main order to get Razorpay Payment ID
    const [itemRes, orderRes] = await Promise.all([
      admin_supabase.from('order_items').select('*').eq('id', order_item_id).single(),

      (admin_supabase.from('orders').select('id, razorpay_payment_id, total, status').eq('id', order_id).single() as any)
    ]);

    if (itemRes.error || !itemRes.data) throw new Error('Order item not found');
    if (orderRes.error || !orderRes.data) throw new Error('Order not found');

    const item = itemRes.data;
    const order = orderRes.data;

    // 1.5 Liability Shift Check
    if (item.liability_shifted_at) {
      return { success: false, error: 'Cannot cancel once engraving has begun (Liability Shifted)' };
    }

    // 2. Mark item as CANCELLED
    const { error: updateError } = await admin_supabase
      .from('order_items')
      .update({ status: ORDER_STATUS.CANCELLED })
      .eq('id', order_item_id);

    if (updateError) throw updateError;

    // 3. Process Razorpay Refund for exactly this line item
    let refundSuccessful = false;
    if (order.razorpay_payment_id) {
      try {
        const { refund_payment } = await import('@/lib/services/razorpay');
        // Refund in paise
        await refund_payment(order.razorpay_payment_id, item.total_price * 100, {
          reason: 'Partial cancellation: Preview Rejected',
          order_item_id: order_item_id
        });
        refundSuccessful = true;
      } catch (err) {
        logger.error(`Failed to refund item ${order_item_id} from payment ${order.razorpay_payment_id}`, err as Error);
      }
    }

    // WYSHKIT 2026: Use DB function `recalculate_order_total(order_id)` to eliminate shadow math.
    // This ensures discounts, delivery fees, and taxes are handled strictly in Postgres.
    const { error: rpc_error } = await admin_supabase.rpc('recalculate_order_total', { p_order_id: order_id });
    if (rpc_error) throw rpc_error;

    // Update history
    await log_order_status_history(order_id, 'item_cancelled', 'Item Cancelled & Refunded', `An item (${item.item_name}) was rejected and cancelled. ${refundSuccessful ? 'Refund initiated.' : 'Refund action logged.'}`, {
      order_item_id,
      reason,
      refunded_amount: item.total_price
    });

    revalidateTag(`order-${order_id}`);
    revalidateTag('orders');
    return { success: true };
  } catch (error) {
    logError(error, `CancelOrderItem:${order_item_id}`);
    const { error: errMsg } = handleActionError(error);
    return { success: false, error: errMsg };
  }
}

export async function request_change(preview_submission_id: string, order_id: string, feedback: string) {
  try {
    const supabase = await createClient();

    const { data: order, error: order_error } = await supabase
      .from('orders')
      .select('change_request_count, max_change_requests')
      .eq('id', order_id)
      .maybeSingle();

    if (order_error) throw order_error;
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const change_request_count = (order.change_request_count || 0) + 1;
    const max_change_requests = order.max_change_requests || 2;

    if (change_request_count > max_change_requests) {
      return { success: false, error: `Maximum ${max_change_requests} change requests allowed. Please approve or contact support.` };
    }

    // WYSHKIT 2026: Use Admin Client for preview status updates (RLS Bypass)
    const admin_supabase = await createAdminClient();

    // 1. Get the preview and its linked item
    const { data: preview, error: fetch_preview_error } = await admin_supabase
      .from('preview_submissions')
      .select('order_item_id')
      .eq('id', preview_submission_id)
      .single();

    if (fetch_preview_error || !preview) throw new Error('Preview not found');

    // 2. Update preview status
    const { error: preview_error } = await admin_supabase
      .from('preview_submissions')
      .update({
        status: 'change_requested',
        customer_feedback: feedback
      })
      .eq('id', preview_submission_id);

    if (preview_error) throw preview_error;

    // 3. Update the specific item status
    if (preview.order_item_id) {
      await admin_supabase
        .from('order_items')
        .update({ status: ORDER_STATUS.REVISION_REQUESTED })
        .eq('id', preview.order_item_id);
    }

    const { error: update_order_error } = await admin_supabase
      .from('orders')
      .update({
        status: ORDER_STATUS.REVISION_REQUESTED,
        change_request_count: change_request_count,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id);

    if (update_order_error) throw update_order_error;

    await log_order_status_history(order_id, 'change_requested', 'Change Requested', `You have requested changes to the preview (${change_request_count}/${max_change_requests}).`, { feedback, preview_submission_id: preview_submission_id, change_request_count: change_request_count });

    revalidateTag(`order-${order_id}`);
    revalidateTag('orders');
    return { success: true, change_request_count, max_change_requests };
  } catch (error) {
    logError(error, `RequestChange:${order_id}`);
    const { error: errMsg } = handleActionError(error);
    return { success: false, error: errMsg };
  }
}

export async function get_order_with_history(order_id: string): Promise<{ order: OrderDetails | null; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*),
        order_status_history(*),
        partners(name, image_url)
      `)
      .eq('id', order_id)
      .single();

    if (error || !data) {
      return { order: null, error: 'Order not found' };
    }

    // Cast to the robust join type we defined
    const raw_order = data as unknown as OrderWithRelations;

    // Sort history by latest first
    const order_status_history = (raw_order.order_status_history || []).sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });

    // Map snake_case for the frontend (Zero Shadow Schema)
    const mapped_order: OrderDetails = {
      ...raw_order,
      partner_name: raw_order.partners?.name || 'Partner',
      partner_image: raw_order.partners?.image_url || null,
      order_status_history: order_status_history,
      order_items: raw_order.order_items || []
    };

    return { order: mapped_order };
  } catch (error) {
    logError(error, 'GetOrderWithHistory');
    const { error: errMsg } = handleActionError(error);
    return { order: null, error: errMsg };
  }
}


export async function get_my_orders(): Promise<{ data?: any[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('v_orders_detailed')
      .select('id, order_number, status, total, created_at, partner_name, partner_image, items, has_personalization, personalization_status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data };
  } catch (error) {
    logError(error, 'GetMyOrders');
    const { error: errMsg } = handleActionError(error);
    return { data: [] };
  }
}

// [PURGED] create_order (Superseded by executeCommerceIntent 'PLACE_ORDER')


export async function get_order(order_id: string): Promise<{ data?: Pick<Order, 'id' | 'payment_status' | 'status'> | null; error?: string }> {
  try {
    if (!order_id || order_id.trim() === '') {
      return { data: null, error: 'Invalid Order ID' };
    }
    const supabase = await createClient();
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, payment_status, status')
      .eq('id', order_id)
      .maybeSingle();

    if (error) throw error;
    return { data: order };
  } catch (error) {
    return { data: null, error: 'Failed to fetch order' };
  }
}

export async function get_order_by_razorpay_order_id(razorpay_order_id: string): Promise<{ data?: Pick<Order, 'id' | 'payment_status' | 'status'> | null; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, payment_status, status')
      .eq('razorpay_order_id', razorpay_order_id)
      .maybeSingle();

    if (error) throw error;
    return { data: order };
  } catch (error) {
    return { data: null, error: 'Failed to fetch order' };
  }
}
