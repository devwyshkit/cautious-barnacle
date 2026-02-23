import { NextResponse } from 'next/server';
import { cleanup_stale_sessions } from '@/lib/actions/checkout/payment';
import { logger } from '@/lib/logging/logger';

/**
 * CRON: STALE SESSION CLEANUP
 * Deletes checkout sessions older than 24 hours.
 */
export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        const result = await cleanup_stale_sessions();

        if (result.success) {
            logger.info('Cron: Stale sessions cleaned up successfully');
            return NextResponse.json({ success: true });
        } else {
            logger.error('Cron: Stale sessions cleanup failed', result.error);
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    } catch (error) {
        logger.error('Cron: Internal Error during session cleanup', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
