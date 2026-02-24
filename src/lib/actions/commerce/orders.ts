'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { Database, Json } from '@/lib/supabase/database.types';
import type { Order, Tables, OrderDetails, Address, Vendor, OrderItem } from '@/lib/supabase/types';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/logging/logger';
import { hasItemPersonalization } from '@/lib/utils/personalization';
import { withTrace } from '@/lib/observability/tracer';

export type OrderStatus = Database['public']['Enums']['order_status'];

// WYSHKIT 2026: Order State Machine - Valid Transitions (STRICT)
// Enforces "Commitment Before Creativity" and "One-Trip" Principles
// No Circular States allowed. Revisions change personalization_status, but NOT order.status.
// Validations are enforced ATOMICALLY in the database via the `transition_order` RPC.
export const VALID_TRANSITIONS: Record<string, string[]> = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PRODUCTION', 'CANCELLED'],
  IN_PRODUCTION: ['PACKED', 'CANCELLED'],
  PACKED: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  DISPATCHED: ['DELIVERED'],
  DELIVERED: ['REFUNDED'], // Returns flow
  CANCELLED: [],
  REFUNDED: [],
};

export type PartnerOrder = Omit<Order, 'delivery_address' | 'vendor'> & {
  order_products: (OrderItem & {
    product?: Tables<'products'> | null;
    variant?: { stock_quantity: number } | null;
    personalization_entry?: any; // Added for vendor dashboard
  })[];
  delivery_address?: Address | Address[] | null;
  vendor?: Vendor | Vendor[] | null;
  personalization_status?: string | null; // Mapped for UI
  latest_preview?: any; // Mapped for UI
  personalization_input?: any; // Legacy compatibility
  design_deadline_at?: string | null; // Legacy compatibility
  accept_deadline?: string | null; // Legacy compatibility
};

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
    cancelled_by?: 'vendor' | 'admin' | 'customer' | 'system';
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createAdminClient();

    // 1. Fetch current order for side-effect context
    const { data: order, error: order_error } = await supabase
      .from('orders')
      .select('*, vendor:vendors(*)')
      .eq('id', order_id)
      .single();

    if (order_error || !order) throw new Error('Order not found');

    // 2. Side Effect: Auto-Dispatch (Trigger on PACKED)
    let target_status = status;
    if (status === ORDER_STATUS.PACKED) {
      try {
        const { dispatch_order } = await import('@/lib/services/dispatch');
        const dispatch_result = await dispatch_order({ order_id: order_id });
        if (dispatch_result.success) {
          logger.info(`[update_order_status] Auto-dispatch successful for ${order_id}, moving to DISPATCHED.`);
          target_status = ORDER_STATUS.OUT_FOR_DELIVERY;
        }
      } catch (dispatch_error) {
        logger.error('Dispatch trigger failed', dispatch_error, { order_id });
      }
    }

    // 3. Side Effect: Auto-Refund (Trigger on CANCELLED/REFUNDED)
    if (target_status === 'CANCELLED' || target_status === 'REFUNDED') {
      if (order.payment_status === 'PAID' || order.payment_status === 'captured') {
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

    // 4. WYSHKIT 2026: Atomic Transition via DB RPC (SINGLE SOURCE OF TRUTH)
    // This RPC handles transition validation, RLS, status update, and history logging.
    const { data: result, error: rpc_error } = await supabase.rpc('transition_order', {
      p_order_id: order_id,
      p_target_status: target_status as OrderStatus,
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

    // 5. Side Effect: Post-Fulfillment (e.g. Cashback)
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

      // 3. WYSHKIT 2026: Atomic Submission (Metadata-Driven)
      const admin_supabase = await createAdminClient();

      // Update metadata on all products that have personalization input
      const { error: update_error } = await admin_supabase
        .from('order_products')
        .update({
          personalization_details: personalization_input as unknown as Json,
          is_personalized: true
        })
        .eq('order_id', order_id);

      if (update_error) throw update_error;

      // Update flag on order
      await admin_supabase.from('orders').update({ has_personalization: true }).eq('id', order_id);

      await log_order_status_history(order_id, 'personalization_submitted', 'Details Shared', 'You have shared the personalization details with the vendor.', { personalization: personalization_input });

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

    // Swiggy 2026: Metadata-Driven Loop
    // 1. Update the specific product metadata to reflect approval
    await admin_supabase.from('order_products').update({
      status: ORDER_STATUS.IN_PRODUCTION,
      liability_shifted_at: new Date().toISOString(),
      personalization_details: { approved: true, approved_at: new Date().toISOString() } as any
    }).eq('order_id', order_id); // In this lean model, we might approve order-wide or per product. 
    // For simplicity, let's assume order-wide approval for now if product_id is not passed.

    // Final check for order-wide status
    const { data: products } = await admin_supabase.from('order_products').select('id, status').eq('order_id', order_id);
    const personalized_items = (products || []).filter(i => i.status !== ORDER_STATUS.CANCELLED);
    const all_approved = personalized_items.every(i => i.status === ORDER_STATUS.IN_PRODUCTION);

    if (all_approved) {
      await admin_supabase.from('orders').update({
        status: ORDER_STATUS.IN_PRODUCTION
      }).eq('id', order_id);
    }

    await log_order_status_history(order_id, 'preview_approved', 'Preview Approved', `You have approved the preview. Engraving has begun (Liability Shifted).`, {
      order_id: order_id
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

export async function cancel_order_item(order_product_id: string, order_id: string, reason: string = 'Preview Rejected') {
  try {
    const admin_supabase = await createAdminClient();

    // 1. Fetch order product and main order to get Razorpay Payment ID
    const [itemRes, orderRes] = await Promise.all([
      admin_supabase.from('order_products').select('*').eq('id', order_product_id).single(),

      admin_supabase.from('orders').select('id, payment_id, total, status').eq('id', order_id).single()
    ]);

    if (itemRes.error || !itemRes.data) throw new Error('Order product not found');
    if (orderRes.error || !orderRes.data) throw new Error('Order not found');

    const product = itemRes.data;
    const order = orderRes.data;

    // 1.5 Liability Shift Check
    if (product.liability_shifted_at) {
      return { success: false, error: 'Cannot cancel once engraving has begun (Liability Shifted)' };
    }

    // 2. Mark product as CANCELLED
    const { error: updateError } = await admin_supabase
      .from('order_products')
      .update({ status: ORDER_STATUS.CANCELLED })
      .eq('id', order_product_id);

    if (updateError) throw updateError;

    // 3. Process Razorpay Refund for exactly this line product
    let refundSuccessful = false;
    if (order.payment_id) {
      try {
        const { refund_payment } = await import('@/lib/services/razorpay');
        // Refund in paise
        await refund_payment(order.payment_id, product.total_price * 100, {
          reason: 'Partial cancellation: Preview Rejected',
          order_product_id: order_product_id
        });
        refundSuccessful = true;
      } catch (err) {
        logger.error(`Failed to refund product ${order_product_id} from payment ${order.payment_id}`, err as Error);
      }
    }

    // WYSHKIT 2026: Use DB function `recalculate_order_total(order_id)` to eliminate shadow math.
    // This ensures discounts, delivery fees, and taxes are handled strictly in Postgres.
    const { error: rpc_error } = await admin_supabase.rpc('recalculate_order_total', { p_order_id: order_id });
    if (rpc_error) throw rpc_error;

    // Update history
    await log_order_status_history(order_id, 'item_cancelled', 'Product Cancelled & Refunded', `An product (${product.product_name}) was rejected and cancelled. ${refundSuccessful ? 'Refund initiated.' : 'Refund action logged.'}`, {
      order_product_id,
      reason,
      refunded_amount: product.total_price
    });

    revalidateTag(`order-${order_id}`);
    revalidateTag('orders');
    return { success: true };
  } catch (error) {
    logError(error, `CancelOrderItem:${order_product_id}`);
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

    // Swiggy 2026: Metadata-Driven Revision
    const { error: preview_error } = await admin_supabase
      .from('order_products')
      .update({
        personalization_details: {
          status: 'change_requested',
          customer_feedback: feedback,
          updated_at: new Date().toISOString()
        } as any
      })
      .eq('order_id', order_id);

    if (preview_error) throw preview_error;

    const { error: update_order_error } = await admin_supabase
      .from('orders')
      .update({
        change_request_count: change_request_count,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id);

    if (update_order_error) throw update_order_error;

    await log_order_status_history(order_id, 'change_requested', 'Change Requested', `You have requested changes to the preview (${change_request_count}/${max_change_requests}).`, { feedback, change_request_count: change_request_count });

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
        order_products(*),
        order_status_history(*),
        vendors(name, image_url)
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
    let p_status = null;
    const products = raw_order.order_products || [];
    if (raw_order.has_personalization && products.length > 0) {
      const hasSubmitted = products.some((i: any) => i.personalization_details?.text || i.personalization_details?.image_url);
      const isPreviewReady = products.some((i: any) => i.personalization_details?.preview_ready);
      const isApproved = products.every((i: any) => i.personalization_details?.approved || !i.personalization_details);

      if (isApproved) p_status = 'approved';
      else if (isPreviewReady) p_status = 'preview_ready';
      else if (hasSubmitted) p_status = 'submitted';
      else p_status = 'pending';
    }

    const mapped_order: OrderDetails = {
      ...raw_order,
      vendor_name: raw_order.vendors?.name || 'Vendor',
      partner_image: raw_order.vendors?.image_url || null,
      order_status_history: order_status_history_arr as any,
      order_products: products,
      personalization_status: p_status
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
