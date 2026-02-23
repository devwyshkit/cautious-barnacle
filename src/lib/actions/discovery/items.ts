'use server';

import { cache } from 'react';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { WyshkitItem } from '@/lib/types/item';
import { MappedPartner } from '@/lib/types/partner';
import {
    WyshkitItemSchema,
} from '@/lib/validations/discovery';

/**
 * WYSHKIT 2026: Item Detail & Enrichment Actions
 */

export const getTrendingItems = cache(async (): Promise<WyshkitItem[]> => {
    const supabase = await createClient();
    const { data } = await supabase
        .from('v_trending_items')
        .select('*')
        .limit(15);

    return (data || []) as unknown as WyshkitItem[];
});

/**
 * Get Item with Full Specification (Purified)
 * Zero-waterfall parallel fetch of all relational data.
 */
export async function getItemWithFullSpec(itemId: string) {
    try {
        if (!itemId || itemId.trim() === '') {
            return { data: null, error: 'Invalid Item ID' };
        }
        const supabase = await createClient();

        const [itemRes, variantsRes, addonsRes, personalizationRes] = await Promise.all([
            supabase
                .from('items')
                .select('*, partners:partners(id, name, slug, city, rating, image_url, fssai_license, gstin)')
                .eq('id', itemId)
                .eq('is_active', true)
                .eq('approval_status', 'approved')
                .maybeSingle(),
            supabase
                .from('variants')
                .select('*')
                .eq('item_id', itemId)
                .eq('is_active', true)
                .order('price', { ascending: true }),
            supabase
                .from('item_addons')
                .select('*')
                .eq('item_id', itemId)
                .eq('is_active', true),
            supabase
                .from('personalization_options')
                .select('*')
                .eq('item_id', itemId)
                .eq('is_active', true)
                .order('prep_time_mins', { ascending: true })
        ]);

        if (itemRes.error) throw itemRes.error;
        if (!itemRes.data) return { data: null, error: 'Item not found' };

        const rawItem = {
            ...(itemRes.data),
            partners: (itemRes.data.partners as unknown) as MappedPartner,
            variants: variantsRes.data || [],
            item_addons: addonsRes.data || [],
            personalization_options: personalizationRes.data || []
        };

        const validated = WyshkitItemSchema.safeParse(rawItem);
        if (!validated.success) {
            logger.error('Zod Validation Failed: getItemWithFullSpec', validated.error);
            return { data: rawItem as any, error: undefined };
        }

        return { data: validated.data, error: undefined };
    } catch (error) {
        logger.error('Failed to get item with full spec', error, { itemId });
        return { data: null, error: 'Internal server error' };
    }
}

/**
 * Get item reviews (Server Action)
 */
export async function getItemReviews(itemId: string) {
    try {
        if (!itemId || itemId.trim() === '') {
            return { data: null, error: 'Invalid Item ID' };
        }
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('item_reviews')
            .select(`
        *,
        user:users(full_name, email)
      `)
            .eq('item_id', itemId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { data: data || [], error: null };
    } catch (error) {
        logger.error('Failed to get item reviews', error, { itemId });
        return { data: null, error: 'Failed to fetch reviews' };
    }
}

/**
 * Get upsell items (same partner or category)
 */
export async function getUpsellItems(
    itemId: string,
    partnerId: string,
    category: string
) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('items')
            .select('id, name, base_price, images, partner_id, slug, partners(name)')
            .eq('is_active', true)
            .eq('approval_status', 'approved')
            .neq('id', itemId)
            .or(`partner_id.eq.${partnerId},category.eq.${category}`)
            .limit(4);

        if (error) throw error;

        const validated = z.array(WyshkitItemSchema).safeParse(data);
        if (!validated.success) {
            logger.error('Zod Validation Failed: getUpsellItems', validated.error);
            return { data: (data || []) as any };
        }

        return { data: validated.data as unknown as WyshkitItem[] };
    } catch (error) {
        logger.error('Failed to fetch upsell items', error, { itemId, partnerId, category });
        return { data: null, error: 'Failed to fetch upsell items' };
    }
}
