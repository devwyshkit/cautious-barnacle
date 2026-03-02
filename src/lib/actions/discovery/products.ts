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

        // WYSHKIT 2026: Single Atomic Trip for Product Context
        const { data, error } = await supabase.rpc('get_product_surface_v1' as any, {
            p_product_id: productId,
            p_vendor_id_or_slug: null // Fetch standalone spec if vendor unknown
        });

        if (error) {
            logger.error('RPC Failure: get_product_surface_v1', error, { productId });
            return { data: null, error: error.message };
        }

        const raw = data as any;
        if (!raw || !raw.product_spec) {
            return { data: null, error: 'Product not found' };
        }

        const validated = WyshkitProductSchema.safeParse(raw.product_spec);
        if (!validated.success) {
            logger.error('Zod Validation Failed: getProductWithFullSpec', validated.error);
            return { data: raw.product_spec as any, error: undefined };
        }

        return { data: validated.data, error: undefined };
    } catch (error) {
        logger.error('Failed to get product surface', error, { productId });
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
/**
 * Get Product Surface (One-Trip deep link context)
 * Consolidates product, variants, and background vendor store.
 */
export async function getProductSurface(productId: string, vendorIdOrSlug: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.rpc('get_product_surface_v1' as any, {
            p_product_id: productId,
            p_vendor_id_or_slug: vendorIdOrSlug
        });

        if (error) {
            logger.error('Failed to fetch product surface', error, { productId, vendorIdOrSlug });
            return { data: null, error: error.message };
        }

        const raw = data as any;
        if (raw.error) return { data: null, error: raw.error };

        // Process vendor surface for the UI (reuse grouping logic)
        const products = (raw.vendor_surface.products || []) as unknown as WyshkitProduct[];
        const groupedProducts = products.reduce((acc: any, product: any) => {
            const catName = product.category_name || 'Other';
            if (!acc[catName]) acc[catName] = [];
            acc[catName].push(product);
            return acc;
        }, {});

        const categories = [
            { id: 'all', name: 'All', slug: 'All' },
            ...(raw.vendor_surface.categories || []).map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }))
        ];

        return {
            data: {
                product: raw.product_spec as unknown as WyshkitProduct,
                vendorContext: {
                    vendor: raw.vendor_surface.vendor as MappedVendor,
                    products,
                    productsGroupedByCategory: groupedProducts,
                    categories
                }
            },
            error: null
        };
    } catch (err: any) {
        logger.error('Unexpected error in getProductSurface', err);
        return { data: null, error: 'Failed to fetch immersive context' };
    }
}
