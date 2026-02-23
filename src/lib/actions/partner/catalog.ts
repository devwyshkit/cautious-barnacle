'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logging/logger';
import type { Database, Json } from '@/lib/supabase/database.types';

/**
 * WYSHKIT 2026: Catalog Service
 * Handles all mutations relating to Items, Variants, and Personalization.
 * Standardized for Partner Catalog Management.
 */

export type ItemInput = {
    name: string;
    description?: string;
    base_price: number;
    mrp?: number;
    category?: string;
    images?: string[];
    has_personalization?: boolean;
    is_active?: boolean;
    stock_status?: string;
    production_time_minutes?: number;
    preview_time_minutes?: number;
    material?: string;
    capacity?: string;
    weight_grams?: number;
    dimensions_cm?: { length: number; width: number; height: number };
    hsn_code?: string;
    gst_percentage?: number;
    personalization_options?: any;
    item_addons?: any;
};

export type VariantInput = {
    name: string;
    price: number;
    mrp?: number;
    attributes?: Record<string, string>;
    stock_quantity?: number;
    sku?: string;
    is_active?: boolean;
};

const CATEGORY_TAX_MAP: Record<string, { hsn: string; gst: number }> = {
    'flowers': { hsn: '0603', gst: 5.00 },
    'cakes': { hsn: '1905', gst: 5.00 },
    'gifts': { hsn: '9983', gst: 5.00 },
    'personalized-gifts': { hsn: '9983', gst: 12.00 },
    'luxury': { hsn: '9983', gst: 18.00 },
};

/**
 * Create item mutation
 */
export async function createItem(partnerId: string, input: ItemInput) {
    try {
        if (!partnerId) return { error: 'Invalid Partner ID' };
        const supabase = await createClient();

        const { data: partner } = await supabase
            .from('partners')
            .select('kyc_status')
            .eq('id', partnerId)
            .maybeSingle();

        const approvalStatus = partner?.kyc_status === 'ACTIVE' ? 'approved' : 'pending';

        const slug = input.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

        const { data, error } = await supabase
            .from('items')
            .insert({
                partner_id: partnerId,
                name: input.name,
                slug,
                description: input.description || null,
                base_price: input.base_price,
                mrp: input.mrp || null,
                category: input.category || null,
                images: input.images || [],
                has_personalization: input.has_personalization || false,
                is_active: input.is_active ?? true,
                stock_status: input.stock_status || 'in_stock',
                production_time_minutes: input.production_time_minutes || null,
                preview_time_minutes: input.preview_time_minutes || null,
                material: input.material || null,
                capacity: input.capacity || null,
                weight_grams: input.weight_grams || null,
                dimensions_cm: input.dimensions_cm ? `${input.dimensions_cm.length}x${input.dimensions_cm.width}x${input.dimensions_cm.height}` : null,
                hsn_code: input.hsn_code || CATEGORY_TAX_MAP[input.category?.toLowerCase() || '']?.hsn || '9983',
                gst_percentage: input.gst_percentage || CATEGORY_TAX_MAP[input.category?.toLowerCase() || '']?.gst || 5.00,
                approval_status: approvalStatus,
                personalization_options: input.personalization_options || [],
                item_addons: input.item_addons || [],
            } as Database['public']['Tables']['items']['Insert'])
            .select('id')
            .single();

        if (error) throw error;

        revalidatePath('/partner/catalog');
        revalidatePath(`/partner/${partnerId}`);
        revalidatePath('/');
        return { data: { id: data.id } };
    } catch (error) {
        logger.error('Failed to create item', error);
        return { error: 'Failed to create item' };
    }
}

/**
 * Update item mutation
 */
export async function updateItem(itemId: string, input: Partial<ItemInput>) {
    try {
        if (!itemId) return { success: false, error: 'Invalid Item ID' };
        const supabase = await createClient();

        const { data: existing } = await supabase
            .from('items')
            .select('partner_id')
            .eq('id', itemId)
            .single();

        const { error } = await supabase
            .from('items')
            .update({
                ...input,
                dimensions_cm: input.dimensions_cm ? `${input.dimensions_cm.length}x${input.dimensions_cm.width}x${input.dimensions_cm.height}` : undefined,
                updated_at: new Date().toISOString(),
                personalization_options: input.personalization_options !== undefined ? input.personalization_options : undefined,
                item_addons: input.item_addons !== undefined ? input.item_addons : undefined,
            } as Database['public']['Tables']['items']['Update'])
            .eq('id', itemId);

        if (error) throw error;

        revalidatePath('/partner/catalog');
        if (existing?.partner_id) revalidatePath(`/partner/${existing.partner_id}`);
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        logger.error('Failed to update item', error, { itemId });
        return { success: false, error: 'Failed to update item' };
    }
}

/**
 * Delete item mutation
 */
export async function deleteItem(itemId: string) {
    try {
        const supabase = await createClient();

        const { data: existing } = await supabase
            .from('items')
            .select('partner_id')
            .eq('id', itemId)
            .single();

        // Cascade deletions (variants)
        await supabase.from('variants').delete().eq('item_id', itemId);

        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', itemId);

        if (error) throw error;

        revalidatePath('/partner/catalog');
        if (existing?.partner_id) revalidatePath(`/partner/${existing.partner_id}`);
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        logger.error('Failed to delete item', error, { itemId });
        return { success: false, error: 'Failed to delete item' };
    }
}

/**
 * WYSHKIT 2026: Submit item review mutation
 */
export async function submitItemReview(
    itemId: string,
    rating: number,
    comment: string
) {
    try {
        if (!itemId) return { success: false, error: 'Invalid Item ID' };
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { success: false, error: 'Authentication required' };

        const { error } = await supabase
            .from('item_reviews')
            .insert({
                item_id: itemId,
                user_id: user.id,
                rating,
                comment,
                is_active: true,
            });

        if (error) throw error;

        // Revalidate partner store page
        const { data: itemRow } = await supabase.from('items').select('partner_id').eq('id', itemId).single();
        if (itemRow?.partner_id) revalidatePath(`/partner/${itemRow.partner_id}`);
        return { success: true };
    } catch (error: any) {
        logger.error('Failed to submit item review', error, { itemId });
        return { success: false, error: error.message || 'Failed to submit review' };
    }
}

/**
 * Variant mutations
 */
export async function createVariant(itemId: string, input: VariantInput) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('variants')
            .insert({
                item_id: itemId,
                name: input.name,
                price: input.price,
                mrp: input.mrp || null,
                attributes: input.attributes || {},
                stock_quantity: input.stock_quantity ?? 100,
                sku: input.sku || null,
                is_active: input.is_active ?? true,
            })
            .select('id')
            .single();

        if (error) throw error;
        revalidatePath('/partner/catalog');
        return { data: { id: data.id } };
    } catch (error) {
        logger.error('Failed to create variant', error, { itemId });
        return { error: 'Failed to create variant' };
    }
}

export async function updateVariant(variantId: string, input: Partial<VariantInput>) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('variants')
            .update({
                ...input,
                updated_at: new Date().toISOString(),
            })
            .eq('id', variantId);

        if (error) throw error;
        revalidatePath('/partner/catalog');
        return { success: true };
    } catch (error) {
        logger.error('Failed to update variant', error, { variantId });
        return { success: false, error: 'Failed to update variant' };
    }
}

export async function deleteVariant(variantId: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('variants')
            .delete()
            .eq('id', variantId);
        if (error) throw error;
        revalidatePath('/partner/catalog');
        return { success: true };
    } catch (error) {
        logger.error('Failed to delete variant', error, { variantId });
        return { success: false, error: 'Failed to delete variant' };
    }
}

export async function bulkUpdateStockStatus(itemIds: string[], stockStatus: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('items')
            .update({ stock_status: stockStatus })
            .in('id', itemIds);
        if (error) throw error;
        revalidatePath('/partner/catalog');
        return { success: true };
    } catch (error) {
        logger.error('Failed to bulk update stock status', error);
        return { success: false, error: 'Failed to update stock' };
    }
}

export async function toggleItemActive(itemId: string, isActive: boolean) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('items')
            .update({ is_active: isActive })
            .eq('id', itemId);
        if (error) throw error;
        revalidatePath('/partner/catalog');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        logger.error('Failed to toggle item active status', error, { itemId });
        return { success: false, error: 'Failed to update status' };
    }
}
