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
export const getGlobalInitSurface = cache(async function getGlobalInitSurface(
    lat?: number,
    lng?: number,
    userId?: string
) {
    const supabase = await createClient();

    logger.info('One-Trip: Fetching Global Init Surface', { userId, lat, lng });

    const { data, error } = await supabase.rpc('get_global_init_surface' as any, {
        p_lat: lat,
        p_lng: lng,
        p_user_id: userId
    }) as { data: any, error: any };

    if (error) {
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

    return {
        home: mapHomeSurface(data.home),
        cart: mapCartContext(data.cart),
        server_timestamp: data.server_timestamp
    };
});
