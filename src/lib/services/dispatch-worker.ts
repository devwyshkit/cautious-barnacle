import { createClient } from '@/lib/supabase/server'
import { ShadowfaxService } from './shadowfax'
import { logger } from '@/lib/logging/logger'

/**
 * WYSHKIT 2026: Background Dispatch Worker
 * Processes the `dispatch_attempts` outbox.
 * Ensures that logistics intents are eventually consistent.
 */

export async function processPendingDispatchIntents() {
    const supabase = await createClient();

    // 1. Fetch pending or failed attempts that haven't hit max retries (3)
    const { data: attempts, error } = await supabase
        .from('dispatch_attempts')
        .select('*')
        .eq('status', 'pending')
        .lt('attempts', 3)
        .order('created_at', { ascending: true });

    if (error) {
        logger.error('[DispatchWorker] Failed to fetch intents', error);
        return { processed: 0, error: error.message };
    }

    if (!attempts || attempts.length === 0) {
        return { processed: 0 };
    }

    logger.info(`[DispatchWorker] Processing ${attempts.length} intents`);

    for (const attempt of attempts) {
        try {
            // Update attempt count immediately to prevent race conditions (simple locking)
            const currentAttempts = (attempt.attempts || 0) + 1;
            await supabase
                .from('dispatch_attempts')
                .update({
                    attempts: currentAttempts,
                    status: 'pending', // Keep pending until we succeed or hit max
                    last_attempt_at: new Date().toISOString()
                })
                .eq('id', attempt.id);

            // Re-fetch payload if needed, or use the one stored
            const payload = attempt.payload as any;

            logger.info(`[DispatchWorker] Retrying attempt ${currentAttempts} for order ${attempt.order_id}`);

            const result = await ShadowfaxService.createOrder(payload);

            if (result.success) {
                // SUCCESS: Update attempt and order
                await supabase
                    .from('dispatch_attempts')
                    .update({
                        status: 'success',
                        response_payload: result as any
                    })
                    .eq('id', attempt.id);

                // Update order status and AWB
                await supabase
                    .from('orders')
                    .update({
                        status: 'DISPATCHED',
                        awb_number: result.awbNumber || null,
                        courier_partner: 'shadowfax'
                    })
                    .eq('id', attempt.order_id);

                logger.info(`[DispatchWorker] Successfully dispatched order ${attempt.order_id}`);
            } else {
                // FAILURE: Update attempt but keep status pending if under limit
                const isFinalFailure = currentAttempts >= 3;
                await supabase
                    .from('dispatch_attempts')
                    .update({
                        status: isFinalFailure ? 'failed' : 'pending',
                        error_message: result.error || 'Shadowfax API error'
                    })
                    .eq('id', attempt.id);

                logger.warn(`[DispatchWorker] Attempt ${currentAttempts} failed for order ${attempt.order_id}: ${result.error}`);
            }
        } catch (err: any) {
            logger.error(`[DispatchWorker] Internal error for attempt ${attempt.id}`, err);
        }
    }

    return { processed: attempts.length };
}
