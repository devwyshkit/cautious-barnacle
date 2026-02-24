'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { Database, Json } from '@/lib/supabase/database.types';
import type { Order, Tables, OrderDetails, Address, Partner, OrderItem } from '@/lib/supabase/types';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/logging/logger';
import { hasItemPersonalization } from '@/lib/utils/personalization';
import { withTrace } from '@/lib/observability/tracer';

export type OrderStatus = Database['public']['Enums']['order_status'];

// WYSHKIT 2026: Order State Machine - Valid Transitions (STRICT)
// Enforces "Commitment Before Creativity" and "One-Trip" Principles
// No Circular States allowed. Revisions change personalization_status, but NOT order.status.
const VALID_TRANSITIONS: Record<string, string[]> = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: ['REFUNDED'], // Returns flow
  CANCELLED: [],
  REFUNDED: [],
};

export async function validate_status_transition(
  from: string,
  to: string,
  has_personalization: boolean
): Promise<string | null> {
  // Universal Rule: Can't skip "Preparing"
  if (from === ORDER_STATUS.CONFIRMED && to === ORDER_STATUS.READY) {
    return 'Orders must be marked as "Preparing" before they can be marked as Ready.';
  }

  const valid_next_statuses = VALID_TRANSITIONS[from];
  if (!valid_next_statuses || !valid_next_statuses.includes(to)) {
    return `Invalid transition from "${from}" to "${to}".`;
  }

  return null;
}

export type PartnerOrder = Omit<Order, 'delivery_address' | 'partner'> & {
  order_items: (OrderItem & {
    item?: Tables<'items'> | null;
    variant?: { stock_quantity: number } | null;
    personalization_entry?: Tables<'order_personalization'> | null;
  })[];
  order_personalization?: Tables<'order_personalization'>[];
  latest_preview?: Tables<'order_personalization'> | null;
  delivery_address?: Address | Address[] | null;
  partner?: Partner | Partner[] | null;
};

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

export async function update_order_status(
  order_id: string,
  status: OrderStatus | string,
  metadata?: {
    reason?: string;
    cancelled_by?: 'partner' | 'admin' | 'customer' | 'system';
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createAdminClient();

    // 1. Fetch current order for side-effect context (e.g., payment ID for refund)
    const { data: order, error: order_error } = await supabase
      .from('orders')
      .select('*, partner:partners(*)')
      .eq('id', order_id)
      .single();

    if (order_error || !order) throw new Error('Order not found');

    // 2. Side Effect: Auto-Dispatch
    let target_status = status;
    if (status === ORDER_STATUS.READY) {
      try {
        const { dispatch_order } = await import('@/lib/services/dispatch');
        const dispatch_result = await dispatch_order({ order_id: order_id });
        if (dispatch_result.success) {
          logger.info(`[update_order_status] Auto-dispatch successful for ${order_id}, moving to SHIPPED.`);
          target_status = ORDER_STATUS.SHIPPED;
        }
      } catch (dispatch_error) {
        logger.error('Dispatch trigger failed', dispatch_error, { order_id });
      }
    }

    // 3. Side Effect: Auto-Refund
    if (target_status === 'CANCELLED' || target_status === 'REFUNDED') {
      if (order.payment_status === 'paid' || order.payment_status === 'captured') {
        const payment_id = order.payment_id;
        if (payment_id) {
          try {
            const { refund_payment } = await import('@/lib/services/razorpay');
            await refund_payment(payment_id);
          } catch (refund_error) {
            logger.error('Auto-refund failed', refund_error, { order_id, payment_id });
          }
        }
      }
    }

    // 4. WYSHKIT 2026: Atomic Transition via RPC
    // This handles validation, status update, and history logging in one transaction.
    const { data: result, error: rpc_error } = await supabase.rpc('transition_order_status', {
      p_order_id: order_id,
      p_new_status: target_status as OrderStatus,
      p_metadata: {
        ...metadata,
        source: metadata?.cancelled_by || 'system',
        updated_at_server: new Date().toISOString()
      } as unknown as Json
    });

    if (rpc_error) throw rpc_error;

    const transition_result = result as any;
    if (!transition_result.success) {
      return { success: false, error: transition_result.error };
    }

    // 5. Side Effect: Cashback
    if (target_status === 'DELIVERED') {
      try {
        const { credit_cashback_on_delivery } = await import('@/lib/actions/user/cashback');
        await credit_cashback_on_delivery(order_id, order.user_id, Number(order.total));
      } catch (cashback_error) {
        logger.error('Failed to credit cashback on delivery', cashback_error, { order_id });
      }
    }

    revalidateTag(`order-${order_id}`);
    revalidateTag('orders');
    return { success: true };
  } catch (error) {
    logError(error, `update_order_status:${order_id}:${status}`);
    return { success: false, error: 'Failed to update order status' };
  }
}


import { PERSONALIZATION_STATUS } from '@/lib/types/order-status';

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
      const can_submit = ([ORDER_STATUS.PLACED, ORDER_STATUS.CONFIRMED] as string[]).includes(order.status);

      if (!can_submit) {
        return { success: false, error: `Cannot submit details in ${order.status} state.` };
      }

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
    const result = await update_order_status(order_id, ORDER_STATUS.READY);

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
      .from('order_personalization')
      .select('order_item_id')
      .eq('id', preview_submission_id)
      .single();

    if (fetch_error || !preview) throw new Error('Preview not found');

    // 2. Swiggy 2026: Route via Admin Intent RPC (Audit Trail)
    // This now updates personalization_status to 'approved'
    const { error: intentError } = await admin_supabase.rpc('execute_admin_intent', {
      p_intent: {
        entity: 'order',
        action: 'UPDATE_PERSONALIZATION_STATUS',
        id: order_id,
        metadata: { target_status: PERSONALIZATION_STATUS.APPROVED }
      }
    });

    if (intentError) throw intentError;

    // Approve the preview submission record
    await admin_supabase.from('order_personalization').update({ status: 'approved' }).eq('id', preview_submission_id);

    // Update specific item status
    if (preview.order_item_id) {
      await admin_supabase.from('order_items').update({
        status: ORDER_STATUS.PREPARING,
        liability_shifted_at: new Date().toISOString()
      }).eq('id', preview.order_item_id);
    }

    // Final check for order-wide status
    const { data: items } = await admin_supabase.from('order_items').select('id, status').eq('order_id', order_id);
    const personalized_items = (items || []).filter(i => i.status !== ORDER_STATUS.CANCELLED);
    const all_approved = personalized_items.every(i => i.status === ORDER_STATUS.PREPARING);

    if (all_approved) {
      await admin_supabase.from('orders').update({
        status: ORDER_STATUS.PREPARING
      }).eq('id', order_id);
    }

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
      .from('order_personalization')
      .select('order_item_id')
      .eq('id', preview_submission_id)
      .single();

    if (fetch_preview_error || !preview) throw new Error('Preview not found');

    // 2. Update preview status
    const { error: preview_error } = await admin_supabase
      .from('order_personalization')
      .update({
        status: 'change_requested',
        customer_feedback: feedback
      })
      .eq('id', preview_submission_id);

    if (preview_error) throw preview_error;

    // 3. Update the specific item status
    // Note: order_item.status remains IN_PRODUCTION or similar if it already started, 
    // but we use personalization_status for loop state.
    // Legacy support: We might still update order_item.status if it was REVISION_REQUESTED.
    // However, Swiggy 2026 prefers keeping item status as IN_PRODUCTION 
    // once accepted, and using loop status.

    const { error: update_order_error } = await admin_supabase
      .from('orders')
      .update({
        personalization_status: PERSONALIZATION_STATUS.REVISION_REQUESTED,
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
    const raw_order = data as unknown as OrderDetails;

    // Sort history by latest first
    const order_status_history_arr = ((raw_order as any).order_status_history || []).sort((a: any, b: any) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });

    // Map snake_case for the frontend (Zero Shadow Schema)
    const mapped_order: OrderDetails = {
      ...raw_order,
      partner_name: raw_order.partners?.name || 'Partner',
      partner_image: raw_order.partners?.image_url || null,
      order_status_history: order_status_history_arr as any,
      order_items: raw_order.order_items || []
    } as any;

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
      .from('v_order_tracking')
      .select('*')
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
