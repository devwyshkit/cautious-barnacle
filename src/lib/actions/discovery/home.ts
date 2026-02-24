'use server';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { logError } from '@/lib/utils/error-handler';
import { WyshkitItem } from '@/lib/types/item';
import {
    WyshkitItemSchema,
} from '@/lib/validations/discovery';

/**
 * WYSHKIT 2026: Home Surface & Discovery Actions
 */

export const getNearbyDiscovery = cache(async (lat: number, lng: number, radiusKm: number = 5) => {
    const supabase = await createClient();

    const { data: nearbyItems, error } = await supabase.rpc('get_nearby_items', {
        user_lat: lat,
        user_lng: lng,
        radius_km: radiusKm,
        include_out_of_stock: false
    });

    if (error) {
        logger.error('Failed to get nearby items in getNearbyDiscovery', error);
        return { items: [], error: error.message };
    }

    const validated = z.array(WyshkitItemSchema).safeParse(nearbyItems);
    if (!validated.success) {
        logger.error('Validation failed for nearby items', validated.error);
        return { items: nearbyItems as any, error: null };
    }

    return {
        items: validated.data as unknown as WyshkitItem[],
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
                trendingItems: [],
                featuredPartners: [],
                activeOrders: []
            };
        }

        const raw = data as any;

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

        const hour = new Date().getHours();
        const system_status = (hour >= 22 || hour < 6) ? 'delayed' : (hour >= 18 && hour < 21) ? 'capacity' : 'normal';

        return {
            sections,
            categories: resolvedCategories,
            trendingItems: raw.trendingItems || [],
            featuredPartners: raw.featuredPartners || [],
            activeOrders: raw.activeOrders || [],
            metadata: {
                system_status,
                orders: raw.activeOrders || []
            }
        };
    } catch (error) {
        logError(error, 'GetHomeSurfaceContextCatch');
        return {
            sections: [],
            categories: [],
            trendingItems: [],
            featuredPartners: [],
            activeOrders: []
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
        .from('partners')
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
        prep_hours: p.avg_prep_time_mins ? (p.avg_prep_time_mins / 60) : 0.75,
        delivery_fee: Number(p.base_delivery_charge || 0)
    }));

    return { data: mappedPartners, error: null };
}

export async function getFeaturedItems(limit: number = 3) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('items')
            .select('*, partners(name, city)')
            .eq('is_active', true)
            .limit(limit);

        if (error) return { data: [], error: error.message };
        return { data: data as any, error: null };
    } catch (err: any) {
        return { data: [], error: err.message };
    }
}
