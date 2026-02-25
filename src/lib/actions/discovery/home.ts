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
        let resolvedCategories = raw?.categories || [];
        if (!resolvedCategories || resolvedCategories.length === 0) {
            const { data: fallbackCats, error: catError } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (catError) {
                logger.error('CRITICAL: Category fallback failed', catError);
            }
            resolvedCategories = fallbackCats || [];
        }

        const sections = raw.sections || [];
        const sectionsData = raw.sections_data || {};

        const hour = new Date().getHours();
        const system_status = (hour >= 22 || hour < 6) ? 'delayed' : (hour >= 18 && hour < 21) ? 'capacity' : 'normal';

        return {
            sections,
            categories: sectionsData.categories || [],
            trendingProducts: sectionsData.best_sellers || raw.trendingProducts || [],
            newArrivals: sectionsData.new_arrivals || [],
            featuredVendors: sectionsData.vendors || [],
            activeOrders: raw.activeOrders || [],
            cartCount: raw.cartCount || 0,
            metadata: {
                system_status,
                orders: raw.activeOrders || []
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

export async function getCategories() {
    const supabase = await createClient();
    const { data } = await supabase.from('categories').select('*').order('name');
    return data || [];
}

export async function getFeaturedPartners(limit: number = 8) {
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
    const mappedPartners = (data || []).map(p => ({
        ...p,
        prep_mins: p.avg_prep_time_mins || 45,
        delivery_fee: Number(p.base_delivery_charge || 0)
    }));

    return { data: mappedPartners, error: null };
}

export async function getTrendingProducts(limit: number = 3) {
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
