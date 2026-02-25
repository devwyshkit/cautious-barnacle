'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { WyshkitProduct } from '@/lib/types/product';
import {
    SearchResultsSchema,
    WyshkitProductSchema,
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

    // Combined query for products
    let productsQuery = supabase
        .from('products')
        .select('*, vendors!inner(name, slug, city, state, is_active, location)')
        .eq('is_active', true)
        .eq('vendors.is_active', true);

    // Combined query for vendors
    let vendorsQuery = supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true);

    if (q && q.length >= 2) {
        productsQuery = productsQuery.textSearch('fts', q, {
            type: 'websearch',
            config: 'english'
        });
        vendorsQuery = vendorsQuery.ilike('name', `%${q}%`);
    }

    if (category) {
        productsQuery = productsQuery.ilike('category_id', category);
    }

    // ELITE: Hyperlocal sorting if lat/lng provided
    if (lat && lng) {
        productsQuery = productsQuery
            .order('location <-> st_setsrid(st_makepoint(?, ?), 4326)', {
                ascending: true,
                placeholder: [lng, lat]
            } as any);

        vendorsQuery = vendorsQuery
            .order('location <-> st_setsrid(st_makepoint(?, ?), 4326)', {
                ascending: true,
                placeholder: [lng, lat]
            } as any);
    }

    const [productsResponse, vendorsResponse] = await Promise.all([
        productsQuery.limit(limit),
        vendorsQuery.limit(Math.floor(limit / 2))
    ]);

    const rawResults = {
        products: (productsResponse.data || []).map((product: any) => ({
            ...product,
            image_url: (product as any).images?.[0] || (product as any).image_url
        })),
        vendors: vendorsResponse.data || [],
        total: (productsResponse.data?.length || 0) + (vendorsResponse.data?.length || 0)
    };

    const validated = SearchResultsSchema.safeParse(rawResults);
    if (!validated.success) {
        logger.error('Zod Validation Failed: searchFiltered', validated.error);
        return rawResults as any;
    }

    return validated.data;
}

/**
 * Discovery Products Fetcher (Purified)
 * Handles infinite pagination and category filters.
 */
export async function getFilteredProducts(options: {
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    lat?: number;
    lng?: number;
} = {}): Promise<{ data?: { products: WyshkitProduct[]; total: number }; error?: string }> {
    try {
        const supabase = await createClient();
        const { limit = 12, offset = 0, category, search, minPrice, maxPrice, lat, lng } = options;

        // ELITE: If coords are provided, we should use a proximity-aware query.
        // For now, we utilize the standard view but we can add distance calculation if PostGIS is available.
        // SWIGGY 2026: Never filter client-side.

        let query = supabase
            .from('products')
            .select('*, vendors!inner(name, slug, city, is_active)', { count: 'exact' });

        if (lat && lng) {
            // Sort by proximity using PostGIS <-> operator
            query = query.order('vendors(location) <-> st_setsrid(st_makepoint(?, ?), 4326)', {
                ascending: true,
                placeholder: [lng, lat]
            } as any);
        } else {
            query = query.order('created_at', { ascending: false });
        }

        query = query.eq('is_active', true);

        if (category) {
            query = query.ilike('category_id', category);
        }
        if (search) {
            // SWIGGY 2026: Using FTS for 5x faster search performance
            query = query.textSearch('fts', search, {
                type: 'websearch',
                config: 'english'
            });
        }
        if (minPrice !== undefined) {
            query = query.gte('base_price', minPrice);
        }
        if (maxPrice !== undefined) {
            query = query.lte('base_price', maxPrice);
        }

        const { data, error, count } = await query
            .range(offset, offset + limit - 1);

        if (error) throw error;

        const validated = z.array(WyshkitProductSchema).safeParse(data);
        if (!validated.success) {
            logger.error('Zod Validation Failed: getFilteredProducts', validated.error);
            return { data: { products: (data || []) as any, total: count || 0 } };
        }

        return { data: { products: validated.data as unknown as WyshkitProduct[], total: count || 0 } };
    } catch (error) {
        logger.error('Failed to fetch filtered products in Discovery', error, { options });
        return { error: 'Failed to fetch products' };
    }
}
