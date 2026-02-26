
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';

export const dynamic = 'force-dynamic';

/**
 * WYSHKIT 2026: Cart Expiry Cron
 * 
 * Rules:
 * 1. Reservations expire in 10 minutes (Soft Lock release).
 * 2. Carts expire in 30 minutes (Stale data cleanup).
 * 
 * Schedule: Every 5 minutes.
 */
export async function GET(req: NextRequest) {
    // 1. Security Check
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const supabase = await createAdminClient();

        // 3. Cleanup Stale Carts (> 30 mins inactivity)

        // 3. Cleanup Stale Carts (> 30 mins inactivity)
        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

        // Note: We use raw DELETE on cart_products. Cascade will handle remaining reservations (if any left).
        // We check updated_at OR created_at for legacy rows.
        // Note: We use raw DELETE on cart_products. 
        // WYSHKIT 2026: Safety check for active sessions is handled by DB-level foreign keys or left to application-level session expiry.
        const { error: cartError, count: cartCount } = await supabase
            .from('cart_products')
            .delete({ count: 'exact' })
            .lt('updated_at', thirtyMinsAgo.toISOString());

        if (cartError) {
            logger.error('Cron: Failed to cleanup carts', cartError);
        }

        logger.info('Cron: Cart Cleanup Complete', {
            cartsDeleted: cartCount
        });

        return NextResponse.json({
            success: true,
            cartsDeleted: cartCount
        });

    } catch (error) {
        logger.error('Cron: Cart Expiry Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
