'use server';

import { cache } from 'react';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { WyshkitItem } from '@/lib/types/product';
import { MappedPartner } from '@/lib/types/vendor';
import {
    WyshkitItemSchema,
} from '@/lib/validations/discovery';

/**
 * WYSHKIT 2026: Product Detail & Enrichment Actions
 */

export const getTrendingItems = cache(async (): Promise<WyshkitItem[]> => {
    const supabase = await createClient();
    const { data } = await supabase
        .from('products')
        .select('*, vendors!inner(name, slug, city, is_active)')
        .eq('is_active', true)
        .eq('vendors.is_active', true)
        .order('rating', { ascending: false })
        .limit(15);

    return (data || []) as unknown as WyshkitItem[];
});

/**
 * Get Product with Full Specification (Purified)
 * Zero-waterfall parallel fetch of all relational data.
 */
export async function getItemWithFullSpec(itemId: string) {
    try {
        if (!itemId || itemId.trim() === '') {
            return { data: null, error: 'Invalid Product ID' };
        }
        const supabase = await createClient();

        const [itemRes, variantsRes] = await Promise.all([
            supabase
                .from('products')
                .select('*, vendors:vendors(id, name, slug, city, rating, image_url, fssai_license, gstin)')
                .eq('id', itemId)
                .eq('is_active', true)
                .maybeSingle(),
            supabase
                .from('product_variants')
                .select('*')
                .eq('product_id', itemId)
                .eq('is_active', true)
                .order('price', { ascending: true })
        ]);

        if (itemRes.error) throw itemRes.error;
        if (!itemRes.data) return { data: null, error: 'Product not found' };

        const rawItem = {
            ...(itemRes.data),
            vendors: (itemRes.data.vendors as unknown) as MappedPartner,
            variants: variantsRes.data || [],
        };

        const validated = WyshkitItemSchema.safeParse(rawItem);
        if (!validated.success) {
            logger.error('Zod Validation Failed: getItemWithFullSpec', validated.error);
            return { data: rawItem as any, error: undefined };
        }

        return { data: validated.data, error: undefined };
    } catch (error) {
        logger.error('Failed to get product with full spec', error, { itemId });
        return { data: null, error: 'Internal server error' };
    }
}

/**
 * Get upsell products (same vendor or category)
 */
export async function getUpsellItems(
    itemId: string,
    partnerId: string,
    category: string
) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('products')
            .select('id, name, base_price, images, vendor_id, slug, vendors(name)')
            .eq('is_active', true)
            .neq('id', itemId)
            .or(`vendor_id.eq.${partnerId},category.eq.${category}`)
            .limit(4);

        if (error) throw error;

        const validated = z.array(WyshkitItemSchema).safeParse(data);
        if (!validated.success) {
            logger.error('Zod Validation Failed: getUpsellItems', validated.error);
            return { data: (data || []) as any };
        }

        return { data: validated.data as unknown as WyshkitItem[] };
    } catch (error) {
        logger.error('Failed to fetch upsell products', error, { itemId, partnerId, category });
        return { data: null, error: 'Failed to fetch upsell products' };
    }
}
