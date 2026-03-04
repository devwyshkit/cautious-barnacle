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


/**
 * upsell products (same vendor or category)
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
        const { data, error } = await supabase.rpc('get_product_surface_v1', {
            p_product_id_or_slug: productId,
            p_vendor_id_or_slug: vendorIdOrSlug
        });

        if (error) {
            logger.error('Failed to fetch product surface: RPC Error', error, { productId, vendorIdOrSlug });
            return { data: null, error: error.message };
        }

        const raw = data as any;
        if (!raw || raw.error) {
            logger.warn('Product Surface: Data Missing or Business Error', { error: raw?.error, productId, vendorIdOrSlug });
            return { data: null, error: raw?.error || 'PRODUCT_NOT_FOUND' };
        }

        // WYSHKIT 2026: Law 11 Scoped Data Resolution
        const vendorSurface = raw.vendor_surface;
        if (!vendorSurface || vendorSurface.error || !vendorSurface.vendor) {
            logger.error('Product Surface: Background Vendor Context Missing', { vendorSurface, productId, vendorIdOrSlug });
            return { data: null, error: vendorSurface?.error || 'VENDOR_CONTEXT_MISSING' };
        }

        // Process vendor surface for the UI (reuse grouping logic)
        const products = (vendorSurface.products || []) as unknown as WyshkitProduct[];
        const groupedProducts = products.reduce((acc: any, product: any) => {
            const catName = product.category_name || 'Other';
            if (!acc[catName]) acc[catName] = [];
            acc[catName].push(product);
            return acc;
        }, {});

        const categories = [
            { id: 'all', name: 'All', slug: 'all' },
            ...(vendorSurface.categories || []).map((c: any) => ({
                id: c.id,
                name: c.name,
                slug: c.slug
            }))
        ];

        return {
            data: {
                product: raw.product_spec as unknown as WyshkitProduct,
                vendorContext: {
                    vendor: vendorSurface.vendor as MappedVendor,
                    products,
                    productsGroupedByCategory: groupedProducts,
                    categories
                }
            },
            error: null
        };
    } catch (err: any) {
        logger.error('Unexpected failure in getProductSurface', err);
        return { data: null, error: 'SERVICE_UNAVAILABLE' };
    }
}
