'use server';

import { cache } from 'react';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getGuestSessionIdReadOnly } from '@/lib/session';
import { logger } from '@/lib/logging/logger';
import { logError, handleActionError } from '@/lib/utils/error-handler';
import { EMPTY_CART } from '@/lib/constants/cart';
import { DraftTransaction, DraftLineItem, SelectedPersonalization, SelectedAddon } from '@/lib/types/personalization';
import { PricingBreakdown } from '@/lib/constants/pricing';
import type { Tables } from '@/lib/supabase/database.types';

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
        const queryClient = user ? supabase : await createAdminClient();

        // 2. Swiggy 2026: Parallel Context Fetch
        const [detailedRes, totalsRes, sessionRes] = await Promise.all([
            queryClient
                .from('v_active_cart_detailed')
                .select('*')
                .or(user ? `user_id.eq.${user.id}` : `session_id.eq.${guestSessionId}`)
                .order('id'),
            queryClient
                .from('v_active_cart_totals')
                .select('pricing')
                .or(user ? `user_id.eq.${user.id}` : `session_id.eq.${guestSessionId}`)
                .maybeSingle(),
            queryClient
                .from('checkout_sessions')
                .select('applied_coupon, use_wallet, selected_address_id, gstin')
                .or(user ? `user_id.eq.${user.id}` : `session_id.eq.${guestSessionId}`)
                .maybeSingle()
        ]);

        if (detailedRes.error) logError(detailedRes.error, 'GetCartDetailed');
        if (totalsRes.error) logError(totalsRes.error, 'GetCartTotals');
        if (sessionRes.error) logError(sessionRes.error, 'GetCartSession');

        const itemRows = detailedRes.data || [];
        const dbRes = (totalsRes.data?.pricing as unknown as PricingBreakdown) || {} as PricingBreakdown;

        // 3. Mapping with Purified Logic
        const items: DraftLineItem[] = itemRows.map(row => {
            const item_base_price = Number(row.base_price || 0);
            const variant_price = row.variant_price != null ? Number(row.variant_price) : null;
            const unit_price = variant_price !== null ? variant_price : item_base_price;
            const quantity = Number(row.quantity) || 1;

            const selected_addons = (row.selected_addons as unknown as SelectedAddon[]) || [];
            const addons_price = selected_addons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);

            const personalization = (row.personalization as unknown as SelectedPersonalization) || { enabled: false };
            const personalization_price = (personalization?.price || 0);

            return {
                id: row.id || '',
                item_id: row.item_id || '',
                item_name: row.item_name || 'Product',
                item_image: row.item_image || '/images/logo.png',
                quantity: quantity,
                unit_price: unit_price,
                total_price: (unit_price + addons_price + personalization_price) * quantity,
                selected_variant_id: row.selected_variant_id,
                personalization: personalization,
                selected_addons: selected_addons,
                partner_name: row.partner_name || 'Store',
                partner_id: row.partner_id || '',
                partner_latitude: row.partner_latitude,
                partner_longitude: row.partner_longitude,
                partner_city: row.partner_city || null,
                partner_prep_hours: Number(row.partner_prep_hours) || null,
                base_price: item_base_price,
                variant_price: variant_price,
                variant_name: row.variant_name || undefined,
                personalization_price: personalization_price,
                addons_price: addons_price,
                is_personalized: !!personalization?.enabled,
                personalization_details: personalization?.enabled ? personalization : null,
                personalization_options: (row.personalization_options as Tables<'personalization_options'>[]) || [],
                item_addons: [],
            };
        });

        const partnerIds = new Set(items.map(item => item.partner_id).filter(Boolean));
        const partnerId = partnerIds.size === 1 ? Array.from(partnerIds)[0] as string : null;
        const sessionData = (sessionRes.data as any) || {};

        const cart: DraftTransaction = {
            items,
            partner_id: partnerId as string | null,
            subtotal: Number(dbRes.subtotal) || 0,
            personalization_charges: Number(dbRes.personalization_charges) || 0,
            delivery_fee: Number(dbRes.delivery_fee) || 0,
            platform_fee: Number(dbRes.platform_fee) || 0,
            gst: Number(dbRes.gst) || 0,
            discount: Number(dbRes.discount) || 0,
            wallet_discount: Number(dbRes.wallet_discount) || 0,
            total: Number(dbRes.total) || 0,
            item_count: items.reduce((sum, item) => sum + item.quantity, 0),
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
