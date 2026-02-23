'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { handleActionError } from '@/lib/utils/error-handler';
import { MappedPartner } from '@/lib/types/partner';
import { WyshkitItem } from '@/lib/types/item';

/**
 * WYSHKIT 2026: Partner & Store Actions
 */

/**
 * Deduplicated Partner Fetcher
 * Wrapped in React cache() to prevent double-hydration flicker
 * 
 * WYSHKIT 2026: Server-Driven UI (SDUI)
 * Now returns a pre-computed 'blocks' array for the StorePage.
 */
export const getPartnerStoreData = cache(async (partnerId: string, category?: string | null) => {
    try {
        if (!partnerId || partnerId.trim() === '') {
            return { partner: null, items: [], blocks: [], error: 'Invalid Partner ID' };
        }

        const supabase = await createClient();

        // 1. Fetch Partner Basic Info
        const { data: partnerData, error: partnerError } = await supabase
            .from('partners')
            .select('id, name, image_url, rating, city, prep_hours, delivery_fee, slug, business_type, is_online, description, fssai_license, gstin')
            .eq('id', partnerId)
            .maybeSingle();

        if (partnerError || !partnerData) {
            logger.error('Partner fetch failed in getPartnerStoreData', partnerError || 'Not found', { partnerId });
            return { partner: null, items: [], blocks: [], error: partnerError?.message || 'Partner not found' };
        }

        const partner = partnerData as MappedPartner;

        // 2. Fetch Partner Items (Filtered by Category if provided)
        let query = supabase
            .from('v_partner_store_items')
            .select('*')
            .eq('partner_id', partnerId);

        if (category && category !== 'Recommended' && category !== 'All') {
            query = query.eq('category', category);
        }

        const { data: itemsData, error: itemsError } = await query;

        if (itemsError) {
            logger.error('Items fetch failed in getPartnerStoreData', itemsError, { partnerId });
        }

        const items = (itemsData as unknown as WyshkitItem[]) || [];

        // 3. Fetch Distinct Categories for this Partner (for CircleRail)
        const { data: catData } = await supabase
            .from('items')
            .select('category')
            .eq('partner_id', partnerId)
            .eq('is_active', true);

        const distinctCategories = Array.from(new Set(catData?.map(i => i.category).filter(Boolean)))
            .map(c => ({ id: c, name: c, slug: c, image_url: null })); // Simplified for now

        // 4. Construct SDUI Blocks
        const blocks = [
            {
                id: 'store_header',
                type: 'STORE_HEADER',
                data: partner
            },
            {
                id: 'category_rail',
                type: 'CIRCLE_RAIL',
                title: 'Categories',
                data: [{ id: 'all', name: 'All', slug: 'All' }, ...distinctCategories]
            },
            {
                id: 'items_grid',
                type: 'PARTNER_GROUPED_GRID',
                title: category ? `Results for ${category}` : 'All Items',
                data: items.map(item => ({
                    ...item,
                    partner_name: partner.name // Required for PartnerGroupedGrid
                }))
            }
        ];

        return {
            partner,
            items,
            blocks,
            error: null
        };
    } catch (error) {
        logger.error('Unexpected error in getPartnerStoreData', error, { partnerId });
        return { partner: null, items: [], blocks: [], error: 'Failed to fetch partner store data' };
    }
});

export async function getItemPartner(itemId: string) {
    const supabase = await createClient();
    const query = supabase.from('items')
        .select('partner_id')
        .eq('id', itemId)
        .eq('is_active', true)
        .eq('approval_status', 'approved');

    const { data, error } = await query.maybeSingle();

    if (error || !data) return { data: null, error: 'Item not found' };
    return { data: data as { partner_id: string } };
}

export async function getPartnerInfo(partnerId: string) {
    try {
        const supabase = await createClient();
        const query = supabase.from('partners')
            .select('id, name, gstin, city')
            .eq('id', partnerId)

        const { data, error } = await query.maybeSingle();

        if (error || !data) {
            return { data: null, error: 'Partner not found' };
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

