'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { revalidatePath } from 'next/cache';
import { Database, Json } from '@/lib/supabase/database.types';
import type { DBOrder, Tables, OrderDetails, OrderWithRelations, OrderStatusHistory } from '@/lib/supabase/types';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/logging/logger';
import { hasItemPersonalization } from '@/lib/utils/personalization';

/** Item shape for place_secure_order RPC (matches checkout payload). */
export interface PlaceOrderItem {
  item_id: string;
  variant_id?: string | null;
  quantity: number;
  has_personalization?: boolean;
  personalization_config?: { enabled?: boolean; option_id?: string } | null;
  selected_addons?: Array<{ id: string; name?: string; price?: number; requires_preview?: boolean }>;
}

export interface PlaceOrderPayload {
  address_id: string;
  items: PlaceOrderItem[];
  razorpay_order_id: string;
  payment_id?: string;
  coupon_code?: string | null;
  use_wallet?: boolean;
  gstin?: string | null;
  delivery_instructions?: string | null;
  user_id?: string;
  useAdmin?: boolean;
  distance_km?: number;
  delivery_fee?: number;
}


async function log_order_status_history(order_id: string, type: string, title: string, description: string, metadata: Record<string, unknown> = {}) {
  const supabase = await createAdminClient();
  const { error } = await (supabase as any).rpc('log_order_status_history', {
    p_order_id: order_id,
    p_type: type,
    p_title: title,
    p_description: description,
    p_metadata: metadata as Json
  });

  if (error) logError(error, 'OrderStatusHistory');
}

export async function submit_order_personalization(order_id: string, personalization_input: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    if (!order_id || order_id.trim() === '') {
      return { success: false, error: 'Invalid Order ID' };
    }
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

    // 3. Use Admin Client for Updates (Bypass RLS complexity)
    const admin_supabase = await createAdminClient();

    // 4. Update Order Level Status
    const { error: update_error } = await admin_supabase
      .from('orders')
      .update({
        personalization_input: personalization_input as unknown as Json,
        personalization_status: 'submitted',
        status: next_status,
        details_submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id);

    if (update_error) {
      logger.error(`[submitOrderPersonalization] Failed to update orders table`, update_error);
      throw update_error;
    }

    // 4. Try updating Relational Items & Order Personalization
    const item_updates = [];
    const personalization_entries = [];

    for (const [order_item_id, details] of Object.entries(personalization_input)) {
      const d = details as any;

      // Prepare batch update for order_items
      item_updates.push({
        id: order_item_id,
        personalization_details: d as unknown as Json,
        status: 'submitted'
      });

      // WYSHKIT 2026: Add to relational personalization table using order_item_id
      personalization_entries.push({
        order_id: order_id,
        order_item_id: order_item_id,
        text_input: d.text || null,
        uploaded_files: d.image_url ? [d.image_url] : (d.images || []),
        instructions: d.instructions || null,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      });
    }

    if (item_updates.length > 0) {
      // Batch update order_items using upsert (IDs match, so it updates)
      await admin_supabase
        .from('order_items')
        .upsert(item_updates as any, { onConflict: 'id' });
    }

    if (personalization_entries.length > 0) {
      await admin_supabase
        .from('order_personalization')
        .upsert(personalization_entries, {
          onConflict: 'order_item_id'
        });
    }

    await log_order_status_history(order_id, 'personalization_submitted', 'Details Shared', 'You have shared the personalization details with the partner.', { personalization: personalization_input });

    revalidatePath(`/orders/${order_id}`);
    return { success: true };
  } catch (error) {
    logError(error, `SubmitPersonalization:${order_id}`);
    const { error: errMsg } = handleActionError(error);
    return { success: false, error: errMsg };
  }
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
    const { update_order_status } = await import('@/lib/actions/partner-actions');
    const result = await update_order_status(order_id, ORDER_STATUS.PACKED);

    if (!result.success) {
      throw new Error(result.error);
    }

    revalidatePath(`/orders/${order_id}`);
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

    // 3. Update the specific item status
    if (preview.order_item_id) {
      await admin_supabase
        .from('order_items')
        .update({ status: 'approved' })
        .eq('id', preview.order_item_id);
    }

    // 4. Check if ALL personalized items are approved
    const { data: items } = await admin_supabase
      .from('order_items')
      .select('id, status, is_personalized')
      .eq('order_id', order_id);

    const personalized_items = (items || []).filter(i => i.is_personalized);
    const all_approved = personalized_items.every(i => i.status === 'approved');

    // 5. Update Order Status
    const { error: order_error } = await admin_supabase
      .from('orders')
      .update({
        status: all_approved ? ORDER_STATUS.APPROVED : ORDER_STATUS.PREVIEW_READY,
        approved_at: all_approved ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id);

    if (order_error) throw order_error;

    await log_order_status_history(order_id, 'preview_approved', 'Preview Approved', `You have approved the preview${personalized_items.length > 1 ? ' for an item' : ''}.`, {
      preview_submission_id: preview_submission_id,
      order_item_id: preview.order_item_id
    });

    revalidatePath(`/orders/${order_id}`);
    return { success: true };
  } catch (error) {
    logError(error, `ApprovePreview:${order_id}`);
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
        .update({ status: 'revision_requested' })
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

    revalidatePath(`/orders/${order_id}`);
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

/**
 * WYSHKIT 2026: Create Order (Atomic RPC Version)
 * Replaces the direct insert model with a single atomic transaction.
 * Logic:
 * 1. Call 'place_atomic_order' RPC.
 * 2. Database handles pricing, stock, wallet, and history in one 'BEGIN...END' block.
 */
export async function create_order(payload: PlaceOrderPayload) {
  try {
    const supabase = payload.useAdmin ? await createAdminClient() : await createClient();

    // WYSHKIT 2026: Standardize to snake_case for DB consistency
    const standardizedItems = payload.items.map(item => ({
      item_id: item.item_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      has_personalization: item.has_personalization,
      personalization_config: item.personalization_config,
      selected_addons: item.selected_addons
    }));

    // WYSHKIT 2026: Atomic execution (Single Source of Truth)
    const rpcArgs: any = {
      p_items: standardizedItems as any,
      p_address_id: payload.address_id,
      p_razorpay_order_id: payload.razorpay_order_id,
      p_payment_id: payload.payment_id,
      p_use_wallet: payload.use_wallet || false,
      p_gstin: payload.gstin,
      p_delivery_instructions: payload.delivery_instructions,
      p_distance_km: payload.distance_km,
      p_coupon_code: payload.coupon_code,
      p_user_id: payload.user_id || null,
    }

    const { data: result, error } = await (supabase as any).rpc('place_secure_order', rpcArgs);

    if (error) throw error;
    const rpcResult = result as any;

    if (rpcResult.success && rpcResult.orderId && !rpcResult.isNew) {
      logger.info(`[createOrder] Idempotency hit: Order already existed for Razorpay Order ${payload.razorpay_order_id}`, {
        orderId: rpcResult.orderId,
        userId: payload.user_id,
        razorpayOrderId: payload.razorpay_order_id
      });
    }

    if (!rpcResult.success) {
      throw new Error(rpcResult.error || 'Failed to place order');
    }

    revalidatePath('/orders');
    return {
      success: true,
      order_id: rpcResult.orderId,
      order_number: rpcResult.orderNumber,
      has_personalization: rpcResult.hasPersonalization
    };

  } catch (error) {
    logError(error, `createOrder:${payload.razorpay_order_id}`);
    return handleActionError(error);
  }
}


export async function get_order(order_id: string): Promise<{ data?: Pick<DBOrder, 'id' | 'payment_status' | 'status'> | null; error?: string }> {
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

export async function get_order_by_razorpay_order_id(razorpay_order_id: string): Promise<{ data?: Pick<DBOrder, 'id' | 'payment_status' | 'status'> | null; error?: string }> {
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
