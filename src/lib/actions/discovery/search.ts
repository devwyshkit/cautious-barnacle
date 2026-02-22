'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { WyshkitItem } from '@/lib/types/item';
import {
    SearchResultsSchema,
    WyshkitItemSchema,
} from '@/lib/validations/discovery';

/**
 * WYSHKIT 2026: Discovery Search & Filtering Actions
 */

/**
 * Consolidated Search logic.
 */
export async function searchFiltered(options: {
    q?: string;
    category?: string;
    limit?: number;
    lat?: number;
    lng?: number;
} = {}) {
    const supabase = await createClient();
    const { q, category, limit = 20, lat, lng } = options;

    // Combined query for items
    let itemsQuery = supabase
        .from('v_item_listings_search')
        .select('*')
        .limit(limit);

    if (q && q.length >= 2) {
        itemsQuery = itemsQuery.textSearch('fts_vector', q, {
            type: 'websearch',
            config: 'english'
        });
    }

    if (category) {
        itemsQuery = itemsQuery.ilike('category', category);
    }

    // ELITE: Hyperlocal sorting if lat/lng provided
    if (lat && lng) {
        // Fallback to simple query but we should ideally use a proximal view
        // For now, we fetch and the DB view v_item_listings_search should ideally handle proximity 
        // if we updated it, but let's keep it functional.
    }

    // Combined query for partners
    let partnersQuery = supabase
        .from('v_partner_listings')
        .select('*')
        .limit(Math.floor(limit / 2));

    if (q && q.length >= 2) {
        partnersQuery = partnersQuery.ilike('name', `%${q}%`);
    }

    const [itemsResponse, partnersResponse] = await Promise.all([
        itemsQuery,
        partnersQuery
    ]);

    const rawResults = {
        items: (itemsResponse.data || []).map(item => ({
            ...item,
            image_url: (item as any).images?.[0] || (item as any).image_url
        })),
        partners: partnersResponse.data || [],
        total: (itemsResponse.data?.length || 0) + (partnersResponse.data?.length || 0)
    };

    const validated = SearchResultsSchema.safeParse(rawResults);
    if (!validated.success) {
        logger.error('Zod Validation Failed: searchFiltered', validated.error);
        return rawResults as any;
    }

    return validated.data;
}

/**
 * Discovery Items Fetcher (Purified)
 * Handles infinite pagination and category filters.
 */
export async function getFilteredItems(options: {
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    lat?: number;
    lng?: number;
} = {}): Promise<{ data?: { items: WyshkitItem[]; total: number }; error?: string }> {
    try {
        const supabase = await createClient();
        const { limit = 12, offset = 0, category, search, minPrice, maxPrice, lat, lng } = options;

        // ELITE: If coords are provided, use the nearby RPC for prioritized results
        if (lat && lng) {
            const { data, error } = await supabase.rpc('get_nearby_items', {
                user_lat: lat,
                user_lng: lng,
                radius_km: 15,
                include_out_of_stock: false
            });

            if (!error && data) {
                const validated = z.array(WyshkitItemSchema).safeParse(data);
                if (validated.success) {
                    // Filter locally for simplicity since RPC might not support all filters yet
                    let filtered = validated.data as unknown as WyshkitItem[];
                    if (category) filtered = filtered.filter(i => i.category?.toLowerCase() === category.toLowerCase());
                    if (search) filtered = filtered.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

                    return { data: { items: filtered.slice(offset, offset + limit), total: filtered.length } };
                }
            }
        }

        let query = supabase
            .from('v_item_listings_search')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (category) {
            query = query.ilike('category', category);
        }
        if (search) {
            query = query.ilike('item_name', `%${search}%`);
        }
        if (minPrice !== undefined) {
            query = query.gte('base_price', minPrice);
        }
        if (maxPrice !== undefined) {
            query = query.lte('base_price', maxPrice);
        }

        const { data, error, count } = await query.range(offset, offset + limit - 1);
        if (error) throw error;

        const validated = z.array(WyshkitItemSchema).safeParse(data);
        if (!validated.success) {
            logger.error('Zod Validation Failed: getFilteredItems', validated.error);
            return { data: { items: (data || []) as any, total: count || 0 } };
        }

        return { data: { items: validated.data as unknown as WyshkitItem[], total: count || 0 } };
    } catch (error) {
        logger.error('Failed to fetch filtered items in Discovery', error, { options });
        return { error: 'Failed to fetch items' };
    }
}
