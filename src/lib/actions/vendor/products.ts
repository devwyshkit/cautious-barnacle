'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logging/logger';
import type { Database, Json } from '@/lib/supabase/database.types';

/**
 * WYSHKIT 2026: Product Service
 * Handles all mutations relating to Products, Variants, and Personalization.
 * Standardized for Vendor Product Management.
 */

export type ProductInput = {
    name: string;
    description?: string;
    base_price: number;
    mrp?: number;
    category_id?: string;
    images?: string[];
    has_personalization?: boolean;
    is_active?: boolean;
    production_time_minutes?: number;
    preview_time_minutes?: number;
    material?: string;
    weight_kg?: number;
    dimensions?: { length: number; width: number; height: number };
    hsn_code?: string;
    gst_percentage?: number;
    personalization_options?: any;
    product_addons?: any;
};

export type VariantInput = {
    name: string;
    price: number;
    mrp?: number;
    attributes?: Record<string, string>;
    stock_quantity?: number;
    serial_number?: string;
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
 * Create product mutation
 */
export async function createProduct(vendorId: string, input: ProductInput) {
    try {
        if (!vendorId) return { error: 'Invalid Vendor ID' };
        const supabase = await createClient();

        const { data: vendor } = await supabase
            .from('vendors')
            .select('is_active')
            .eq('id', vendorId)
            .maybeSingle();

        const slug = input.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

        const { data, error } = await supabase
            .from('products')
            .insert({
                vendor_id: vendorId,
                name: input.name,
                slug,
                description: input.description || null,
                base_price: input.base_price,
                mrp: input.mrp || null,
                category_id: input.category_id || null,
                images: input.images || [],
                has_personalization: input.has_personalization || false,
                is_active: input.is_active ?? true,
                production_time_minutes: input.production_time_minutes || null,
                preview_time_minutes: input.preview_time_minutes || null,
                material: input.material || null,
                weight_kg: input.weight_kg || null,
                dimensions: input.dimensions || null,
                hsn_code: input.hsn_code || '9983',
                gst_percentage: input.gst_percentage || 5.00,
                personalization_options: input.personalization_options || [],
            } as any)
            .select('id')
            .single();

        if (error) throw error;

        revalidatePath('/vendor/products');
        revalidatePath(`/vendor/${vendorId}`);
        revalidatePath('/');
        return { data: { id: data.id } };
    } catch (error) {
        logger.error('Failed to create product', error);
        return { error: 'Failed to create product' };
    }
}

/**
 * Update product mutation
 */
export async function updateProduct(productId: string, input: Partial<ProductInput>) {
    try {
        if (!productId) return { success: false, error: 'Invalid Product ID' };
        const supabase = await createClient();

        const { data: existing } = await supabase
            .from('products')
            .select('vendor_id')
            .eq('id', productId)
            .single();

        const { error } = await supabase
            .from('products')
            .update({
                ...input,
                updated_at: new Date().toISOString(),
                personalization_options: input.personalization_options !== undefined ? input.personalization_options : undefined,
            } as any)
            .eq('id', productId);

        if (error) throw error;

        revalidatePath('/vendor/products');
        if (existing?.vendor_id) revalidatePath(`/vendor/${existing.vendor_id}`);
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        logger.error('Failed to update product', error, { productId });
        return { success: false, error: 'Failed to update product' };
    }
}

/**
 * Delete product mutation
 */
export async function deleteProduct(productId: string) {
    try {
        const supabase = await createClient();

        const { data: existing } = await supabase
            .from('products')
            .select('vendor_id')
            .eq('id', productId)
            .single();

        // Cascade deletions (variants)
        await supabase.from('product_variants').delete().eq('product_id', productId);

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) throw error;

        revalidatePath('/vendor/products');
        if (existing?.vendor_id) revalidatePath(`/vendor/${existing.vendor_id}`);
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        logger.error('Failed to delete product', error, { productId });
        return { success: false, error: 'Failed to delete product' };
    }
}


/**
 * Variant mutations
 */
export async function createVariant(productId: string, input: VariantInput) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('product_variants')
            .insert({
                product_id: productId,
                name: input.name,
                price: input.price,
                mrp: input.mrp || null,
                attributes: input.attributes || {},
                stock_quantity: input.stock_quantity ?? 100,
                serial_number: input.serial_number || null,
                is_active: input.is_active ?? true,
            })
            .select('id')
            .single();

        if (error) throw error;
        revalidatePath('/vendor/products');
        return { data: { id: data.id } };
    } catch (error) {
        logger.error('Failed to create variant', error, { productId });
        return { error: 'Failed to create variant' };
    }
}

export async function updateVariant(variantId: string, input: Partial<VariantInput>) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('product_variants')
            .update({
                ...input,
                updated_at: new Date().toISOString(),
            })
            .eq('id', variantId);

        if (error) throw error;
        revalidatePath('/vendor/products');
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
            .from('product_variants')
            .delete()
            .eq('id', variantId);
        if (error) throw error;
        revalidatePath('/vendor/products');
        return { success: true };
    } catch (error) {
        logger.error('Failed to delete variant', error, { variantId });
        return { success: false, error: 'Failed to delete variant' };
    }
}


export async function toggleProductActive(productId: string, isActive: boolean) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('products')
            .update({ is_active: isActive })
            .eq('id', productId);
        if (error) throw error;
        revalidatePath('/vendor/products');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        logger.error('Failed to toggle product active status', error, { productId });
        return { success: false, error: 'Failed to update status' };
    }
}
