'use server';

import { cache } from 'react';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getGuestSessionIdReadOnly } from '@/lib/session';
import { logger } from '@/lib/logging/logger';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { EMPTY_CART } from '@/lib/constants/cart';
import { DraftTransaction, CartProduct, SelectedPersonalization, SelectedAddon } from '@/lib/types/personalization';
import type { PricingBreakdown } from '@/lib/types/pricing';
import type { Tables } from '@/lib/supabase/types';

/**
 * WYSHKIT 2026: Cart Fetching Service
 */

export interface GetCartResult {
    cart?: DraftTransaction;
    error?: string;
    cartSessionId?: string;
    guestSessionId?: string | null;
}

export const getCart = cache(async (): Promise<GetCartResult> => {
    try {
        const supabase = await createClient();

        // 1. Resolve Auth
        const { data: { user } } = await supabase.auth.getUser();
        const guestSessionId = !user ? await getGuestSessionIdReadOnly() : null;

        if (!user && !guestSessionId) {
            return {
                cart: EMPTY_CART,
                cartSessionId: 'empty',
                guestSessionId: null
            };
        }

        const cartSessionId = user?.id ?? guestSessionId ?? 'empty';
        const queryClient = supabase; // Swiggy 2026: RLS handles guest reads via session_id

        // 2. Swiggy 2026: Single Trip Context Fetch
        const { data: context, error: contextError } = await queryClient
            .rpc('get_cart_context', {
                p_user_id: user?.id ?? undefined,
                p_session_id: guestSessionId ?? undefined
            });

        if (contextError || !context) {
            if (contextError) logError(contextError, 'GetCartContextRPC');
            return { cart: EMPTY_CART, error: contextError?.message || 'Cart context not found' };
        }

        const data = context as any;
        const productsRows = data.products || [];  // RPC purified to 'products' (Swiggy 2026 Standard)
        const dbRes = data.pricing || {};
        const sessionData = data.session || {};

        // 3. Mapping with Purified Logic (Zero Shadow Math)
        const cartProducts: CartProduct[] = productsRows.map((row: any) => {
            const quantity = Number(row.quantity) || 1;
            const personalization = (row.personalization as unknown as SelectedPersonalization) || { enabled: false };

            return {
                id: row.id || '',
                product_id: row.product_id || '',
                product_name: row.product_name || 'Product',
                product_image: (Array.isArray(row.product_images) && row.product_images[0]) || row.product_image || '/images/logo.png',
                quantity: quantity,
                // Source of Truth: RPC Pre-Calculations
                unit_price: Number(row.calculated_unit_price || 0),
                line_total: Number(row.calculated_line_total || 0),
                personalization_fee: Number(row.personalization_fee || 0),
                variant_id: row.variant_id,
                personalization: personalization,
                selected_addons: (row.selected_addons as unknown as SelectedAddon[]) || [],
                vendor_name: row.vendor_name || 'Store',
                vendor_id: row.vendor_id || '',
                vendor_city: row.vendor_city || null,
                vendor_prep_mins: Number(row.vendor_prep_mins) || null,
                base_price: Number(row.base_price || 0),
                variant_price: row.variant_price != null ? Number(row.variant_price) : null,
                variant_name: row.variant_name || undefined,
                addons_price: Number(row.addons_price || 0),
                is_personalized: !!personalization?.enabled,
                personalization_options: (row.personalization_options as any[]) || [],
            };
        });

        const vendorIds = new Set(cartProducts.map(product => (product as any).vendor_id).filter(Boolean));
        const vendorId = vendorIds.size === 1 ? Array.from(vendorIds)[0] as string : null;

        const cart: DraftTransaction = {
            products: cartProducts,
            vendor_id: vendorId as string | null,
            subtotal: Number(dbRes.subtotal) || 0,
            personalization_charges: Number(dbRes.personalization_charges) || 0,
            delivery_fee: Number(dbRes.delivery_fee) || 0,
            platform_fee: Number(dbRes.platform_fee) || 0,
            gst: Number(dbRes.gst) || 0,
            discount: Number(dbRes.discount) || 0,
            wallet_discount: Number(dbRes.wallet_discount) || 0,
            total: Number(dbRes.total) || 0,
            cashback_amount: Number(dbRes.cashback_amount) || 0,
            wyshkit_money_earned: Number(dbRes.wyshkit_money_earned) || 0,
            total_savings: Number(dbRes.total_savings) || 0,
            product_count: cartProducts.reduce((sum, product) => sum + product.quantity, 0),
            applied_coupon: sessionData.applied_coupon,
            use_wallet: sessionData.use_wallet || false,
            selected_address_id: sessionData.selected_address_id,
            gstin: sessionData.gstin
        };

        return {
            cart,
            cartSessionId,
            guestSessionId
        };
    } catch (error) {
        const { error: message } = handleActionError(error);
        return {
            cart: EMPTY_CART,
            error: message,
            cartSessionId: 'error-fallback',
            guestSessionId: null
        };
    }
});
