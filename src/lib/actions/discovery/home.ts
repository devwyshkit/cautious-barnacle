'use server';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { logError } from '@/lib/utils/error-handler';
import { WyshkitItem } from '@/lib/types/product';
import {
    WyshkitItemSchema,
} from '@/lib/validations/discovery';

/**
 * WYSHKIT 2026: Home Surface & Discovery Actions
 */

export const getNearbyDiscovery = cache(async (lat: number, lng: number, radiusKm: number = 5) => {
    const supabase = await createClient();

    const { data: nearbyItems, error } = await supabase.rpc('get_nearby_products', {
        user_lat: lat,
        user_lng: lng,
        radius_km: radiusKm,
        include_out_of_stock: false
    });

    if (error) {
        logger.error('Failed to get nearby products in getNearbyDiscovery', error);
        return { products: [], error: error.message };
    }

    const validated = z.array(WyshkitItemSchema).safeParse(nearbyItems);
    if (!validated.success) {
        logger.error('Validation failed for nearby products', validated.error);
        return { products: nearbyItems as any, error: null };
    }

    return {
        products: validated.data as unknown as WyshkitItem[],
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
        const { data, error } = await supabase.rpc('get_home_surface' as any, {
            p_lat: lat,
            p_lng: lng,
            p_user_id: userId
        });

        if (error) {
            logError(error, 'GetHomeSurfaceContext');
            return {
                sections: [],
                categories: [],
                trendingProducts: [],
                featuredVendors: [],
                activeOrders: [],
                error: error.message
            };
        }

        // SWIGGY 2026 Pattern: Robust Unwrapping
        // Supabase RPC can return data directly or nested in an array depending on call context
        const raw = Array.isArray(data) ? (data[0]?.get_home_surface || data[0]) : data;

        if (!raw) {
            logger.warn('GetHomeSurface: Received empty or malformed data');
            return {
                sections: [],
                categories: [],
                trendingProducts: [],
                featuredVendors: [],
                activeOrders: []
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
            cartCount: raw.cart_count || 0,
            metadata: {
                system_status: raw.system_status || 'normal',
                orders: raw.active_orders || []
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
            error: error.message || 'An unexpected error occurred while fetching home surface'
        };
    }
});

/** @deprecated WYSHKIT 2026: Use getHomeSurfaceContext() instead. */
export async function getCategories() {
    logger.warn('getCategories is DEPRECATED. Use getHomeSurfaceContext for atomic discovery context.');
    const supabase = await createClient();
    const { data } = await supabase.from('categories').select('*').order('name');
    return data || [];
}

/** @deprecated WYSHKIT 2026: Use getHomeSurfaceContext() instead. */
export async function getFeaturedVendors(limit: number = 8) {
    logger.warn('getFeaturedVendors is DEPRECATED. Use getHomeSurfaceContext for atomic discovery context.');
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('vendors')
        .select(`
            id, name, image_url, rating, city, 
            avg_prep_time_mins, base_delivery_charge, 
            slug, business_type, is_online, description
        `)
        .eq('is_active', true)
        .limit(limit);

    if (error) return { data: [], error: error.message };

    // Map to UI-friendly structure
    const mappedVendors = (data || []).map(p => ({
        ...p,
        prep_mins: p.avg_prep_time_mins || 45,
        delivery_fee: Number(p.base_delivery_charge || 0)
    }));

    return { data: mappedVendors, error: null };
}

/** @deprecated WYSHKIT 2026: Use getHomeSurfaceContext() instead. */
export async function getTrendingProducts(limit: number = 3) {
    logger.warn('getTrendingProducts is DEPRECATED. Use getHomeSurfaceContext for atomic discovery context.');
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*, vendors(name, city)')
            .eq('is_active', true)
            .limit(limit);

        if (error) return { data: [], error: error.message };
        return { data: data as any, error: null };
    } catch (err: any) {
        return { data: [], error: err.message };
    }
}
