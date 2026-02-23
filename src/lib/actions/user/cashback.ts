'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logError, handleActionError } from '@/lib/utils/error-handler';

/**
 * Credit cashback to user when order is delivered
 * WYSHKIT 2026: Zero Shadow Math. calculation is delegated to Postgres.
 */
export async function credit_cashback_on_delivery(order_id: string, user_id: string, order_total: number) {
  try {
    const supabase = await createClient();

    const { data, error } = await (supabase.rpc as any)('credit_cashback', {
      p_order_id: order_id,
      p_user_id: user_id,
      p_order_total: order_total
    });

    if (error) throw error;

    const result = data as any;
    if (!result.success) {
      return { success: false, error: result.error || 'Cashback credit failed' };
    }

    revalidatePath('/');
    revalidatePath('/profile');

    return {
      success: true,
      amount: result.cashback_amount,
      message: result.message
    };
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
