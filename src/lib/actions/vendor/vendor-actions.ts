'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database, Json } from '@/lib/supabase/database.types';
import {
  Order,
  Address,
  Vendor,
  Product,
  OrderItem,
  OrderWithItems,
  Tables
} from '@/lib/supabase/types';
import { ShadowfaxService } from '@/lib/services/shadowfax';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { logger } from '@/lib/logging/logger';
import { revalidatePath, revalidateTag } from 'next/cache';
import { update_order_status, type OrderStatus, type VendorOrder } from '@/lib/actions/commerce/orders';

export type VendorStats = {
  today_orders: number;
  today_revenue: number;
  pending_orders: number;
  avg_rating: number | null;
  low_stock_count: number;
  total_earnings: number;
  pending_settlement: number;
};

function logError(error: unknown, context: string) {
  logger.error(`Vendor action error in ${context}`, error, { context });
}

// [PURGED] validate_status_transition & VALID_TRANSITIONS (Moved to lib/actions/commerce/orders.ts)

export async function get_vendor_orders(
  vendor_id: string,
  status?: OrderStatus[]
): Promise<{ data?: VendorOrder[]; error?: string }> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('orders')
      .select(`
        id, status, total, subtotal, order_number, created_at, has_personalization, payment_id, delivery_fee, platform_fee, tax_amount, discount, vendor_id,
        order_products (*)
      `)
      .eq('vendor_id', vendor_id);

    if (status && status.length > 0) {
      query = query.in('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const mapped_data = (data || []).map((order: any) => {
      const order_products = (order.order_products || []).map((i: any) => ({
        ...i,
        personalization_entry: i.personalization_details || null
      }));

      const latest_preview = order_products.find((i: any) => i.personalization_entry?.preview_url)?.personalization_entry || null;

      const hasSubmitted = order_products.some((i: any) => i.personalization_entry?.text || i.personalization_entry?.image_url);
      const isPreviewReady = order_products.some((i: any) => i.personalization_entry?.preview_ready);
      const isApproved = order_products.every((i: any) => i.personalization_entry?.approved || !i.is_personalized);

      let personalization_status = 'pending';
      if (isApproved) personalization_status = 'approved';
      else if (isPreviewReady) personalization_status = 'preview_ready';
      else if (hasSubmitted) personalization_status = 'submitted';

      return {
        ...order,
        gst: (order as any).tax_amount,
        order_products,
        latest_preview,
        personalization_status
      };
    }) as unknown as VendorOrder[];

    return { data: mapped_data };
  } catch (error) {
    logError(error, `get_vendor_orders:${vendor_id}`);
    return { error: 'Failed to fetch orders' };
  }
}

export async function get_vendor_stats(vendor_id: string): Promise<{ data?: VendorStats; error?: string }> {
  try {
    const supabase = await createClient();

    // get_vendor_dashboard_stats was dropped — query directly
    const { data, error } = await supabase
      .from('orders')
      .select('total, status, created_at')
      .eq('vendor_id', vendor_id);

    if (error) throw error;

    return { data: data as unknown as VendorStats };
  } catch (error) {
    logError(error, 'get_vendor_stats');
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
    cancelled_by: 'vendor'
  });
}

export type ItemWithCounts = Product & {
  variants_count?: number;
  total_stock?: number;
  personalization_count?: number;
  product_variants: Partial<Tables<'product_variants'>>[];
};

export async function get_vendor_items(vendor_id: string): Promise<{ data?: ItemWithCounts[]; error?: string }> {
  try {
    const supabase = await createClient();

    // WYSHKIT 2026: Single Join Query (Eliminate N+1 Waterfall)
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants(*)
      `)
      .eq('vendor_id', vendor_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const enriched_items: ItemWithCounts[] = (products as any[] || []).map(product => ({
      ...product,
      variants_count: product.product_variants?.length || 0,
      total_stock: (product.product_variants || []).reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0),
      personalization_count: product.personalization_schema ? 1 : 0,
      product_variants: product.product_variants || []
    }));

    return { data: enriched_items };
  } catch (error) {
    logError(error, 'get_vendor_items');
    return { error: 'Failed to fetch products' };
  }
}

export async function get_vendor_financials(vendor_id: string): Promise<{
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
    const { data, error } = await (supabase.rpc as any)('get_vendor_financials_v2', {
      p_vendor_id: vendor_id
    });

    if (error) throw error;

    return { data: data as any };
  } catch (error) {
    logError(error, 'get_vendor_financials');
    return { error: 'Failed to fetch financials' };
  }
}

// [PURGED] get_vendor_payouts (Payouts now linked directly to orders)

export async function get_vendor_profile(vendor_id: string): Promise<{ data?: Vendor; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('vendors')
      .select('id, name, business_name, owner_name, email, phone, rating, commission_percentage, is_online, is_active, address, city, pincode, base_delivery_charge, gstin, pan_number')
      .eq('id', vendor_id)
      .single();

    if (error) throw error;
    return { data: (data as unknown) as Vendor };

  } catch (error) {
    logError(error, 'get_vendor_profile');
    return { error: 'Failed to fetch vendor profile' };
  }
}

export async function update_vendor_online_status(
  vendor_id: string,
  is_online: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('vendors')
      .update({ is_online: is_online })
      .eq('id', vendor_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    logError(error, 'update_vendor_online_status');
    return { success: false, error: 'Failed to update status' };
  }
}

export async function get_personalization_queue(vendor_id: string): Promise<{
  data?: VendorOrder[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id, status, total, subtotal, order_number, created_at, has_personalization, vendor_id,
        order_products (*)
      `)
      .eq('vendor_id', vendor_id)
      .eq('has_personalization', true)
      .in('status', [ORDER_STATUS.CONFIRMED, ORDER_STATUS.IN_PRODUCTION, ORDER_STATUS.PACKED])
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!orders || orders.length === 0) return { data: [] };

    const enriched_orders: VendorOrder[] = (orders as unknown as VendorOrder[]).map(order => {
      const order_products = (order.order_products || []).map(product => {
        const pDetails = (product.personalization_details as any) || {};
        return {
          ...product,
          personalization_entry: pDetails || null
        };
      });

      const latest_item_with_preview = order_products.find(i => i.personalization_entry?.preview_url);
      const latest_preview = latest_item_with_preview?.personalization_entry || null;

      // Map specialization status for the UI filters
      let personalization_status = 'pending';

      const hasSubmitted = order_products.some(i => i.personalization_entry?.text || i.personalization_entry?.image_url);
      const isPreviewReady = order_products.some(i => i.personalization_entry?.preview_ready);
      const isApproved = order_products.every(i => i.personalization_entry?.approved || !i.is_personalized);

      if (isApproved) personalization_status = 'approved';
      else if (isPreviewReady) personalization_status = 'preview_ready';
      else if (hasSubmitted) personalization_status = 'submitted';

      return {
        ...order,
        order_products: order_products,
        latest_preview,
        personalization_status
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
  order_product_id: string,
  preview_url: string,
  vendor_notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: order, error: fetch_error } = await supabase
      .from('orders')
      .select('status, has_personalization')
      .eq('id', order_id)
      .single();

    if (fetch_error || !order) throw new Error('Order not found');

    // WYSHKIT 2026: Combined Update (Metadata-Driven)
    // Update the specific order_item metadata with the preview URL
    const { error: item_error } = await supabase
      .from('order_products')
      .update({
        personalization_details: {
          preview_url: preview_url,
          vendor_notes: vendor_notes || null,
          preview_ready: true,
          preview_uploaded_at: new Date().toISOString()
        } as any
      })
      .eq('id', order_product_id);

    if (item_error) throw item_error;

    // WYSHKIT 2026: DO NOT move to PACKED on preview upload.
    // The order stays IN_PRODUCTION until the customer approves.
    // We update the local state for the vendor dashboard to reflect 'submitted'.
    revalidatePath(`/vendor/orders/${order_id}`);
    revalidateTag(`order-${order_id}`);

    return { success: true };
  } catch (error) {
    logError(error, 'upload_preview');
    return { success: false, error: 'Failed to upload preview' };
  }
}

export async function toggle_item_active_status(
  product_id: string,
  is_active: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('products')
      .update({ is_active: is_active })
      .eq('id', product_id);

    if (error) throw error;
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/vendor/catalog');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    logError(error, 'toggle_item_active_status');
    return { success: false, error: 'Failed to update product status' };
  }
}

// [PURGED] toggle_item_stock_status (Stock is managed at variant level)

export async function update_variant_stock(
  variant_id: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // WYSHKIT 2026: Atomic stock update
    const { error } = await supabase
      .from('product_variants')
      .update({
        stock_quantity: quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', variant_id);

    if (error) throw error;
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/vendor/catalog');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    logError(error, `update_variant_stock:${variant_id}`);
    return { success: false, error: 'Failed to update stock' };
  }
}

