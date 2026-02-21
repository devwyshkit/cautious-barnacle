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
 */
export const getPartnerStoreData = cache(async (partnerId: string, includeInactive = false) => {
    try {
        if (!partnerId || partnerId.trim() === '') {
            return { partner: null, items: [], error: 'Invalid Partner ID' };
        }

        const supabase = await createClient();

        // WYSHKIT 2026: Parallel Fetching
        const { data: partnerData, error: partnerError } = await supabase
            .from('partners')
            .select('id, name, display_name, image_url, rating, city, prep_hours, delivery_fee, slug, business_type, is_online, description, fssai_license, gstin')
            .eq('id', partnerId)
            .maybeSingle();

        if (partnerError) {
            logger.error('Partner fetch failed in getPartnerStoreData', partnerError, { partnerId });
            return { partner: null, items: [], error: partnerError.message };
        }

        if (!partnerData) {
            return { partner: null, items: [], error: 'Partner not found' };
        }

        // WYSHKIT 2026: Use the optimized partner_store_items view.
        // Handles availability-first sorting and consolidated joins (addons, variants).
        const { data: itemsData, error: itemsError } = await supabase
            .from('v_partner_store_items')
            .select('*')
            .eq('partner_id', partnerId);

        if (itemsError) {
            logger.error('Items fetch failed in getPartnerStoreData', itemsError, { partnerId });
        }

        const partner = partnerData as MappedPartner;
        const items = (itemsData as unknown as WyshkitItem[]) || [];

        return {
            partner,
            items,
            error: null
        };
    } catch (error) {
        logger.error('Unexpected error in getPartnerStoreData', error, { partnerId });
        return { partner: null, items: [], error: 'Failed to fetch partner store data' };
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

