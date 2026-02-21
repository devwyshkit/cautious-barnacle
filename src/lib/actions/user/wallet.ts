'use server';

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';

export type WalletInfo = {
    balance: number;
    total_earned: number;
};

export async function getWalletInfo(): Promise<{ data: WalletInfo | null; error?: string }> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { data: null, error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('wyshkit_money')
            .select('balance, total_earned')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"

        const balance = data?.balance ?? 0;
        const total_earned = data?.total_earned ?? 0;
        return { data: { balance, total_earned } };
    } catch (error) {
        logger.error('Failed to get wallet info', error);
        return { data: null, error: 'Failed to fetch wallet info' };
    }
}

export async function getWalletTransactions(): Promise<{ data: any[] | null; error?: string }> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { data: null, error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('wyshkit_money_transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data };
    } catch (error) {
        logger.error('Failed to get wallet transactions', error);
        return { data: null, error: 'Failed to fetch transactions' };
    }
}
