import { NextRequest, NextResponse } from 'next/server';
import { enforce_acceptance_deadlines, enforce_design_deadlines } from '@/lib/services/deadlines';
import { logger } from '@/lib/logging/logger';

/**
 * CRON: ENFORCE ACCEPTANCE DEADLINES (F13)
 * This route should be called periodically (e.g., every 5-10 minutes)
 * to clean up expired orders.
 */
export async function GET(req: NextRequest) {
    try {
        // Basic Security: Check for CRON_SECRET to prevent public abuse
        const authHeader = req.headers.get('Authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [acceptance, design] = await Promise.all([
            enforce_acceptance_deadlines(),
            enforce_design_deadlines()
        ]);

        return NextResponse.json({
            success: true,
            processedAcceptance: acceptance.count,
            processedDesign: design.count,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Cron: EnforceDeadlines failed', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
