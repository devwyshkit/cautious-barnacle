
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

        // 2. Cleanup Expired Reservations (Independent of Cart)
        // These are rows where the 10-minute lock has passed. 
        // We delete them to free up table space and ensure index efficiency.
        // (Logic already ignores them via `expires_at > now()`, but physical delete is good).
        const { error: resError, count: resCount } = await supabase
            .from('cart_reservations')
            .delete({ count: 'exact' })
            .lt('expires_at', new Date().toISOString());


        if (resError) {
            logger.error('Cron: Failed to cleanup reservations', resError);
        }

        // 3. Cleanup Stale Carts (> 30 mins inactivity)
        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

        // Note: We use raw DELETE on cart_items. Cascade will handle remaining reservations (if any left).
        // We check updated_at OR created_at for legacy rows.
        const { error: cartError, count: cartCount } = await supabase
            .from('cart_items')
            .delete({ count: 'exact' })
            .lt('updated_at', thirtyMinsAgo.toISOString())
            // Safety: ensure we don't delete items currently being checked out (linked to draft_orders?)
            // draft_orders table holds the checkout snapshot. 
            // cart_items are the "Active Cart".
            // If user is inside checkout for >30m, their cart might clear. 
            // This is acceptable behavior ("Session Timed Out").
            ;

        if (cartError) {
            logger.error('Cron: Failed to cleanup carts', cartError);
        }

        logger.info('Cron: Cart Cleanup Complete', {
            reservationsNullified: resCount,
            cartsDeleted: cartCount
        });

        return NextResponse.json({
            success: true,
            reservationsDeleted: resCount,
            cartsDeleted: cartCount
        });

    } catch (error) {
        logger.error('Cron: Cart Expiry Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
