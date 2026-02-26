'use server';

import { cache } from 'react';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getGuestSessionIdReadOnly } from '@/lib/session';
import { logger } from '@/lib/logging/logger';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { EMPTY_CART } from '@/lib/constants/cart';
import { DraftTransaction, DraftLineItem, SelectedPersonalization, SelectedAddon } from '@/lib/types/personalization';
import type { PricingBreakdown } from '@/lib/types/pricing';
import type { Tables } from '@/lib/supabase/types';

/**
 * WYSHKIT 2026: Cart Fetching Service
 */

export interface GetCartResult {
    cart?: DraftTransaction;
    error?: string;
    cartIdentity?: string;
    guestSessionId?: string | null;
}

export const getCart = cache(async (): Promise<GetCartResult> => {
    try {
        const supabase = await createClient();

        // 1. Resolve Identity
        const { data: { user } } = await supabase.auth.getUser();
        const guestSessionId = !user ? await getGuestSessionIdReadOnly() : null;

        if (!user && !guestSessionId) {
            return {
                cart: EMPTY_CART,
                cartIdentity: 'empty',
                guestSessionId: null
            };
        }

        const cartIdentity = user?.id ?? guestSessionId ?? 'empty';
        const queryClient = supabase; // Swiggy 2026: RLS handles guest reads via session_id

        // 2. Swiggy 2026: Single Trip Context Fetch
        const { data: context, error: contextError } = await queryClient
            .rpc('get_cart_context', {
                p_user_id: user?.id ?? undefined,
                p_session_id: guestSessionId ?? undefined
            });

        if (contextError) {
            logError(contextError, 'GetCartContextRPC');
            return { cart: EMPTY_CART, error: contextError.message };
        }

        const data = context as any;
        const productsRows = data.products || data.items || [];  // RPC returns 'products' (Swiggy 2026 Standard)
        const dbRes = data.pricing || {};
        const sessionData = data.session || {};

        // 3. Mapping with Purified Logic
        const products: DraftLineItem[] = productsRows.map((row: any) => {
            const quantity = Number(row.quantity) || 1;
            const base_price = Number(row.variant_price ?? row.base_price ?? 0);
            const selected_addons = (row.selected_addons as unknown as SelectedAddon[]) || [];
            const addons_price = selected_addons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
            const personalization = (row.personalization as unknown as SelectedPersonalization) || { enabled: false };

            // WYSHKIT 2026: Zero Shadow Math. 
            // We trust the DB's line_total and personalization_fee 100%. No fallback derivations.
            return {
                id: row.id || '',
                product_id: row.product_id || '',
                product_name: row.product_name || 'Product',
                product_image: (Array.isArray(row.product_images) && row.product_images[0]) || row.product_image || '/images/logo.png',
                quantity: quantity,
                unit_price: base_price + addons_price,
                line_total: Number(row.line_total || 0),
                personalization_fee: Number(row.personalization_fee || 0),
                variant_id: row.variant_id,
                personalization: personalization,
                selected_addons: selected_addons,
                vendor_name: row.vendor_name || 'Store',
                vendor_id: row.vendor_id || '',
                vendor_city: row.vendor_city || null,
                vendor_prep_mins: Number(row.vendor_prep_mins) || null,
                base_price: Number(row.base_price || 0),
                variant_price: row.variant_price != null ? Number(row.variant_price) : null,
                variant_name: row.variant_name || undefined,
                addons_price: addons_price,
                is_personalized: !!personalization?.enabled,
                personalization_options: (row.personalization_options as any[]) || [],
            };
        });

        const vendorIds = new Set(products.map(product => (product as any).vendor_id).filter(Boolean));
        const vendorId = vendorIds.size === 1 ? Array.from(vendorIds)[0] as string : null;

        const cart: DraftTransaction = {
            products,
            vendor_id: vendorId as string | null,
            subtotal: Number(dbRes.subtotal) || 0,
            personalization_charges: Number(dbRes.personalization_charges) || 0,
            delivery_fee: Number(dbRes.delivery_fee) || 0,
            platform_fee: Number(dbRes.platform_fee) || 0,
            gst: Number(dbRes.gst) || 0,
            discount: Number(dbRes.discount) || 0,
            wallet_discount: Number(dbRes.wallet_discount) || 0,
            total: Number(dbRes.total) || 0,
            cashback_amount: Number((dbRes as any).cashback_amount) || 0,
            product_count: products.reduce((sum, product) => sum + product.quantity, 0),
            applied_coupon: sessionData.applied_coupon,
            use_wallet: sessionData.use_wallet || false,
            selected_address_id: sessionData.selected_address_id,
            gstin: sessionData.gstin
        };

        return {
            cart,
            cartIdentity,
            guestSessionId
        };
    } catch (error) {
        const { error: message } = handleActionError(error);
        return {
            cart: EMPTY_CART,
            error: message,
            cartIdentity: 'error-fallback',
            guestSessionId: null
        };
    }
});
