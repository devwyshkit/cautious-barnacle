'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  DBItem,
  DBPartner,
  OrderItem,
  ItemWithFullSpec,
  ItemWithPartner,
  ItemAddon,
  PersonalizationOption,
  Variant,
  Partner,
  Item,
  ItemReview
} from '@/lib/supabase/types';
import { logger } from '@/lib/logging/logger';

// =============================================================================
// CUSTOMER-FACING ACTIONS
// =============================================================================

/**
 * Get items for discovery feed with optional filters
 */
export async function getItems(options: {
  limit?: number;
  offset?: number;
  category?: string;
  partnerId?: string;
} = {}): Promise<{ data: Item[] | null; error?: string }> {
  try {
    const supabase = await createClient();
    const { limit = 12, offset = 0, category, partnerId } = options;

    let query = supabase
      .from('items')
      .select('id, name, base_price, images, partner_id, category, slug, mrp, partners(name, slug)')
      .eq('is_active', true)
      .eq('approval_status', 'approved')
      .neq('stock_status', 'out_of_stock')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }
    if (partnerId) {
      query = query.eq('partner_id', partnerId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { data: (data as ItemWithPartner[]) || [] };
  } catch (error) {
    logger.error('Failed to fetch items', error, { options });
    return { data: null, error: 'Failed to fetch items' };
  }
}

/**
 * Get filtered items with pagination (for infinite scroll)
 */
export async function getFilteredItems(options: {
  limit?: number;
  offset?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
} = {}): Promise<{ data?: { items: Item[]; total: number }; error?: string }> {
  try {
    const supabase = await createClient();
    const { limit = 12, offset = 0, category, search, minPrice, maxPrice } = options;

    let query = supabase
      .from('items')
      .select('id, name, base_price, images, partner_id, category, slug, mrp, partners(name, slug)', { count: 'exact' })
      .eq('is_active', true)
      .eq('approval_status', 'approved')
      .neq('stock_status', 'out_of_stock')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (minPrice !== undefined) {
      query = query.gte('base_price', minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte('base_price', maxPrice);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);
    if (error) throw error;

    return { data: { items: (data as ItemWithPartner[]) || [], total: count || 0 } };
  } catch (error) {
    logger.error('Failed to fetch filtered items', error, { options });
    return { error: 'Failed to fetch items' };
  }
}

/**
 * Get upsell items (same partner or category)
 */
export async function getUpsellItems(
  itemId: string,
  partnerId: string,
  category: string
): Promise<{ data: Item[] | null; error?: string }> {
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
    return { data: (data as ItemWithPartner[]) || [] };
  } catch (error) {
    logger.error('Failed to fetch upsell items', error, { itemId, partnerId, category });
    return { data: null, error: 'Failed to fetch upsell items' };
  }
}

/**
 * WYSHKIT 2026: Get Item with Full Specification (Unified Action)
 * Replaces getItemDetails, getItemById, and getItemWithDetails.
 * Zero-waterfall parallel fetch of all relational data.
 */
export async function getItemWithFullSpec(itemId: string): Promise<{ data: ItemWithFullSpec | null; error?: string }> {
  try {
    if (!itemId || itemId.trim() === '') {
      return { data: null, error: 'Invalid Item ID' };
    }
    const supabase = await createClient();

    const [itemRes, variantsRes, addonsRes, personalizationRes] = await Promise.all([
      supabase
        .from('items')
        .select('*, partners:partners(name, slug, city, rating, display_name, image_url, fssai_license, gstin)')
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

    const fullItem: ItemWithFullSpec = {
      ...(itemRes.data),
      partners: itemRes.data.partners as ItemWithFullSpec['partners'],
      variants: (variantsRes.data as Variant[]) || [],
      item_addons: (addonsRes.data as ItemAddon[]) || [],
      personalization_options: (personalizationRes.data as PersonalizationOption[]) || []
    };

    return { data: fullItem, error: undefined };
  } catch (error) {
    logger.error('Failed to get item with full spec', error, { itemId });
    return { data: null, error: 'Internal server error' };
  }
}



/**
 * WYSHKIT 2026: Get item reviews (Server Action)
 * Swiggy 2026 Pattern: "Data Should Come to User"
 */
export async function getItemReviews(itemId: string): Promise<{
  data: Array<ItemReview & { user?: { full_name?: string; email?: string } }> | null;
  error?: string;
}> {
  try {
    if (!itemId || itemId.trim() === '') {
      return { data: null, error: 'Invalid Item ID' };
    }
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('item_reviews') // Changed from 'reviews' to 'item_reviews'
      .select(`
        *,
        user:users(full_name, email)
      `)
      .eq('item_id', itemId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: (data as Array<ItemReview & { user?: { full_name?: string; email?: string } }>) || [] };
  } catch (error) {
    logger.error('Failed to get item reviews', error, { itemId });
    return { data: null, error: 'Failed to fetch reviews' };
  }
}

/**
 * WYSHKIT 2026: Submit item review (Server Action)
 */
export async function submitItemReview(
  itemId: string,
  rating: number,
  comment: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!itemId || itemId.trim() === '') {
      return { success: false, error: 'Invalid Item ID' };
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const { error } = await supabase
      .from('item_reviews') // Changed from 'reviews' to 'item_reviews'
      .insert({
        item_id: itemId,
        user_id: user.id,
        rating,
        comment,
        is_active: true,
      });

    if (error) throw error;

    // Revalidate partner store page (item shown via ?item= query)
    const { data: itemRow } = await supabase.from('items').select('partner_id').eq('id', itemId).single();
    if (itemRow?.partner_id) revalidatePath(`/partner/${itemRow.partner_id}`);
    return { success: true };
  } catch (error: any) {
    logger.error('Failed to submit item review', error, { itemId });
    return { success: false, error: error.message || 'Failed to submit review' };
  }
}

// =============================================================================
// PARTNER-FACING ACTIONS (CATALOG MANAGEMENT)
// =============================================================================

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
  // Physical Specifications
  material?: string;
  capacity?: string;
  weight_grams?: number;
  dimensions_cm?: { length: number; width: number; height: number };
  // B2B & Tax
  hsn_code?: string;
  gst_percentage?: number;
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

const ALLOWED_VARIANT_ATTRIBUTES = ['size', 'color', 'material'] as const;

function validateVariantAttributes(attributes?: Record<string, string>): { valid: boolean; error?: string } {
  if (!attributes || Object.keys(attributes).length === 0) return { valid: true };

  const invalidKeys = Object.keys(attributes).filter(
    key => !ALLOWED_VARIANT_ATTRIBUTES.includes(key.toLowerCase() as typeof ALLOWED_VARIANT_ATTRIBUTES[number])
  );

  if (invalidKeys.length > 0) {
    return {
      valid: false,
      error: `Invalid variant attributes: ${invalidKeys.join(', ')}. Only size, color, and material are allowed.`
    };
  }
  return { valid: true };
}

export type PersonalizationOptionInput = {
  name: string;
  price: number;
  input_type: 'text' | 'image' | 'both';
  char_limit?: number;
  instructions?: string;
  is_active?: boolean;
};

/**
 * WYSHKIT 2026: Category-driven Tax Mapping (HSN/GST Compliance)
 */
const CATEGORY_TAX_MAP: Record<string, { hsn: string; gst: number }> = {
  'flowers': { hsn: '0603', gst: 5.00 },
  'cakes': { hsn: '1905', gst: 5.00 },
  'gifts': { hsn: '9983', gst: 5.00 },
  'personalized-gifts': { hsn: '9983', gst: 12.00 }, // Premium design services
  'luxury': { hsn: '9983', gst: 18.00 },
};

/**
 * Create new item (Partner catalog)
 * WYSHKIT 2026: Auto-approval for items from active partners (Swiggy pattern)
 * Trust flows down: once partner is approved, their items are trusted
 */
export async function createItem(
  partnerId: string,
  input: ItemInput
): Promise<{ data?: { id: string }; error?: string }> {
  try {
    if (!partnerId || partnerId.trim() === '') {
      return { error: 'Invalid Partner ID' };
    }
    const supabase = await createClient();

    // WYSHKIT 2026: Check partner status for auto-approval
    // Swiggy Pattern: Items from active partners are auto-approved
    const { data: partner } = await supabase
      .from('partners')
      .select('status')
      .eq('id', partnerId)
      .maybeSingle();

    // Auto-approve if partner status is 'active', otherwise default to 'pending'
    const approvalStatus = partner?.status === 'active' ? 'approved' : 'pending';

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
        dimensions_cm: input.dimensions_cm ? (input.dimensions_cm as any) : null,
        // WYSHKIT 2026: Category-driven tax compliance
        hsn_code: input.hsn_code || CATEGORY_TAX_MAP[input.category?.toLowerCase() || '']?.hsn || '9983',
        gst_percentage: input.gst_percentage || CATEGORY_TAX_MAP[input.category?.toLowerCase() || '']?.gst || 5.00,
        approval_status: approvalStatus,
      })
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
 * Update existing item
 */
export async function updateItem(
  itemId: string,
  input: Partial<ItemInput>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!itemId || itemId.trim() === '') {
      return { success: false, error: 'Invalid Item ID' };
    }
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
        dimensions_cm: input.dimensions_cm ? (input.dimensions_cm as any) : undefined,
        updated_at: new Date().toISOString(),
      })
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
 * Delete item
 */
export async function deleteItem(
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: existing } = await supabase
      .from('items')
      .select('partner_id')
      .eq('id', itemId)
      .single();

    // Delete related variants and personalization options first
    await supabase.from('variants').delete().eq('item_id', itemId);
    await supabase.from('personalization_options').delete().eq('item_id', itemId);
    await supabase.from('item_addons').delete().eq('item_id', itemId); // Added deletion for item_addons
    await supabase.from('item_reviews').delete().eq('item_id', itemId); // Added deletion for item_reviews

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
 * Create variant for item
 */
export async function createVariant(
  itemId: string,
  input: VariantInput
): Promise<{ data?: { id: string }; error?: string }> {
  try {
    const validation = validateVariantAttributes(input.attributes);
    if (!validation.valid) {
      return { error: validation.error };
    }

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

/**
 * Update variant
 */
export async function updateVariant(
  variantId: string,
  input: Partial<VariantInput>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (input.attributes) {
      const validation = validateVariantAttributes(input.attributes);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
    }

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

/**
 * Delete variant
 */
export async function deleteVariant(
  variantId: string
): Promise<{ success: boolean; error?: string }> {
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

/**
 * Create personalization option for item
 */
export async function createPersonalizationOption(
  itemId: string,
  input: PersonalizationOptionInput
): Promise<{ data?: { id: string }; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('personalization_options')
      .insert({
        item_id: itemId,
        name: input.name,
        price: input.price,
        input_type: input.input_type,
        char_limit: input.char_limit || null,
        instructions: input.instructions || null,
        is_active: input.is_active ?? true,
      })
      .select('id')
      .single();

    if (error) throw error;

    // Update item to mark has_personalization
    await supabase
      .from('items')
      .update({ has_personalization: true })
      .eq('id', itemId);

    revalidatePath('/partner/catalog');
    return { data: { id: data.id } };
  } catch (error) {
    logger.error('Failed to create personalization option', error, { itemId });
    return { error: 'Failed to create personalization option' };
  }
}

/**
 * Delete personalization option
 */
export async function deletePersonalizationOption(
  optionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('personalization_options')
      .delete()
      .eq('id', optionId);

    if (error) throw error;

    revalidatePath('/partner/catalog');
    return { success: true };
  } catch (error) {
    logger.error('Failed to delete personalization option', error, { optionId });
    return { success: false, error: 'Failed to delete option' };
  }
}

/**
 * Bulk update stock status for multiple items
 */
export async function bulkUpdateStockStatus(
  itemIds: string[],
  stockStatus: string
): Promise<{ success: boolean; error?: string }> {
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

/**
 * Toggle item active status
 */
export async function toggleItemActive(
  itemId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
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
