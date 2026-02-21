'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { orderHasPersonalizedItems } from '@/lib/utils/personalization';
import type { DBOrder } from '@/lib/supabase/types';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { update_order_status } from '@/lib/actions/partner-actions';
import { createAdminClient } from '@/lib/supabase/server';
import { Json } from '@/lib/supabase/database.types';
import { refund_payment } from '@/lib/services/razorpay';
import { logger } from '@/lib/logging/logger';

export type ReturnReason = 'wrong_item' | 'damaged' | 'defective' | 'not_as_described' | 'other';

interface InitiateReturnParams {
  orderId: string;
  reason: ReturnReason;
  description?: string;
  images?: string[];
}

/**
 * Initiate a return for an order
 * Enforces business rules:
 * - No refund for personalized items (unless wrong/damaged)
 * - For personalized items: images REQUIRED as proof
 * - Flat ₹60 delivery charge for non-personalized returns
 * - 100% advance payment (already enforced, verify)
 */
export async function initiateReturn({ orderId, reason, description, images }: InitiateReturnParams) {
  try {
    const supabase = await createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Unauthorized' };
    }

    // Fetch order with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (orderError) {
      return { error: 'Failed to fetch order' };
    }

    if (!order) {
      return { error: 'Order not found' };
    }

    // Check if order is eligible for return
    if (order.status !== ORDER_STATUS.DELIVERED) {
      return { error: 'Only delivered orders can be returned' };
    }

    const isPersonalized = orderHasPersonalizedItems(order as DBOrder);

    // Enforce return policy: No refund for personalized items unless wrong or damaged
    if (isPersonalized && !['wrong_item', 'damaged'].includes(reason)) {
      return {
        error: 'Personalized items cannot be returned unless wrong or damaged',
        code: 'PERSONALIZED_RETURN_RESTRICTION'
      };
    }

    // For personalized items, images are REQUIRED as proof
    if (isPersonalized && (!images || images.length === 0)) {
      return {
        error: 'Please upload photos showing the issue with your personalized item',
        code: 'IMAGES_REQUIRED'
      };
    }

    // Calculate return delivery fee
    const returnDeliveryFee = isPersonalized ? 0 : 60;

    // Create return record
    const { data: returnRecord, error: returnError } = await supabase
      .from('returns')
      .insert({
        order_id: orderId,
        user_id: user.id,
        reason,
        description,
        images: images || [],
        return_delivery_fee: returnDeliveryFee,
        status: 'pending',
        refund_amount: (isPersonalized && !['wrong_item', 'damaged'].includes(reason))
          ? 0
          : order.total - returnDeliveryFee,
      })
      .select()
      .maybeSingle();

    if (returnError) {
      logError(returnError, 'InitiateReturn');
      return { error: returnError.message };
    }

    if (!returnRecord) {
      return { error: 'Failed to create return - no data returned' };
    }

    // 4. TRIGGER ACTUAL RAZORPAY REFUND
    // WYSHKIT 2026: "Orders are 100% advance paid".
    // We must return the money for successful returns.
    if (returnRecord.refund_amount > 0 && order.payment_id) {
      try {
        await refund_payment(
          order.payment_id,
          Math.round(returnRecord.refund_amount * 100), // Convert INR to Paise
          {
            order_id: orderId,
            return_id: returnRecord.id,
            reason: reason,
          }
        );
        logger.info('Razorpay refund successful', { orderId, amount: returnRecord.refund_amount });
      } catch (refundError: any) {
        logger.error('Razorpay refund failed', refundError);
        // We log but don't strictly block the UI if the DB already updated, 
        // as the return record is created. However, it's better to inform.
        return {
          error: 'Refund failed at gateway. Please contact support.',
          details: refundError.message
        };
      }
    }

    // 5. Update order status via state machine gateway
    // WYSHKIT 2026: Returns use proper REFUNDED status, not CANCELLED.
    const updateResult = await update_order_status(orderId, ORDER_STATUS.REFUNDED);

    if (!updateResult.success) {
      return { error: updateResult.error || 'Failed to update order status' };
    }


    // 5. Additional logging for the return context
    const adminSupabase = await createAdminClient();
    await (adminSupabase as any).rpc('log_order_status_history', {
      p_order_id: orderId,
      p_type: 'return_initiated',
      p_title: 'Return Requested',
      p_description: `Return requested: ${reason}. ${isPersonalized ? 'No refund for personalized items.' : `Refund amount: ₹${returnRecord.refund_amount}`}`,
      p_metadata: { return_id: returnRecord.id, reason, return_delivery_fee: returnDeliveryFee } as unknown as Json
    });


    revalidatePath(`/orders/${orderId}`);
    return {
      success: true,
      returnId: returnRecord.id,
      refundAmount: returnRecord.refund_amount,
      returnDeliveryFee
    };
  } catch (error) {
    logError(error, 'InitiateReturn');
    return handleActionError(error);
  }
}

/**
 * Get return details
 */
export async function getReturnById(returnId: string) {
  try {
    const supabase = await createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Unauthorized' };
    }

    const { data: returnRecord, error } = await supabase
      .from('returns')
      .select('*, orders(*)')
      .eq('id', returnId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      return { error: 'Failed to fetch return' };
    }

    if (!returnRecord) {
      return { error: 'Return not found' };
    }

    return { return: returnRecord };
  } catch (error) {
    logError(error, 'GetReturnById');
    return handleActionError(error);
  }
}
