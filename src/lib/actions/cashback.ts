'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logError, handleActionError } from '@/lib/utils/error-handler';

/**
 * Credit cashback to user when order is delivered
 * Cashback is calculated as a percentage of order total (e.g., 2-5%)
 */
export async function credit_cashback_on_delivery(order_id: string, user_id: string, order_total: number) {
  try {
    const supabase = await createClient();

    // Calculate cashback (2% of order total, minimum ₹10, maximum ₹500)
    const cashback_percentage = 0.02; // 2%
    const cashback_amount = Math.max(10, Math.min(500, Math.round(order_total * cashback_percentage)));

    // Check if cashback already credited
    const { data: order } = await supabase
      .from('orders')
      .select('cashback_credited, cashback_amount')
      .eq('id', order_id)
      .maybeSingle();

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (order.cashback_credited) {
      return { success: true, message: 'Cashback already credited', amount: order.cashback_amount };
    }

    // Start transaction: Update order, credit cashback, create transaction record
    // 1. Update order with cashback info (IDEMPOTENT CHECK)
    // Only update if cashback_credited is false
    const { data: updated_order, error: order_error } = await supabase
      .from('orders')
      .update({
        cashback_amount: cashback_amount,
        cashback_credited: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id)
      .eq('cashback_credited', false)
      .select();

    if (order_error) throw order_error;

    // If no row was updated, it means cashback was already credited
    if (!updated_order || updated_order.length === 0) {
      return { success: true, message: 'Cashback already credited or transaction in progress' };
    }

    // 2. Upsert user's wyshkit_money balance
    const { data: existing_balance } = await supabase
      .from('wyshkit_money')
      .select('balance, total_earned')
      .eq('user_id', user_id)
      .maybeSingle();

    const new_balance = (existing_balance?.balance || 0) + cashback_amount;
    const new_total_earned = (existing_balance?.total_earned || 0) + cashback_amount;

    const { error: money_error } = await supabase
      .from('wyshkit_money')
      .upsert({
        user_id: user_id,
        balance: new_balance,
        total_earned: new_total_earned,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (money_error) throw money_error;

    // 3. Create transaction record
    const { error: transaction_error } = await supabase
      .from('wyshkit_money_transactions')
      .insert({
        user_id: user_id,
        order_id: order_id,
        amount: cashback_amount,
        type: 'credit',
        description: `Cashback for order ${order_id}`
      });

    if (transaction_error) throw transaction_error;

    revalidatePath('/checkout');
    revalidatePath('/profile');
    return { success: true, amount: cashback_amount };
  } catch (error) {
    logError(error, 'CreditCashbackOnDelivery');
    return handleActionError(error);
  }
}

/**
 * Get user's cashback balance
 */
export async function get_user_cashback_balance(user_id: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('wyshkit_money')
      .select('balance, total_earned, total_withdrawn')
      .eq('user_id', user_id)
      .maybeSingle();

    if (error) throw error;

    return {
      balance: data?.balance || 0,
      total_earned: data?.total_earned || 0,
      total_withdrawn: data?.total_withdrawn || 0
    };
  } catch (error) {
    logError(error, 'get_user_cashback_balance');
    return { balance: 0, total_earned: 0, total_withdrawn: 0 };
  }
}

/**
 * Get user's cashback transaction history
 */
export async function get_cashback_transactions(user_id: string, limit: number = 20) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('wyshkit_money_transactions')
      .select('*, orders(order_number)')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { transactions: data || [] };
  } catch (error) {
    logError(error, 'get_cashback_transactions');
    return { transactions: [] };
  }
}
