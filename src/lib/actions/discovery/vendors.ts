'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { getServerLocation } from './location';
import { handleActionError } from '@/lib/utils/error-handler';
import { MappedVendor } from '@/lib/types/vendor';
import { WyshkitProduct } from '@/lib/types/product';

/**
 * WYSHKIT 2026: Vendor & Store Actions
 */

interface RawVendorSurface {
    vendor?: MappedVendor;
    products?: any[];
    categories?: any[];
    error?: string;
}

/**
 * Deduplicated Vendor Fetcher
 * Wrapped in React cache() to prevent double-hydration flicker
 */
export const getVendorStoreData = cache(async (vendorIdOrSlug: string, category?: string | null) => {
    try {
        if (!vendorIdOrSlug || vendorIdOrSlug.trim() === '') {
            return { vendor: null, products: [], categories: [], error: 'Invalid Vendor ID' };
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const location = await getServerLocation(user);

        // WYSHKIT 2026: One-Trip Vendor Surface - Now with Law 10 ETA
        const { data, error } = await supabase.rpc('get_vendor_surface', {
            p_vendor_id_or_slug: vendorIdOrSlug,
            p_category_slug: category || undefined,
            p_lat: location?.lat,
            p_lng: location?.lng
        });

        if (error) {
            if (error.message?.includes('fetch failed')) {
                logger.error('[INDIA_DNS_BLOCK] Vendor surface fetch failed.');
            }
            logger.error('Vendor surface RPC failed', error, { vendorId: vendorIdOrSlug });
            return { vendor: null, products: [], categories: [], error: error.message };
        }

        const raw = data as unknown as RawVendorSurface;
        if (!raw || raw.error) {
            return { vendor: null, products: [], categories: [], error: raw?.error || 'Vendor not found' };
        }

        const products = (raw.products || []) as unknown as WyshkitProduct[];

        // Group by Category Name for the UI
        const groupedProducts = products.reduce((acc: any, product: any) => {
            const catName = product.category_name || 'Other';
            if (!acc[catName]) acc[catName] = [];
            acc[catName].push(product);
            return acc;
        }, {});

        // Build Category Filters (Always include 'All')
        const uniqueCategories = raw.categories || [];
        const categoryFilters = [
            { id: 'all', name: 'All', slug: 'All' },
            ...uniqueCategories.map((c: any) => ({
                id: c.id,
                name: c.name,
                slug: c.slug || c.name
            }))
        ];

        return {
            vendor: raw.vendor || null,
            products,
            productsGroupedByCategory: groupedProducts,
            categories: categoryFilters,
            error: null
        };
    } catch (error: any) {
        logger.error('Unexpected error in getVendorStoreData', error, { vendorId: vendorIdOrSlug });
        return { vendor: null, products: [], categories: [], error: 'Failed to fetch vendor store data' };
    }
});

export async function getProductVendor(productId: string) {
    try {
        const supabase = await createClient();
        const query = supabase.from('products')
            .select('vendor_id')
            .eq('id', productId)
            .eq('is_active', true);

        const { data, error } = await query.maybeSingle();

        if (error || !data) return { data: null, error: 'Product not found' };
        return { data: data as { vendor_id: string } };
    } catch (err) {
        return { data: null, error: 'Network failure' };
    }
}

export async function getVendorInfo(vendorId: string) {
    try {
        const supabase = await createClient();
        const query = supabase.from('vendors')
            .select('id, name, gstin, city')
            .eq('id', vendorId)

        const { data, error } = await query.maybeSingle();

        if (error || !data) {
            return { data: null, error: 'Vendor not found' };
        }

        return {
            data: {
                id: data.id,
                name: data.name,
                gstin: data.gstin || null,
                address: data.city || 'Bangalore, India'
            }
        };
    } catch (error) {
        const { error: message } = handleActionError(error);
        return { data: null, error: message };
    }
}
