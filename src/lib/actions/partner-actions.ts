'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database, Json } from '@/lib/supabase/database.types';
import {
  DBOrder,
  DBAddress,
  DBPartner,
  DBItem,
  OrderItem,
  OrderWithItems,
  OrderWithRelations,
  PreviewSubmission,
  Item,
  Address,
  Tables
} from '@/lib/supabase/types';
import { ShadowfaxService } from '@/lib/services/shadowfax';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { logger } from '@/lib/logging/logger';

export type OrderStatus = Database['public']['Enums']['order_status'];

// WYSHKIT 2026: PartnerOrder Type with strict check
export type PartnerOrder = Omit<DBOrder, 'delivery_address' | 'partner'> & {
  order_items: (OrderItem & {
    item?: Item | null;
    variant?: { stock_quantity: number } | null;
    personalization_entry?: Tables<'order_personalization'> | null;
  })[];
  order_personalization?: Tables<'order_personalization'>[];
  latest_preview?: PreviewSubmission | null;
  delivery_address?: Address | Address[] | null;
  partner?: DBPartner | DBPartner[] | null;
};

export type PartnerStats = {
  today_orders: number;
  today_revenue: number;
  pending_orders: number;
  avg_rating: number | null;
  low_stock_count: number;
  total_earnings: number;
  pending_settlement: number;
};

function logError(error: unknown, context: string) {
  logger.error(`Partner action error in ${context}`, error, { context });
}

// WYSHKIT 2026: Order State Machine - Valid Transitions
// WYSHKIT 2026: Order State Machine - Valid Transitions (STRICT)
// Enforces "Commitment Before Creativity" and "One-Trip" Principles
const VALID_TRANSITIONS: Record<string, string[]> = {
  PLACED: ['CONFIRMED', 'CANCELLED', 'IN_PRODUCTION'],
  CONFIRMED: ['DETAILS_RECEIVED', 'IN_PRODUCTION', 'PREVIEW_READY', 'CANCELLED'],
  DETAILS_RECEIVED: ['PREVIEW_READY', 'CANCELLED'],
  PREVIEW_READY: ['APPROVED', 'REVISION_REQUESTED', 'CANCELLED'],
  REVISION_REQUESTED: ['PREVIEW_READY', 'CANCELLED'],
  APPROVED: ['IN_PRODUCTION', 'CANCELLED'],
  IN_PRODUCTION: ['PACKED', 'CANCELLED'],
  PACKED: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['OUT_FOR_DELIVERY', 'DELIVERED'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: ['REFUNDED'], // Returns flow
  CANCELLED: [],
  REFUNDED: [],
};

function validate_status_transition(
  from: string,
  to: string,
  has_personalization: boolean
): string | null {


  if (from === ORDER_STATUS.PLACED && to === ORDER_STATUS.DETAILS_RECEIVED) {
    // Note: We allow this if triggered by customer, but validateStatusTransition is usually for partner actions.
    // We'll keep it strict for partner actions to ensure they "Accept" first.
    return 'Partner MUST accept order (CONFIRMED) before moving to production design cycle.';
  }

  // Universal Rule: Can't skip "Preparing" (IN_PRODUCTION)
  // This applies to BOTH personalized (from APPROVED) and non-personalized (from CONFIRMED)
  if ((from === ORDER_STATUS.APPROVED || from === ORDER_STATUS.CONFIRMED) && to === ORDER_STATUS.PACKED) {
    return 'Orders must be marked as "Preparing" (IN_PRODUCTION) before they can be marked as Ready (PACKED).';
  }

  const valid_next_statuses = VALID_TRANSITIONS[from];
  if (!valid_next_statuses || !valid_next_statuses.includes(to)) {
    return `Invalid transition from "${from}" to "${to}".`;
  }

  return null;
}

export async function get_partner_orders(
  partner_id: string,
  status?: string[]
): Promise<{ data?: PartnerOrder[]; error?: string }> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('orders')
      .select(`
        id, status, total, subtotal, order_number, created_at, has_personalization, personalization_input, payment_id, delivery_fee, platform_fee, gst, discount, partner_id,
        order_items (*),
        order_personalization (*),
        preview_submissions (*),
        delivery_address:addresses(*),
        partner:partners(*)
      `)
      .eq('partner_id', partner_id);

    if (status && status.length > 0) {
      query = query.in('status', status as any);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const mapped_data = (data as any[]).map(order => ({
      ...order,
      latest_preview: order.preview_submissions?.[0] || null
    })) as PartnerOrder[];

    return { data: mapped_data };
  } catch (error) {
    logError(error, `get_partner_orders:${partner_id}`);
    return { error: 'Failed to fetch orders' };
  }
}

export async function get_partner_stats(partner_id: string): Promise<{ data?: PartnerStats; error?: string }> {
  try {
    const supabase = await createClient();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Orders and Revenue for today
    const { data: today_orders_data, error: orders_error } = await supabase
      .from('orders')
      .select('id, total, status')
      .eq('partner_id', partner_id)
      .gte('created_at', today.toISOString());

    if (orders_error) throw orders_error;
    const orders = today_orders_data || [];
    const completed_orders = orders.filter((o) => o.status === 'DELIVERED');

    // 2. Partner Rating
    const { data: partner, error: partner_error } = await supabase
      .from('partners')
      .select('rating')
      .eq('id', partner_id)
      .single();

    if (partner_error) throw partner_error;

    // 3. Pending Orders (Not Delivered/Cancelled)
    const { count: pending_count, error: pending_error } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('partner_id', partner_id)
      .neq('status', 'DELIVERED')
      .neq('status', 'CANCELLED')
      .neq('status', 'REFUNDED');

    if (pending_error) logError(pending_error, 'get_partner_stats:pending_count');


    // WYSHKIT 2026: More efficient low stock check
    const { data: partner_items_data } = await supabase.from('items').select('id').eq('partner_id', partner_id);
    const partner_item_ids = partner_items_data?.map(i => i.id) || [];

    const { count: actual_low_stock_count } = await supabase
      .from('variants')
      .select('id', { count: 'exact', head: true })
      .in('item_id', partner_item_ids)
      .lt('stock_quantity', 5);

    // 5. Financials
    const financials_res = await get_partner_financials(partner_id);
    const financials = financials_res.data || { total_earnings: 0, pending_settlement: 0 };

    return {
      data: {
        today_orders: orders.length,
        today_revenue: completed_orders.reduce((sum, o) => sum + Number(o.total || 0), 0),
        pending_orders: pending_count || 0,
        avg_rating: partner?.rating ? Number(partner.rating) : null,
        low_stock_count: actual_low_stock_count || 0,
        total_earnings: financials.total_earnings,
        pending_settlement: financials.pending_settlement
      }
    };
  } catch (error) {
    logError(error, 'get_partner_stats');
    return { error: 'Failed to fetch stats' };
  }
}

export async function update_order_status(
  order_id: string,
  status: OrderStatus | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: raw_order_data, error: order_error } = await supabase
      .from('orders')
      .select(`
        *,
        delivery_address:addresses(*),
        partner:partners(*)
      `)
      .eq('id', order_id)
      .single();

    if (order_error || !raw_order_data) throw new Error('Order not found');

    const order = (raw_order_data as unknown) as PartnerOrder;
    const current_status = order.status as OrderStatus;
    const has_personalization = order.has_personalization === true;

    const validation_error = validate_status_transition(current_status, status, has_personalization);
    if (validation_error) {
      return { success: false, error: validation_error };
    }

    if (status === 'PACKED') {
      try {
        const { dispatch_order } = await import('@/lib/services/dispatch');
        const dispatch_result = await dispatch_order({ order_id: order_id });
        if (dispatch_result.success) {
          logger.info(`[update_order_status] Auto-dispatch successful for ${order_id}, moving to DISPATCHED.`);
          status = ORDER_STATUS.DISPATCHED; // Automatically move to DISPATCHED
        } else {
          logger.error('Auto-dispatch failed during PACKED transition', undefined, { order_id, error: dispatch_result.error });
        }
      } catch (dispatch_error) {
        logger.error('Dispatch trigger failed', dispatch_error, { order_id });
      }
    }

    let payment_status_update: Database['public']['Tables']['orders']['Update'] = {};
    if (status === 'CANCELLED') {
      if (order.payment_status === 'paid' || order.payment_status === 'captured') {
        const payment_id = order.payment_id;
        if (payment_id) {
          try {
            const { refund_payment } = await import('@/lib/services/razorpay');
            await refund_payment(payment_id);
            payment_status_update = {
              payment_status: 'refunded',
              return_status: 'auto_refunded'
            };
            logger.info('Auto-refund successful', { order_id, payment_id });
          } catch (refund_error) {
            logger.error('Auto-refund failed', refund_error, { order_id, payment_id });
          }
        }
      }
    }

    // WYSHKIT 2026: Auto-transition to DETAILS_RECEIVED if details were pre-uploaded during PLACED.
    // This maintains "Commitment Before Creativity" (Partner accepted) while honoring "Instant Momentum" (Customer uploaded).
    let target_status = status as OrderStatus;
    if (status === ORDER_STATUS.CONFIRMED && order.has_personalization && order.personalization_status === 'submitted') {
      logger.info(`[update_order_status] Auto-transitioning ${order_id} to DETAILS_RECEIVED as personalization already present.`);
      target_status = ORDER_STATUS.DETAILS_RECEIVED;
    }

    const status_updates: Database['public']['Tables']['orders']['Update'] = {
      status: target_status,
      ...payment_status_update,
      updated_at: new Date().toISOString()
    };

    // WYSHKIT 2026: Set design deadline when partner accepts a personalized order
    if (status === 'CONFIRMED' && has_personalization) {
      const deadline = new Date();
      deadline.setHours(deadline.getHours() + 24); // 24-hour window for details
      status_updates.design_deadline_at = deadline.toISOString();
    }

    const { error: update_error } = await supabase
      .from('orders')
      .update(status_updates)
      .eq('id', order_id);

    if (update_error) throw update_error;

    await (supabase as any).rpc('log_order_status_history', {
      p_order_id: order_id,
      p_type: 'status_update',
      p_title: `Status: ${status}`,
      p_description: `Order status updated to ${status} by partner.`,
      p_metadata: { source: 'partner', status }
    });

    if (status === 'DELIVERED') {
      try {
        const { credit_cashback_on_delivery } = await import('@/lib/actions/cashback');
        await credit_cashback_on_delivery(order_id, order.user_id, Number(order.total));
        logger.info('Cashback credited successfully on delivery', { order_id });
      } catch (cashback_error) {
        logger.error('Failed to credit cashback on delivery', cashback_error, { order_id });
      }
    }

    return { success: true };
  } catch (error) {
    logError(error, `update_order_status:${order_id}:${status}`);
    return { success: false, error: 'Failed to update order status' };
  }
}

export async function accept_order(order_id: string): Promise<{ success: boolean; error?: string }> {
  return update_order_status(order_id, 'CONFIRMED');
}

export async function reject_order(
  order_id: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('orders')
      .update({
        status: 'CANCELLED',
        cancellation_reason: reason,
        cancelled_by: 'partner',
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id);

    if (error) throw error;

    await (supabase as any).rpc('log_order_status_history', {
      p_order_id: order_id,
      p_type: 'status_update',
      p_title: 'Status: CANCELLED',
      p_description: `Order rejected by partner. Reason: ${reason}`,
      p_metadata: { source: 'partner', status: 'CANCELLED', reason }
    });

    return { success: true };
  } catch (error) {
    logError(error, `reject_order:${order_id}`);
    return { success: false, error: 'Failed to reject order' };
  }
}

export type ItemWithCounts = Item & {
  variants_count?: number;
  total_stock?: number;
  personalization_count?: number;
  variants: Tables<'variants'>[];
  personalization_options: Tables<'personalization_options'>[];
};

export async function get_partner_items(partner_id: string): Promise<{ data?: ItemWithCounts[]; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: items, error } = await supabase
      .from('items')
      .select('*')
      .eq('partner_id', partner_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!items || items.length === 0) {
      return { data: [] };
    }

    const item_ids = items.map(i => i.id);

    const [variants_res, personalization_res] = await Promise.all([
      supabase
        .from('variants')
        .select('item_id, stock_quantity')
        .in('item_id', item_ids),
      supabase
        .from('personalization_options')
        .select('item_id')
        .in('item_id', item_ids),
    ]);

    const variants_data = variants_res.data || [];
    const personalization_data = personalization_res.data || [];

    const enriched_items: ItemWithCounts[] = (items as Item[]).map(item => {
      const item_variants = variants_data.filter(v => v.item_id === item.id);
      const item_personalization = personalization_data.filter(p => p.item_id === item.id);

      return {
        ...item,
        variants_count: item_variants.length,
        total_stock: item_variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0),
        personalization_count: item_personalization.length,
        variants: item_variants as any,
        personalization_options: item_personalization as any
      };
    });

    return { data: enriched_items };
  } catch (error) {
    logError(error, 'get_partner_items');
    return { error: 'Failed to fetch items' };
  }
}

export async function get_partner_financials(partner_id: string): Promise<{
  data?: {
    total_earnings: number;
    pending_settlement: number;
    last_payout: number | null;
    commission_rate: number;
  };
  error?: string
}> {
  try {
    const supabase = await createClient();

    const { data: partner, error: partner_error } = await supabase
      .from('partners')
      .select('commission_percentage')
      .eq('id', partner_id)
      .single();

    if (partner_error) throw partner_error;

    const { data: orders, error: orders_error } = await supabase
      .from('orders')
      .select('total, net_settlement_amount, payout_status, status')
      .eq('partner_id', partner_id)
      .eq('status', 'DELIVERED');

    if (orders_error) throw orders_error;

    const delivered_orders = orders || [];
    const total_earnings = delivered_orders.reduce(
      (sum, o) => sum + Number(o.net_settlement_amount || 0), 0
    );
    const pending_settlement = delivered_orders
      .filter(o => o.payout_status !== 'completed')
      .reduce((sum, o) => sum + Number(o.net_settlement_amount || 0), 0);

    return {
      data: {
        total_earnings,
        pending_settlement,
        last_payout: null,
        commission_rate: Number(partner.commission_percentage || 15),
      }
    };
  } catch (error) {
    logError(error, 'get_partner_financials');
    return { error: 'Failed to fetch financials' };
  }
}

export async function get_partner_payouts(partner_id: string): Promise<{
  data?: { id: string; amount: number; status: string; created_at: string }[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from('partner_payouts')
      .select('id, amount, status, created_at')
      .eq('partner_id', partner_id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return { data: data as any };
  } catch (error) {
    logError(error, 'get_partner_payouts');
    return { error: 'Failed to fetch payouts' };
  }
}

export async function get_partner_profile(partner_id: string): Promise<{ data?: DBPartner; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('partners')
      .select('id, name, business_name, owner_name, email, phone, rating, commission_percentage, is_online, is_active, kyc_status, address, city, pincode, base_delivery_charge, gstin, pan')
      .eq('id', partner_id)
      .single();

    if (error) throw error;
    return { data: (data as unknown) as DBPartner };
  } catch (error) {
    logError(error, 'get_partner_profile');
    return { error: 'Failed to fetch partner profile' };
  }
}

export async function update_partner_online_status(
  partner_id: string,
  is_online: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('partners')
      .update({ is_online: is_online })
      .eq('id', partner_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    logError(error, 'update_partner_online_status');
    return { success: false, error: 'Failed to update status' };
  }
}

export async function get_personalization_queue(partner_id: string): Promise<{
  data?: PartnerOrder[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id, status, total, subtotal, order_number, created_at, has_personalization, personalization_input, partner_id,
        order_items (*),
        order_personalization (*)
      `)
      .eq('partner_id', partner_id)
      .eq('has_personalization', true)
      .in('status', ['DETAILS_RECEIVED', 'PREVIEW_READY', 'REVISION_REQUESTED'])
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!orders || orders.length === 0) return { data: [] };

    const order_ids = orders.map(o => o.id);
    const { data: previews } = await supabase
      .from('preview_submissions')
      .select('order_id, preview_url, status, submitted_at, customer_feedback, partner_notes')
      .in('order_id', order_ids)
      .order('submitted_at', { ascending: false });

    const enriched_orders: PartnerOrder[] = (orders as unknown as PartnerOrder[]).map(order => {
      const order_items = (order.order_items || []).map(item => ({
        ...item,
        personalization_entry: order.order_personalization?.find(p => p.order_item_id === item.id) || null
      }));

      // For latest_preview at order level, we'll take the most recent one overall
      const latest_preview = ((previews as unknown as PreviewSubmission[]) || [])
        .filter(p => p.order_id === order.id)
        .sort((a, b) => {
          const aTime = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
          const bTime = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
          return bTime - aTime;
        })[0] || null;

      return {
        ...order,
        order_items: order_items,
        latest_preview: latest_preview,
      };
    });

    return { data: enriched_orders };
  } catch (error) {
    logError(error, 'get_personalization_queue');
    return { error: 'Failed to fetch personalization queue' };
  }
}

export async function upload_preview(
  order_id: string,
  order_item_id: string,
  preview_url: string,
  partner_notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: order, error: fetch_error } = await supabase
      .from('orders')
      .select('status, has_personalization')
      .eq('id', order_id)
      .single();

    if (fetch_error || !order) throw new Error('Order not found');

    const validation_error = validate_status_transition(
      order.status,
      'PREVIEW_READY',
      !!order.has_personalization
    );

    if (validation_error) {
      return { success: false, error: validation_error };
    }

    // WYSHKIT 2026: If order is still PLACED, auto-transition to CONFIRMED first
    if (order.status === ORDER_STATUS.PLACED) {
      logger.info(`[upload_preview] Auto-confirming order ${order_id} before preview upload.`);
      const confirm_res = await update_order_status(order_id, 'CONFIRMED');
      if (!confirm_res.success) return confirm_res;
    }

    // WYSHKIT 2026: Combined Update (Stateless/Atomic)
    // We insert the preview linked to the specific item
    const { error: preview_error } = await supabase
      .from('preview_submissions')
      .insert({
        order_id: order_id,
        order_item_id: order_item_id, // Relational Mapping
        preview_url: preview_url,
        partner_notes: partner_notes || null,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      });

    if (preview_error) throw preview_error;

    // Update the specific order_item status
    await supabase
      .from('order_items')
      .update({ status: 'preview_ready' })
      .eq('id', order_item_id);

    // Update order level metadata
    const { error: metadata_error } = await supabase
      .from('orders')
      .update({
        preview_status: 'uploaded',
        preview_uploaded_at: new Date().toISOString(),
        preview_ready_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id);

    if (metadata_error) throw metadata_error;

    return update_order_status(order_id, 'PREVIEW_READY');
  } catch (error) {
    logError(error, 'upload_preview');
    return { success: false, error: 'Failed to upload preview' };
  }
}

export async function toggle_item_active_status(
  item_id: string,
  is_active: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('items')
      .update({ is_active: is_active })
      .eq('id', item_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    logError(error, 'toggle_item_active_status');
    return { success: false, error: 'Failed to update item status' };
  }
}

export async function toggle_item_stock_status(
  item_id: string,
  stock_status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('items')
      .update({ stock_status: stock_status })
      .eq('id', item_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    logError(error, 'toggle_item_stock_status');
    return { success: false, error: 'Failed to update stock status' };
  }
}

export async function update_variant_stock(
  variant_id: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // WYSHKIT 2026: Atomic stock update
    const { error } = await supabase
      .from('variants')
      .update({
        stock_quantity: quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', variant_id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    logError(error, `update_variant_stock:${variant_id}`);
    return { success: false, error: 'Failed to update stock' };
  }
}

