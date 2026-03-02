'use server';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { logError } from '@/lib/utils/error-handler';
import { WyshkitProduct } from '@/lib/types/product';
import {
    WyshkitProductSchema,
} from '@/lib/validations/discovery';

/**
 * WYSHKIT 2026: Home Surface & Discovery Actions
 */

export const getNearbyDiscovery = cache(async (lat: number, lng: number, radiusKm: number = 5) => {
    const supabase = await createClient();

    const { data: nearbyProducts, error } = await supabase.rpc('get_nearby_products', {
        user_lat: lat,
        user_lng: lng,
        radius_km: radiusKm,
        include_out_of_stock: false
    });

    if (error) {
        logger.error('Failed to get nearby products in getNearbyDiscovery', error);
        return { products: [], error: error.message };
    }

    const validated = z.array(WyshkitProductSchema).safeParse(nearbyProducts);
    if (!validated.success) {
        logger.error('Validation failed for nearby products', validated.error);
        return { products: nearbyProducts as any, error: null };
    }

    return {
        products: validated.data as unknown as WyshkitProduct[],
        error: null
    };
});

/**
 * WYSHKIT 2026: The Home Surface Aggregator
 * Purged unstable_cache to avoid cookie-caching violations.
 * We use React cache() for per-request deduplication instead.
 */
export const getHomeSurfaceContext = cache(async (lat?: number, lng?: number, userId?: string) => {
    try {
        const supabase = await createClient();

        // WYSHKIT 2026: The discovery engine is the heart of the app.
        // If this fails in India, it's likely the ISP block.
        const { data, error } = await supabase.rpc('get_home_surface' as any, {
            p_lat: lat,
            p_lng: lng,
            p_user_id: userId
        });

        if (error) {
            if (error.message?.includes('fetch failed')) {
                logger.error('[INDIA_DNS_BLOCK] Discovery fetch failed. Advise user to use 1.1.1.1');
            }
            logError(error, 'GetHomeSurfaceContext');
            return {
                sections: [],
                categories: [],
                trendingProducts: [],
                featuredVendors: [],
                activeOrders: [],
                recentOrders: [],
                error: error.message
            };
        }

        // WYSHKIT 2026 Pattern: Robust Unwrapping
        const raw = Array.isArray(data) ? (data[0]?.get_home_surface || data[0]) : data;

        if (!raw) {
            logger.warn('GetHomeSurface: Received empty or malformed data');
            return {
                sections: [],
                categories: [],
                trendingProducts: [],
                featuredVendors: [],
                activeOrders: [],
                recentOrders: []
            };
        }


        // WYSHKIT 2026: Deterministic Category Resolution
        // We trust the RPC, but keep fallback logic for safety during transition
        let resolvedCategories = raw?.categories || [];

        const sections = raw.sections || [];
        const sectionsData = raw.sections_data || {};

        return {
            sections,
            categories: resolvedCategories,
            trendingProducts: raw.featured_products || sectionsData.best_sellers || [],
            newArrivals: sectionsData.new_arrivals || [],
            featuredVendors: raw.vendors || sectionsData.vendors || [],
            activeOrders: raw.active_orders || [],
            recentOrders: raw.recent_orders || [],
            cartCount: raw.cart_count || 0,
            metadata: {
                system_status: raw.system_status || 'normal',
                orders: raw.active_orders || [],
                location_name: raw.metadata?.location_name,
                resolved_lat: raw.metadata?.resolved_lat,
                resolved_lng: raw.metadata?.resolved_lng
            }
        };
    } catch (error: any) {
        logError(error, 'GetHomeSurfaceContextCatch');
        return {
            sections: [],
            categories: [],
            trendingProducts: [],
            featuredVendors: [],
            activeOrders: [],
            recentOrders: [],
            error: error.message || 'An unexpected error occurred while fetching home surface'
        };
    }
});
