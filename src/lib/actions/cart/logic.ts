'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { getGuestSessionIdReadOnly } from '@/lib/session';
import { logger } from '@/lib/logging/logger';

/**
 * WYSHKIT 2026: Shared Cart Logic
 */

export async function revalidateCartPaths() {
    revalidatePath('/');
}

/**
 * Merge guest cart into logged-in user
 */
export async function mergeGuestCartToUser(): Promise<{ merged: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            logger.warn('[CART] No user found for mergeGuestCartToUser');
            return { merged: false };
        }

        const guestSessionId = await getGuestSessionIdReadOnly();
        if (!guestSessionId) {
            logger.info('[CART] No guest session to merge');
            return { merged: true };
        }

        logger.info('[CART] Attempting to merge guest session', { userId: user.id, sessionId: guestSessionId });
        const { error } = await supabase.rpc('merge_guest_to_user', {
            p_user_id: user.id,
            p_session_id: guestSessionId
        });

        if (error) {
            logError(error, 'MergeGuestCartToUser');
            return { merged: false, error: error.message };
        }

        logger.info('[CART] Merge successful');
        return { merged: true };
    } catch (error) {
        const { error: message } = handleActionError(error);
        logError(error, 'MergeGuestCartToUser.Unexpected');
        return { merged: false, error: message };
    }
}
