'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { Database, Json } from '@/lib/supabase/database.types';
import type { Order, Tables, OrderDetails, Address, Vendor, OrderProduct } from '@/lib/supabase/types';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/logging/logger';
import { hasProductPersonalization } from '@/lib/utils/personalization';
import { withTrace } from '@/lib/observability/tracer';

export type OrderStatus = Database['public']['Enums']['order_status'];

// WYSHKIT 2026: Order State Machine is strictly table-driven in Postgres.
// Validations are enforced ATOMICALLY in the database via the `transition_order` RPC.
// No hardcoded FSM logic allowed in TypeScript.

export type VendorOrder = Omit<Order, 'delivery_address' | 'vendor'> & {
  order_products: (OrderProduct & {
    product?: Tables<'products'> | null;
    variant?: { stock_quantity: number } | null;
    personalization_entry?: any; // Added for vendor dashboard
  })[];
  delivery_address?: Address | Address[] | null;
  vendor?: Vendor | Vendor[] | null;
  personalization_status?: string | null; // Mapped for UI
  latest_preview?: any; // Mapped for UI
  previews?: any[]; // For design history
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
      .select('*, vendors(name, image_url)')
      .eq('id', order_id)
      .single();

    if (order_error || !order) throw new Error('Order not found');

    let target_status = status;

    // 2. Side Effect: Auto-Dispatch (Trigger on RIDER_ASSIGNED)
    // WYSHKIT 2026: PACKED -> RIDER_ASSIGNED (via dispatch_order)
    if (status === 'RIDER_ASSIGNED' || status === 'PACKED') {
      // Note: dispatch_order logic will be moved to its own service or handled in the UI trigger.
      // For now, we keep the auto-transition logic in transition_order if possible.
    }

    // 3. Side Effect: Auto-Refund (Trigger on CANCELLED/REFUNDED)
    if (target_status === 'CANCELLED' || target_status === 'REFUNDED') {
      if (['paid', 'PAID', 'captured', 'CAPTURED'].includes(order.payment_status || '')) {
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

    // 4. ATOMIC Transition via DB RPC (SINGLE SOURCE OF TRUTH)
    const { data: result, error: rpc_error } = await supabase.rpc('transition_order', {
      p_order_id: order_id,
      p_target_status: target_status as OrderStatus,
      p_metadata: {
        ...metadata,
        source: metadata?.cancelled_by || 'system'
      } as unknown as Json
    });

    if (rpc_error) throw rpc_error;

    const transition_result = result as { success: boolean; error?: string };
    if (!transition_result.success) {
      return { success: false, error: transition_result.error };
    }

    // 5. Side Effect: WyshKit Money (Cashback)
    if (target_status === 'DELIVERED') {
      try {
        const { credit_wyshkit_money_on_delivery } = await import('@/lib/actions/user/cashback');
        await credit_wyshkit_money_on_delivery(order_id, order.user_id, Number(order.total));
      } catch (wyshkit_money_error) {
        logger.error('Failed to credit WyshKit Money on delivery', wyshkit_money_error, { order_id });
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

      const supabase = await createClient();

      // WYSHKIT 2026: Atomic Submission via RPC (Single Trip)
      const { data, error: rpc_error } = await supabase.rpc('submit_order_personalization', {
        p_order_id: order_id,
        p_personalization_input: personalization_input as Json
      });

      if (rpc_error) throw rpc_error;

      const result = data as { success: boolean; error?: string };
      if (!result.success) {
        return { success: false, error: result.error };
      }

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
    const supabase = await createClient();

    // WYSHKIT 2026: Atomic Preview Approval via RPC
    const { data, error: rpc_error } = await supabase.rpc('approve_order_preview', {
      p_order_id: order_id
    });

    if (rpc_error) throw rpc_error;

    const result = data as { success: boolean; error?: string };
    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidateTag(`order-${order_id}`);
    revalidateTag('orders');
    return { success: true };
  } catch (error) {
    logError(error, `ApprovePreview:${order_id}`);
    const { error: errMsg } = handleActionError(error);
    return { success: false, error: errMsg };
  }
}

export async function cancel_order_product(order_product_id: string, order_id: string, reason: string = 'Preview Rejected') {
  try {
    const admin_supabase = await createAdminClient();

    // 1. ATOMIC Transition & Recalculation via DB RPC
    const { data: rpc_data, error: rpc_error } = await admin_supabase.rpc('cancel_order_product_atomic', {
      p_order_product_id: order_product_id,
      p_order_id: order_id,
      p_reason: reason
    });

    if (rpc_error) throw rpc_error;
    const result = rpc_data as { success: boolean; error?: string; payment_id?: string; refund_amount?: number };

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // 2. Process Razorpay Refund (Side Effect - One-Trip!)
    // We use the payment_id returned directly from the RPC result.
    if (result.success && result.payment_id) {
      try {
        const { refund_payment } = await import('@/lib/services/razorpay');
        await refund_payment(result.payment_id, result.refund_amount ? result.refund_amount * 100 : undefined, {
          reason: `Partial cancellation: ${reason}`,
          order_product_id: order_product_id
        });
      } catch (err) {
        logger.error(`Refund failed for payment ${result.payment_id}`, err as Error);
      }
    }

    revalidateTag(`order-${order_id}`);
    revalidateTag('orders');
    return { success: true };
  } catch (error) {
    logError(error, `CancelOrderProduct:${order_product_id}`);
    const { error: errMsg } = handleActionError(error);
    return { success: false, error: errMsg };
  }
}

export async function request_change(preview_submission_id: string, order_id: string, feedback: string) {
  try {
    const supabase = await createClient();

    // WYSHKIT 2026: Atomic Submission via RPC (Zero Shadow Math)
    const { data: rpc_data, error: rpc_error } = await supabase.rpc('request_change', {
      p_order_id: order_id,
      p_feedback: feedback
    });

    if (rpc_error) throw rpc_error;

    const result = rpc_data as { success: boolean; error?: string; new_count?: number };
    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidateTag(`order-${order_id}`);
    revalidateTag('orders');
    return { success: true, change_request_count: result.new_count };
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
        order_status_history(*) ,
        vendors(name, image_url)
      `)
      .eq('id', order_id)
      .order('created_at', { foreignTable: 'order_status_history', ascending: false })
      .single();

    if (error || !data) {
      return { order: null, error: 'Order not found' };
    }

    // Cast to the robust join type we defined
    const raw_order = data as unknown as OrderDetails;

    // Map snake_case for the frontend (Zero Shadow Schema)
    // WYSHKIT 2026: All status logic moved to Postgres get_personalization_status()
    const mapped_order: OrderDetails = {
      ...raw_order,
      vendor_name: raw_order.vendors?.name || 'Vendor',
      vendor_image: raw_order.vendors?.image_url || null,
      order_products: (raw_order.order_products || []).map((p: any) => ({
        ...p,
        personalization_status: (p as any).personalization_status // Added in DB view or computed
      })),
      // total_savings is now a generated column in the DB!
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
