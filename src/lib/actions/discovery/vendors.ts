'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { handleActionError } from '@/lib/utils/error-handler';
import { MappedPartner } from '@/lib/types/vendor';
import { WyshkitItem } from '@/lib/types/product';

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
export const getPartnerStoreData = cache(async (partnerId: string, category?: string | null) => {
    try {
        if (!partnerId || partnerId.trim() === '') {
            return { vendor: null, products: [], blocks: [], error: 'Invalid Vendor ID' };
        }

        const supabase = await createClient();

        // 1. Fetch Vendor Basic Info
        const { data: partnerData, error: partnerError } = await supabase
            .from('vendors')
            .select(`
                id, name, image_url, rating, city, 
                avg_prep_time_mins, base_delivery_charge, 
                slug, business_type, is_online, description, gstin
            `)
            .eq('id', partnerId)
            .maybeSingle();

        if (partnerError || !partnerData) {
            logger.error('Vendor fetch failed in getPartnerStoreData', partnerError || 'Not found', { partnerId });
            return { vendor: null, products: [], blocks: [], error: partnerError?.message || 'Vendor not found' };
        }

        // Map database columns to UI-friendly MappedPartner interface
        const vendor: MappedPartner = {
            id: partnerData.id,
            name: partnerData.name,
            image_url: partnerData.image_url,
            rating: partnerData.rating ? Number(partnerData.rating) : null,
            city: partnerData.city,
            prep_mins: partnerData.avg_prep_time_mins || 45,
            delivery_fee: Number(partnerData.base_delivery_charge || 0),
            slug: partnerData.slug,
            business_type: partnerData.business_type,
            is_online: partnerData.is_online ?? true,
            description: partnerData.description,
            gstin: partnerData.gstin
        };

        // 2. Fetch Vendor Products (Filtered by Category if provided)
        let query = supabase
            .from('products')
            .select('*')
            .eq('vendor_id', partnerId)
            .eq('is_active', true);

        if (category && category !== 'Recommended' && category !== 'All') {
            query = query.eq('category', category);
        }

        const { data: itemsData, error: itemsError } = await query;

        if (itemsError) {
            logger.error('Products fetch failed in getPartnerStoreData', itemsError, { partnerId });
        }

        const products = (itemsData as unknown as WyshkitItem[]) || [];

        // 3. Fetch Distinct Categories for this Vendor (for navigation/filtering)
        const { data: catData } = await supabase
            .from('products')
            .select('category')
            .eq('vendor_id', partnerId)
            .eq('is_active', true);

        const groupedItems = products.reduce((acc: any, product: any) => {
            const cat = product.category || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push({ ...product, vendor_name: vendor.name });
            return acc;
        }, {});

        const categories = Array.from(new Set(catData?.map(i => i.category).filter(Boolean)))
            .map(c => ({ id: c, name: c, slug: c }));

        return {
            vendor,
            products: products.map(product => ({ ...product, vendor_name: vendor.name })),
            itemsGroupedByCategory: groupedItems,
            categories: [{ id: 'all', name: 'All', slug: 'All' }, ...categories],
            error: null
        };
    } catch (error) {
        logger.error('Unexpected error in getPartnerStoreData', error, { partnerId });
        return { vendor: null, products: [], categories: [], error: 'Failed to fetch vendor store data' };
    }
});

export async function getItemPartner(itemId: string) {
    const supabase = await createClient();
    const query = supabase.from('products')
        .select('vendor_id')
        .eq('id', itemId)
        .eq('is_active', true);

    const { data, error } = await query.maybeSingle();

    if (error || !data) return { data: null, error: 'Product not found' };
    return { data: data as { vendor_id: string } };
}

export async function getPartnerInfo(partnerId: string) {
    try {
        const supabase = await createClient();
        const query = supabase.from('vendors')
            .select('id, name, gstin, city')
            .eq('id', partnerId)

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

