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
    userId?: string
) {
    const supabase = await createClient();

    // WYSHKIT 2026: Enhanced One-Trip Telemetry
    logger.info('One-Trip: Fetching Global Init Surface', {
        userId: userId === 'RESOLVE' ? 'DEFERRED_RESOLUTION' : userId,
        lat,
        lng
    });

    // If userId is 'RESOLVE', the RPC will internally call auth.uid() 
    // This is the core of the Zero-Trip + One-Trip strategy.
    const { data, error } = await supabase.rpc('get_global_init_surface', {
        p_lat: lat,
        p_lng: lng,
        p_user_id: userId === 'RESOLVE' ? undefined : userId
    });

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

    return {
        home: mapHomeSurface(raw.home),
        cart: mapCartContext(raw.cart),
        server_timestamp: raw.server_timestamp
    };
});
