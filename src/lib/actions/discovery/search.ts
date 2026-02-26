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

    // WYSHKIT 2026: Atomic Search & Hyperlocal Sort via Kernel RPC
    const { data: results, error } = await supabase.rpc('search_products_atomic', {
        p_query: q || '',
        p_category_id: category || null,
        p_lat: lat || null,
        p_lng: lng || null,
        p_limit: limit
    } as any);

    if (error) {
        logger.error('search_products_atomic failed', error);
        return { products: [], vendors: [], total: 0 };
    }

    // Results from RPC are already sorted by proximity and relevance
    const rawResults = {
        products: (results || []).map((p: any) => ({
            ...p,
            image_url: p.images?.[0] || '/images/logo.png'
        })),
        vendors: [], // We'll handle vendor separation if needed, but the unified list is better for the UI
        total: results?.[0]?.total_count || 0
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
        const { limit = 12, offset = 0, category, search, lat, lng } = options;

        // WYSHKIT 2026: Atomic Discovery Fetcher (Zero Shadow Math)
        const { data, error } = await supabase.rpc('search_products_atomic', {
            p_query: search || '',
            p_category_id: category || null,
            p_lat: lat || null,
            p_lng: lng || null,
            p_limit: limit,
            p_offset: offset
        } as any);

        if (error) throw error;

        const total = data?.[0]?.total_count || 0;
        const productsRaw = (data || []).map((p: any) => ({
            ...p,
            image_url: p.images?.[0] || '/images/logo.png',
            vendors: {
                name: p.vendor_name,
                slug: p.vendor_slug,
                image_url: p.vendor_image_url,
                is_active: p.vendor_is_active
            }
        }));

        const validated = z.array(WyshkitProductSchema).safeParse(productsRaw);
        if (!validated.success) {
            logger.error('Zod Validation Failed: getFilteredProducts', validated.error);
            return { data: { products: productsRaw as any, total } };
        }

        return { data: { products: validated.data as unknown as WyshkitProduct[], total } };
    } catch (error) {
        logger.error('Failed to fetch filtered products in Discovery', error, { options });
        return { error: 'Failed to fetch products' };
    }
}
