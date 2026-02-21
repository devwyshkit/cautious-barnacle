'use server';

import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getGuestSessionId, getGuestSessionIdReadOnly } from '@/lib/session';
import { logger } from '@/lib/logging/logger';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { revalidateCartPaths } from './logic';
import { getCart } from './get-cart';
import { EMPTY_CART } from '@/lib/constants/cart';
import { SelectedPersonalization, SelectedAddon } from '@/lib/types/personalization';
import type { Database, Json } from '@/lib/supabase/database.types';

/**
 * WYSHKIT 2026: Cart Mutation Actions
 */

const MAX_ITEM_QUANTITY = 10;

const addToCartSchema = z.object({
    item_id: z.string().uuid(),
    variant_id: z.string().uuid().nullable().optional(),
    personalization: z.record(z.string(), z.any()).optional(),
    selected_addons: z.array(z.record(z.string(), z.any())).optional(),
    quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY).optional()
});

const updateQuantitySchema = z.object({
    cartItemId: z.string().uuid(),
    quantity: z.number().int().min(0).max(MAX_ITEM_QUANTITY)
});

export async function addToCart(payload: {
    item_id: string;
    variant_id?: string | null;
    personalization?: SelectedPersonalization;
    selected_addons?: SelectedAddon[];
    quantity?: number;
}) {
    try {
        const validated = addToCartSchema.safeParse(payload);
        if (!validated.success) {
            return { success: false, error: `Invalid payload: ${validated.error.issues[0]?.message || 'Unknown error'}` };
        }
        const { item_id, variant_id: raw_variant_id, personalization, selected_addons, quantity: raw_qty = 1 } = validated.data;

        const variant_id = (raw_variant_id && raw_variant_id.trim() !== '') ? raw_variant_id : null;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const session_id = !user ? await getGuestSessionId() : null;

        const quantity = Math.min(Math.max(1, Math.floor(Number(raw_qty) || 1)), MAX_ITEM_QUANTITY);

        const { data, error } = await supabase.rpc('add_to_cart_atomic', {
            p_item_id: item_id,
            p_quantity: quantity,
            p_user_id: user?.id || undefined,
            p_session_id: session_id || undefined,
            p_variant_id: variant_id || undefined,
            p_personalization: (personalization || { enabled: false }) as unknown as Json,
            p_selected_addons: (selected_addons || []) as unknown as Json
        });

        if (error) {
            logError(error, 'AddToCartRPCError');
            throw error;
        }

        const res = data as { error?: string; code?: string; requiresCartClear?: boolean };
        if (res.error) {
            return {
                error: res.error,
                code: res.code,
                requiresCartClear: res.requiresCartClear
            };
        }

        revalidateCartPaths();
        const cart_result = await getCart();
        return cart_result.cart ? { success: true, cart: cart_result.cart } : { success: true };

    } catch (error) {
        logError(error, 'AddToDraftOrder');
        return handleActionError(error);
    }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
    try {
        const validated = updateQuantitySchema.safeParse({ cartItemId, quantity });
        if (!validated.success) {
            return { error: `Invalid payload: ${validated.error.issues[0]?.message || 'Unknown error'}` };
        }
        const { cartItemId: cid, quantity: q } = validated.data;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const sessionId = !user ? await getGuestSessionId() : null;

        const queryBase = supabase.from('cart_items');
        const cappedQty = Math.min(Math.max(0, Math.floor(Number(q) || 0)), MAX_ITEM_QUANTITY);

        // Get current item to check stock increase
        const { data: currentItem } = await queryBase.select('id, item_id, selected_variant_id, quantity').eq('id', cid).single();
        if (!currentItem) return { error: 'Item not found' };

        if (cappedQty > currentItem.quantity) {
            const qtyNeeded = cappedQty - currentItem.quantity;

            const { data: availableStock, error: stockError } = await supabase.rpc('get_available_stock', {
                p_item_id: !currentItem.selected_variant_id ? currentItem.item_id : undefined,
                p_variant_id: currentItem.selected_variant_id || undefined,
                p_exclude_user_id: user?.id || undefined,
                p_exclude_session_id: sessionId || undefined
            });

            if (stockError) {
                logger.error('Stock check failed', stockError);
                return { error: 'Stock check failed' };
            }

            if ((Number(availableStock) || 0) < qtyNeeded) {
                const { data: itemData } = await supabase
                    .from('items')
                    .select('name')
                    .eq('id', currentItem.item_id)
                    .single();
                let displayName = itemData?.name || 'Item';
                if (currentItem.selected_variant_id) {
                    const { data: vData } = await supabase
                        .from('variants')
                        .select('name')
                        .eq('id', currentItem.selected_variant_id)
                        .single();
                    if (vData?.name) displayName += ` (${vData.name})`;
                }
                return { error: `Insufficient stock for "${displayName}". Only ${Number(availableStock)} more available.` };
            }
        }

        if (cappedQty <= 0) {
            await queryBase.delete().eq('id', cid);
        } else {
            await queryBase.update({
                quantity: cappedQty,
                updated_at: new Date().toISOString()
            }).eq('id', cid);

            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);

            const { data: existingRes } = await supabase.from('cart_reservations')
                .select('id')
                .eq('cart_item_id', cid)
                .maybeSingle();

            if (existingRes) {
                await supabase.from('cart_reservations')
                    .update({
                        quantity: cappedQty,
                        expires_at: expiresAt.toISOString(),
                        reserved_at: new Date().toISOString()
                    })
                    .eq('id', existingRes.id);
            }
        }

        revalidateCartPaths();
        const cartResult = await getCart();
        return cartResult.cart
            ? { success: true, cart: cartResult.cart }
            : { success: true, error: cartResult.error };
    } catch (error) {
        logError(error, 'UpdateDraftOrderItemQuantity');
        return handleActionError(error);
    }
}

export async function removeCartItem(cartItemId: string) {
    return updateCartItemQuantity(cartItemId, 0);
}

export async function clearDraftOrder() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const sessionId = !user ? await getGuestSessionId() : null;

        const queryClient = user ? supabase : await createAdminClient();
        let query = queryClient.from('cart_items').delete();
        if (user) {
            query = query.eq('user_id', user.id);
        } else if (sessionId) {
            query = query.eq('session_id', sessionId);
        }
        await query;

        revalidateCartPaths();

        return { success: true, cart: EMPTY_CART };
    } catch (error) {
        logError(error, 'ClearDraftOrder');
        return handleActionError(error);
    }
}

export async function updateCartItem(
    cart_item_id: string,
    payload: {
        variant_id?: string | null;
        personalization?: SelectedPersonalization;
        selected_addons?: SelectedAddon[];
        quantity?: number;
    }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const queryClient = user ? supabase : await createAdminClient();
        let query = queryClient.from('cart_items').select('id').eq('id', cart_item_id);
        if (user) query = query.eq('user_id', user.id);
        else {
            const sessionId = await getGuestSessionIdReadOnly();
            if (!sessionId) return { error: 'No session found' };
            query = query.eq('session_id', sessionId);
        }

        const { data: existing, error: authError } = await query.maybeSingle();
        if (authError || !existing) return { error: 'Item not found or unauthorized' };

        const { variant_id, personalization, selected_addons, quantity } = payload;

        const update_data: Partial<Database['public']['Tables']['cart_items']['Update']> = {};
        if (variant_id !== undefined) update_data.selected_variant_id = variant_id;
        if (personalization !== undefined) update_data.personalization = personalization as unknown as Json;
        if (selected_addons !== undefined) update_data.selected_addons = selected_addons as unknown as Json;
        if (quantity !== undefined) update_data.quantity = Math.min(Math.max(1, Math.floor(Number(quantity))), MAX_ITEM_QUANTITY);

        update_data.updated_at = new Date().toISOString();

        const { error } = await queryClient
            .from('cart_items')
            .update(update_data)
            .eq('id', cart_item_id);

        if (error) throw error;

        revalidateCartPaths();
        return { success: true };
    } catch (err) {
        logError(err, 'UpdateCartItem');
        return { error: 'Failed to update item' };
    }
}
