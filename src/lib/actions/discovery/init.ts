'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { mapCartContext, mapHomeSurface } from '@/lib/utils/mappers';

/**
 * WYSHKIT 2026: Global Initialization Surface
 * 
 * Fulfills the "One-Trip" Promise by consolidating Home and Cart data
 * into a single database round-trip. Wrapped in React.cache for 
 * request-level de-duplication across layout and page.
 */
interface RawGlobalInitSurface {
    home?: any;
    cart?: any;
    server_timestamp?: string;
}

export const getGlobalInitSurface = cache(async function getGlobalInitSurface(
    lat?: number,
    lng?: number,
    userId?: string,
    sessionId?: string
) {
    try {
        const supabase = await createClient();

        // WYSHKIT 2026: Enhanced One-Trip Telemetry with short timeout
        logger.info('One-Trip: Fetching Global Init Surface', {
            userId: userId === 'RESOLVE' ? 'DEFERRED_RESOLUTION' : userId,
            lat,
            lng,
            sessionId: sessionId ? 'PRESENT' : 'MISSING'
        });

        // WYSHKIT 2026: The "One-Trip" Promise
        // If userId is 'RESOLVE', we perform a standard auth lookup once.
        let resolvedUserId: string | undefined = (userId === 'RESOLVE' || !userId) ? undefined : userId;

        if (userId === 'RESOLVE') {
            try {
                // Soft resolve with timeout to prevent hung renders
                const { data: { user } } = await Promise.race([
                    supabase.auth.getUser(),
                    new Promise<any>((_, reject) => setTimeout(() => reject(new Error('AUTH_TIMEOUT')), 2000))
                ]);
                resolvedUserId = user?.id ?? undefined;
            } catch (err) {
                logger.warn('One-Trip: Auth resolution failed/timed out, proceeding as guest', { authError: err });
                resolvedUserId = undefined;
            }
        }

        // We call the multi-surface RPC with a strict timeout to prevent 26s hung states
        const { data, error } = await Promise.race([
            supabase.rpc('get_global_init_surface', {
                p_lat: lat,
                p_lng: lng,
                p_user_id: resolvedUserId,
                p_session_id: sessionId
            }),
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 4000))
        ]);

        if (error) {
            logger.error('One-Trip RPC Failure:', { error, userId });
            const sanitizedError = error.message?.includes('check constraint') ? 'INVALID_INPUT' : 'CONNECTION_FAILURE';
            return {
                home: mapHomeSurface(null),
                cart: mapCartContext(null),
                error: sanitizedError
            };
        }

        if (!data) {
            return {
                home: mapHomeSurface(null),
                cart: mapCartContext(null),
                error: 'No data returned from get_global_init_surface'
            };
        }

        const raw = data as unknown as RawGlobalInitSurface;

        // WYSHKIT 2026: Adaptive Mapping
        // If the backend returns wrapped surfaces (preferred), we decompose.
        // If it returns a flat home surface (legacy), we adapt.
        const homeData = raw.home || ((raw as any).featuredVendors ? raw : null);
        const cartData = raw.cart || null;

        const result = {
            home: mapHomeSurface(homeData),
            cart: mapCartContext(cartData),
            server_timestamp: raw.server_timestamp
        };

        return result;
    } catch (error) {
        const isTimeout = error instanceof Error && error.message === 'TIMEOUT';
        logger.error(isTimeout ? 'One-Trip RPC Timeout' : 'One-Trip RPC Unexpected Failure', error);
        return {
            home: mapHomeSurface(null),
            cart: mapCartContext(null),
            error: isTimeout ? 'TIMEOUT' : 'CONNECTION_FAILURE'
        };
    }
});
