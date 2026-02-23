'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database, Json } from '@/lib/supabase/database.types';
import {
  Order,
  Address,
  Partner,
  Item,
  OrderItem,
  OrderWithItems,
  Tables
} from '@/lib/supabase/types';
import { ShadowfaxService } from '@/lib/services/shadowfax';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { logger } from '@/lib/logging/logger';
import { update_order_status, validate_status_transition, type OrderStatus, type PartnerOrder } from '@/lib/actions/commerce/orders';

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

// [PURGED] validate_status_transition & VALID_TRANSITIONS (Moved to lib/actions/commerce/orders.ts)

export async function get_partner_orders(
  partner_id: string,
  status?: OrderStatus[]
): Promise<{ data?: PartnerOrder[]; error?: string }> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('orders')
      .select(`
        id, status, total, subtotal, order_number, created_at, has_personalization, personalization_input, payment_id, delivery_fee, platform_fee, gst, discount, partner_id,
        order_items (*),
        order_personalization (*),
        order_personalization (*),
        delivery_address:addresses(*),
        partner:partners(*)
      `)
      .eq('partner_id', partner_id);

    if (status && status.length > 0) {
      query = query.in('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const mapped_data = (data || []).map(order => ({
      ...order,
      latest_preview: order.order_personalization?.[0] || null
    })) as unknown as PartnerOrder[];

    return { data: mapped_data };
  } catch (error) {
    logError(error, `get_partner_orders:${partner_id}`);
    return { error: 'Failed to fetch orders' };
  }
}

export async function get_partner_stats(partner_id: string): Promise<{ data?: PartnerStats; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await (supabase.rpc as any)('get_partner_dashboard_stats', {
      p_partner_id: partner_id
    });

    if (error) throw error;

    return { data: data as unknown as PartnerStats };
  } catch (error) {
    logError(error, 'get_partner_stats');
    return { error: 'Failed to fetch stats' };
  }
}

// [PURGED] update_order_status (Moved to lib/actions/commerce/orders.ts)

export async function accept_order(order_id: string): Promise<{ success: boolean; error?: string }> {
  return update_order_status(order_id, 'CONFIRMED');
}

export async function reject_order(
  order_id: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  return update_order_status(order_id, 'CANCELLED', {
    reason: reason,
    cancelled_by: 'partner'
  });
}

export type ItemWithCounts = Item & {
  variants_count?: number;
  total_stock?: number;
  personalization_count?: number;
  variants: Partial<Tables<'variants'>>[];
  personalization_options: any;
};

export async function get_partner_items(partner_id: string): Promise<{ data?: ItemWithCounts[]; error?: string }> {
  try {
    const supabase = await createClient();

    // WYSHKIT 2026: Single Join Query (Eliminate N+1 Waterfall)
    const { data: items, error } = await supabase
      .from('items')
      .select(`
        *,
        variants(*),
        personalization_options(*)
      `)
      .eq('partner_id', partner_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const enriched_items: ItemWithCounts[] = (items as any[] || []).map(item => ({
      ...item,
      variants_count: item.variants?.length || 0,
      total_stock: (item.variants || []).reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0),
      personalization_count: item.personalization_options?.length || 0,
      variants: item.variants || [],
      personalization_options: item.personalization_options || []
    }));

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

    // WYSHKIT 2026: Single RPC call (Eliminate Shadow Math in JS)
    const { data, error } = await (supabase.rpc as any)('get_partner_financials_v2', {
      p_partner_id: partner_id
    });

    if (error) throw error;

    return { data: data as any };
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
    const { data, error } = await supabase
      .from('partner_payouts')
      .select('id, payout_amount, status, created_at')
      .eq('partner_id', partner_id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const mappedData = data.map(p => ({
      id: p.id,
      amount: p.payout_amount,
      status: p.status,
      created_at: p.created_at || new Date().toISOString()
    }));

    return { data: mappedData };
  } catch (error) {
    logError(error, 'get_partner_payouts');
    return { error: 'Failed to fetch payouts' };
  }
}

export async function get_partner_profile(partner_id: string): Promise<{ data?: Partner; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('partners')
      .select('id, name, business_name, owner_name, email, phone, rating, commission_percentage, is_online, is_active, kyc_status, address, city, pincode, base_delivery_charge, gstin, pan_number')
      .eq('id', partner_id)
      .single();

    if (error) throw error;
    return { data: (data as unknown) as Partner };

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
      .from('order_personalization')
      .select('order_id, preview_url, status, submitted_at, customer_feedback, partner_notes')
      .in('order_id', order_ids)
      .order('submitted_at', { ascending: false });

    const enriched_orders: PartnerOrder[] = (orders as unknown as PartnerOrder[]).map(order => {
      const order_items = (order.order_items || []).map(item => ({
        ...item,
        personalization_entry: order.order_personalization?.find(p => p.order_item_id === item.id) || null
      }));

      // For latest_preview at order level, we'll take the most recent one overall
      const latest_preview = ((previews as unknown as Tables<'order_personalization'>[]) || [])
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

    const validation_error = await validate_status_transition(
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
      .from('order_personalization')
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
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/partner/catalog');
    revalidatePath('/');
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
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/partner/catalog');
    revalidatePath('/');
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
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/partner/catalog');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    logError(error, `update_variant_stock:${variant_id}`);
    return { success: false, error: 'Failed to update stock' };
  }
}

