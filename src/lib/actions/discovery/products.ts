'use server';

import { cache } from 'react';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { WyshkitProduct } from '@/lib/types/product';
import { MappedVendor } from '@/lib/types/vendor';
import {
    WyshkitProductSchema,
} from '@/lib/validations/discovery';

/**
 * WYSHKIT 2026: Product Detail & Enrichment Actions
 */

export const getTrendingProducts = cache(async (): Promise<WyshkitProduct[]> => {
    const supabase = await createClient();
    const { data } = await supabase
        .from('products')
        .select('*, vendors!inner(name, slug, city, is_active)')
        .eq('is_active', true)
        .eq('vendors.is_active', true)
        .order('rating', { ascending: false })
        .limit(15);

    return (data || []) as unknown as WyshkitProduct[];
});

/**
 * Get Product with Full Specification (Purified)
 * Zero-waterfall parallel fetch of all relational data.
 */
export async function getProductWithFullSpec(productId: string) {
    try {
        if (!productId || productId.trim() === '') {
            return { data: null, error: 'Invalid Product ID' };
        }
        const supabase = await createClient();

        const [productRes, variantsRes] = await Promise.all([
            supabase
                .from('products')
                .select('*, vendors:vendors(id, name, slug, city, rating, image_url, gstin)')
                .eq('id', productId)
                .eq('is_active', true)
                .maybeSingle(),
            supabase
                .from('product_variants')
                .select('*')
                .eq('product_id', productId)
                .eq('is_active', true)
                .order('price', { ascending: true })
        ]);

        if (productRes.error) throw productRes.error;
        if (!productRes.data) return { data: null, error: 'Product not found' };

        const rawProduct = {
            ...(productRes.data),
            vendors: (productRes.data.vendors as unknown) as MappedVendor,
            variants: variantsRes.data || [],
        };

        const validated = WyshkitProductSchema.safeParse(rawProduct);
        if (!validated.success) {
            logger.error('Zod Validation Failed: getProductWithFullSpec', validated.error);
            return { data: rawProduct as any, error: undefined };
        }

        return { data: validated.data, error: undefined };
    } catch (error) {
        logger.error('Failed to get product with full spec', error, { productId });
        return { data: null, error: 'Internal server error' };
    }
}

/**
 * Get upsell products (same vendor or category)
 */
export async function getUpsellProducts(
    productId: string,
    vendorId: string,
    category: string
) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('products')
            .select('id, name, base_price, images, vendor_id, slug, vendors(name)')
            .eq('is_active', true)
            .neq('id', productId)
            .or(`vendor_id.eq.${vendorId},category_id.eq.${category}`)
            .limit(4);

        if (error) throw error;

        const validated = z.array(WyshkitProductSchema).safeParse(data);
        if (!validated.success) {
            logger.error('Zod Validation Failed: getUpsellProducts', validated.error);
            return { data: (data || []) as any };
        }

        return { data: validated.data as unknown as WyshkitProduct[] };
    } catch (error) {
        logger.error('Failed to fetch upsell products', error, { productId, vendorId, category });
        return { data: null, error: 'Failed to fetch upsell products' };
    }
}
