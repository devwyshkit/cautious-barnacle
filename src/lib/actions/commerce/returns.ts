'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { orderHasPersonalizedItems } from '@/lib/utils/personalization';
import type { Order } from '@/lib/supabase/types';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { update_order_status } from '@/lib/actions/commerce/orders';
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
 * - No refund for personalized products (unless wrong/damaged)
 * - For personalized products: images REQUIRED as proof
 * - Flat ₹60 delivery charge for non-personalized returns
 * - 100% advance payment (already enforced, verify)
 */
export async function initiateReturn({ orderId, reason, description, images }: InitiateReturnParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Unauthorized' };
    }

    // Fetch order with products
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_products(*)')
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

    const isPersonalized = orderHasPersonalizedItems(order as Order);

    // Enforce return policy: No refund for personalized products unless wrong or damaged
    if (isPersonalized && !['wrong_item', 'damaged'].includes(reason)) {
      return {
        error: 'Personalized products cannot be returned unless wrong or damaged',
        code: 'PERSONALIZED_RETURN_RESTRICTION'
      };
    }

    // For personalized products, images are REQUIRED as proof
    if (isPersonalized && (!images || images.length === 0)) {
      return {
        error: 'Please upload photos showing the issue with your personalized product',
        code: 'IMAGES_REQUIRED'
      };
    }

    // WYSHKIT 2026: PURIFIED LOGIC - NO JS ARITHMETIC
    // Move all refund calculation to DB to ensure policy consistency
    const { data: pricingData, error: pricingError } = await (supabase as any).rpc('calculate_return_refund', {
      p_order_id: orderId,
      p_reason: reason
    });

    if (pricingError) {
      logError(pricingError, 'CalculateReturnRefund');
      return { error: 'Failed to calculate refund amount' };
    }

    const { refund_amount, return_delivery_fee } = pricingData as any;

    // 3. Create return record (Intent)
    const { data: returnRecord, error: returnError } = await supabase
      .from('returns')
      .insert({
        order_id: orderId,
        user_id: user.id,
        reason,
        description,
        images: images || [],
        return_delivery_fee: return_delivery_fee,
        status: 'processing', // WYSHKIT 2026: Intent first.
        refund_amount: refund_amount,
      })
      .select()
      .maybeSingle();

    if (returnError || !returnRecord) {
      logError(returnError, 'InitiateReturn');
      return { error: 'Failed to create return intent' };
    }

    // 4. Log Intent to undeniable source of truth history BEFORE money moves
    const adminSupabase = await createAdminClient();
    await adminSupabase.rpc('log_order_status_history', {
      p_order_id: orderId,
      p_type: 'return_initiated',
      p_title: 'Refund Processing',
      p_description: `Return verified. Initiating refund of ₹${refund_amount || 0}.`,
      p_metadata: { return_id: returnRecord.id, reason } as unknown as Json
    });

    // 5. TRIGGER ACTUAL RAZORPAY REFUND
    if ((returnRecord.refund_amount || 0) > 0 && order.payment_id) {
      try {
        await refund_payment(
          order.payment_id,
          Math.round((returnRecord.refund_amount || 0) * 100), // Convert INR to Paise
          { order_id: orderId, return_id: returnRecord.id, reason }
        );
        logger.info('Razorpay refund successful', { orderId, amount: returnRecord.refund_amount });
      } catch (refundError: any) {
        logger.error('Razorpay refund failed', refundError);

        // Log failure
        await supabase.from('returns').update({ status: 'failed' }).eq('id', returnRecord.id);
        await adminSupabase.rpc('log_order_status_history', {
          p_order_id: orderId,
          p_type: 'return_failed',
          p_title: 'Refund Failed',
          p_description: `Gateway rejected refund. Escalating to support.`,
          p_metadata: { error: refundError.message } as unknown as Json
        });

        return {
          error: 'Refund failed at gateway. Please contact support.',
          details: refundError.message
        };
      }
    }

    // 6. ATOMIC DB UPDATE: Update order status via specialized RPC ONLY after money moves
    const { data: processData, error: processError } = await (adminSupabase as any).rpc('process_order_return', {
      p_order_id: orderId,
      p_refund_amount: returnRecord.refund_amount,
      p_reason: reason,
      p_payment_id: order.payment_id
    });

    if (processError) {
      logger.error('CRITICAL: RPC process_order_return failed after successful refund', {
        orderId,
        returnId: returnRecord.id,
        error: processError
      });
      // Return record is 'processing', but money is gone. 
      // Manual reconciliation or automated retry required.
      return {
        success: true,
        status: 'PENDING_SYNC',
        message: 'Refund successful, but system sync failed. Support is notified.'
      };
    }

    revalidatePath(`/orders/${orderId}`);
    return {
      success: true,
      returnId: returnRecord.id,
      refundAmount: returnRecord.refund_amount,
      returnDeliveryFee: return_delivery_fee
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
    const supabase = await createClient();
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
