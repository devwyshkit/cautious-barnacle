'use server';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import { createClient, createAnonClient } from '@/lib/supabase/server';
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

export const getHomeSurfaceContext = unstable_cache(
    async (lat?: number, lng?: number, userId?: string) => {
        try {
            const supabase = await createAnonClient();
            const { data, error } = await supabase.rpc('get_home_surface' as any, {
                p_lat: lat,
                p_lng: lng,
                p_user_id: userId
            });

            if (error) {
                logError(error, 'GetHomeSurfaceContext');
                return { sections: [], categories: [], activeOrders: [] };
            }

            const { data: configData, error: configError } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'home_layout')
                .single();

            if (configError) {
                logger.warn('Failed to fetch home_layout config, using defaults');
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

            const homeLayout = (configData?.value as any[]) || [
                { id: 'categories_rail', type: 'CIRCLE_RAIL', title: "What's on your mind?", source: 'categories' },
                { id: 'trending_scroll', type: 'CARD_RAIL', title: 'Trending Around You', source: 'trendingItems' },
                { id: 'featured_stores', type: 'GRID', title: 'Top Stores Near You', source: 'featuredPartners' }
            ];

            const sections = homeLayout.map(section => ({
                ...section,
                data: (section.source === 'featuredPartners' || section.type === 'PARTNER_LIST')
                    ? (raw[section.source || 'featuredPartners'] || []).map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        display_name: p.display_name,
                        slug: `/partner/${p.id}`,
                        image_url: p.image_url,
                        rating: p.rating,
                        is_online: p.is_online
                    }))
                    : section.source === 'categories'
                        ? resolvedCategories
                        : (raw[section.source] || [])
            }));

            return {
                sections,
                categories: resolvedCategories,
                activeOrders: raw.activeOrders || []
            };
        } catch (error) {
            logError(error, 'GetHomeSurfaceContextCatch');
            return { sections: [], categories: [], activeOrders: [] };
        }
    },
    ['home-surface-context'],
    {
        revalidate: 60,
        tags: ['items', 'partners', 'categories', 'orders'],
    }
);

export const getCategories = unstable_cache(
    async () => {
        const supabase = await createAnonClient();
        const { data } = await supabase.from('categories').select('*').order('name');
        return data || [];
    },
    ['discovery-categories'],
    { revalidate: 3600, tags: ['categories'] }
);

export const getFeaturedPartners = unstable_cache(
    async (limit: number = 8) => {
        const supabase = await createAnonClient();
        const { data, error } = await supabase
            .from('partners')
            .select('*')
            .eq('is_active', true)
            .limit(limit);

        if (error) return { data: [], error: error.message };

        // Deduplicate by name for clean discovery
        const unique = data.reduce((acc: any[], curr) => {
            if (!acc.find(p => p.name === curr.name)) acc.push(curr);
            return acc;
        }, []);

        return { data: unique as any, error: null };
    },
    ['featured-partners'],
    { revalidate: 120, tags: ['partners'] }
);

export const getFeaturedItems = unstable_cache(
    async (limit: number = 3) => {
        try {
            const supabase = await createAnonClient();
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
    },
    ['featured-items'],
    { revalidate: 120, tags: ['items'] }
);
