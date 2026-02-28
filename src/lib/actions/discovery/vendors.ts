'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { handleActionError } from '@/lib/utils/error-handler';
import { MappedVendor } from '@/lib/types/vendor';
import { WyshkitProduct } from '@/lib/types/product';

/**
 * WYSHKIT 2026: Vendor & Store Actions
 */

/**
 * Deduplicated Vendor Fetcher
 * Wrapped in React cache() to prevent double-hydration flicker
 * 
 * WYSHKIT 2026: Server-Driven UI (SDUI)
 * Now returns a pre-computed 'blocks' array for the StorePage.
 */
export const getVendorStoreData = cache(async (vendorId: string, category?: string | null) => {
    try {
        if (!vendorId || vendorId.trim() === '') {
            return { vendor: null, products: [], blocks: [], error: 'Invalid Vendor ID' };
        }

        const supabase = await createClient();

        // 1. Fetch Vendor Basic Info
        const { data: vendorData, error: vendorError } = await supabase
            .from('vendors')
            .select(`
                id, name, image_url, rating, city, 
                avg_prep_time_mins, base_delivery_charge, 
                slug, business_type, is_online, description, gstin
            `)
            .eq('id', vendorId)
            .maybeSingle();

        if (vendorError || !vendorData) {
            logger.error('Vendor fetch failed in getVendorStoreData', vendorError || 'Not found', { vendorId });
            return { vendor: null, products: [], blocks: [], error: vendorError?.message || 'Vendor not found' };
        }

        // Map database columns to UI-friendly MappedVendor interface
        const vendor: MappedVendor = {
            id: vendorData.id,
            name: vendorData.name,
            image_url: vendorData.image_url,
            rating: vendorData.rating ? Number(vendorData.rating) : null,
            city: vendorData.city,
            prep_mins: vendorData.avg_prep_time_mins || 45,
            delivery_fee: Number(vendorData.base_delivery_charge || 0),
            slug: vendorData.slug,
            business_type: vendorData.business_type,
            is_online: vendorData.is_online ?? true,
            description: vendorData.description,
            gstin: vendorData.gstin
        };

        // 2. Fetch Vendor Products (Filtered by Category if provided)
        let query = supabase
            .from('products')
            .select('*')
            .eq('vendor_id', vendorId)
            .eq('is_active', true);

        if (category && category !== 'Recommended' && category !== 'All') {
            query = query.eq('category_id', category);
        }

        const { data: productsData, error: productsError } = await query;

        if (productsError) {
            logger.error('Products fetch failed in getVendorStoreData', productsError, { vendorId });
        }

        const products = (productsData as unknown as WyshkitProduct[]) || [];

        // 3. Fetch Distinct Categories for this Vendor (for navigation/filtering)
        const { data: catData } = await supabase
            .from('products')
            .select('category_id')
            .eq('vendor_id', vendorId)
            .eq('is_active', true);

        const groupedProducts = products.reduce((acc: any, product: any) => {
            const cat = product.category_id || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push({ ...product, vendor_name: vendor.name });
            return acc;
        }, {});

        const categories = Array.from(new Set(catData?.map((i: any) => i.category_id).filter(Boolean)))
            .map(c => ({ id: c as string, name: c as string, slug: c as string }));

        return {
            vendor,
            products: products.map(product => ({ ...product, vendor_name: vendor.name })),
            productsGroupedByCategory: groupedProducts,
            categories: [{ id: 'all', name: 'All', slug: 'All' }, ...categories],
            error: null
        };
    } catch (error) {
        logger.error('Unexpected error in getVendorStoreData', error, { vendorId });
        return { vendor: null, products: [], categories: [], error: 'Failed to fetch vendor store data' };
    }
});

export async function getProductVendor(productId: string) {
    const supabase = await createClient();
    const query = supabase.from('products')
        .select('vendor_id')
        .eq('id', productId)
        .eq('is_active', true);

    const { data, error } = await query.maybeSingle();

    if (error || !data) return { data: null, error: 'Product not found' };
    return { data: data as { vendor_id: string } };
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

