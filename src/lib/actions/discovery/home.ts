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
        const { data, error } = await supabase.rpc('get_home_surface' as any, {
            p_lat: lat,
            p_lng: lng,
            p_user_id: userId,
            p_session_id: null
        });

        if (error) {
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

        // SWIGGY 2026 Pattern: Robust Unwrapping
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
        let featuredVendors = raw.vendors || raw.sections_data?.vendors || [];
        let trendingProducts = raw.featured_products || raw.sections_data?.best_sellers || [];

        // Fallback: RPC often returns empty vendors/products due to location/opening-hours filters.
        // When empty, fetch directly from tables so customer sees data.
        if (featuredVendors.length === 0 || trendingProducts.length === 0) {
            const [vendorsRes, productsRes] = await Promise.all([
                supabase.from('vendors').select('id, name, image_url, rating, city, avg_prep_time_mins, base_delivery_charge, slug, business_type, is_online, description').eq('is_active', true).limit(12),
                supabase.from('products').select('*, vendors(name, city)').eq('is_active', true).limit(24)
            ]);
            if (featuredVendors.length === 0 && vendorsRes.data?.length) {
                featuredVendors = (vendorsRes.data as any[]).map(v => ({ ...v, prep_mins: v.avg_prep_time_mins || 45, delivery_fee: Number(v.base_delivery_charge || 0) }));
                logger.info('GetHomeSurface: Fallback fetched vendors', { count: featuredVendors.length });
            }
            if (trendingProducts.length === 0 && productsRes.data?.length) {
                trendingProducts = productsRes.data as any[];
                logger.info('GetHomeSurface: Fallback fetched products', { count: trendingProducts.length });
            }
        }

        const sections = raw.sections || [];
        const sectionsData = raw.sections_data || {};

        return {
            sections,
            categories: resolvedCategories,
            trendingProducts,
            newArrivals: sectionsData.new_arrivals || [],
            featuredVendors,
            activeOrders: raw.active_orders || [],
            recentOrders: raw.recent_orders || [],
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
            recentOrders: [],
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
