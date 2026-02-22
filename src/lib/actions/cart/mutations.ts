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
import { executeCommerceIntent } from '../commerce/intent-engine';

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

        const result = await executeCommerceIntent({
            intent: 'ADD_TO_CART',
            payload: {
                item_id: validated.data.item_id,
                variant_id: validated.data.variant_id ?? undefined,
                quantity: validated.data.quantity ?? 1,
                personalization: validated.data.personalization,
                selected_addons: validated.data.selected_addons
            }
        });

        if (!result.success) return { success: false, error: result.error };

        revalidateCartPaths();
        const cart_result = await getCart();
        return cart_result.cart ? { success: true, cart: cart_result.cart } : { success: true };

    } catch (error) {
        logError(error, 'AddToCartMutation');
        return handleActionError(error);
    }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
    try {
        // We need the item_id to update via executeCommerceIntent (which uses execute_cart_mutation)
        const supabase = await createClient();
        const { data: currentItem } = await supabase
            .from('cart_items')
            .select('item_id, selected_variant_id')
            .eq('id', cartItemId)
            .single();

        if (!currentItem) return { error: 'Item not found' };

        const result = await executeCommerceIntent({
            intent: 'UPDATE_CART_QUANTITY',
            payload: {
                item_id: currentItem.item_id,
                variant_id: currentItem.selected_variant_id ?? undefined,
                quantity: quantity
            }
        });

        if (!result.success) return { error: result.error };

        revalidateCartPaths();
        const cartResult = await getCart();
        return cartResult.cart
            ? { success: true, cart: cartResult.cart }
            : { success: true, error: cartResult.error };
    } catch (error) {
        logError(error, 'UpdateCartItemQuantity');
        return handleActionError(error);
    }
}

export async function removeCartItem(cartItemId: string) {
    return updateCartItemQuantity(cartItemId, 0);
}

export async function clearDraftOrder() {
    try {
        const result = await executeCommerceIntent({
            intent: 'CLEAR_CART',
            payload: {}
        });

        if (!result.success) return { success: false, error: result.error };

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
        // We need the item_id to update via executeCommerceIntent
        const supabase = await createClient();
        const { data: currentItem } = await supabase
            .from('cart_items')
            .select('item_id')
            .eq('id', cart_item_id)
            .single();

        if (!currentItem) return { error: 'Item not found' };

        const result = await executeCommerceIntent({
            intent: 'UPDATE_CART_ITEM',
            payload: {
                item_id: currentItem.item_id,
                variant_id: payload.variant_id ?? undefined,
                quantity: payload.quantity ?? 1,
                personalization: payload.personalization,
                selected_addons: payload.selected_addons
            }
        });

        if (!result.success) return { error: result.error };

        revalidateCartPaths();
        return { success: true };
    } catch (err) {
        logError(err, 'UpdateCartItem');
        return { error: 'Failed to update item' };
    }
}
