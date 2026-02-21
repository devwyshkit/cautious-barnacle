'use server'

// Imports removed as they are unused or broken in WYSHKIT 2026
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import { calculateOrderTotalRPC } from './pricing'
import { logError } from '@/lib/utils/error-handler'
import { logger } from '@/lib/logging/logger';
import { calculateHaversineDistance } from '@/lib/utils/sla'
import { hasItemPersonalization } from '@/lib/utils/personalization'
import type { PricingBreakdown } from '@/components/customer/checkout/types'
import type { DraftLineItem } from '@/lib/types/personalization'
import type { Address } from '@/lib/types/address'
import type { WalletInfo } from '../user/wallet'
import type { CheckoutContext } from '@/lib/types/checkout'
import type { UpsellItem } from '@/components/customer/checkout/UpsellGrid'
import { PRICING } from '@/lib/constants/pricing'

export interface CheckoutData {
    items: DraftLineItem[]
    addresses: Address[]
    wallet_info: WalletInfo | null
    pricing: PricingBreakdown | null
    applied_coupon: {
        code: string
        discount: number
    } | null
    use_wallet: boolean
    selected_address_id: string | null
    gstin?: string | null
    user: {
        id: string
        email?: string
        name?: string
    } | null
    partner_name?: string
    partner_city?: string
    partner_prep_mins?: number
    distance_km?: number | null
    error?: string
}

import { cache } from 'react'
import { executeCommerceIntent } from '../commerce/intent-engine'

/**
 * WYSHKIT 2026: The "One-Trip" Checkout Orchestrator
 * Consolidates all necessary checkout data into a single server-side call.
 */
export const getCheckoutData = cache(async (): Promise<CheckoutData> => {
    try {
        const supabase = await (await import('@/lib/supabase/server')).createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { getGuestSessionIdReadOnly } = await import('@/lib/session');
        const guestSessionId = !user ? await getGuestSessionIdReadOnly() : null;

        // 1. Resolve Session State
        let sessionQuery = supabase.from('checkout_sessions').select('*');
        if (user) {
            sessionQuery = sessionQuery.eq('user_id', user.id);
        } else if (guestSessionId) {
            sessionQuery = sessionQuery.eq('session_id', guestSessionId);
        } else {
            sessionQuery = sessionQuery.eq('id', '00000000-0000-0000-0000-000000000000');
        }

        const { data: checkoutSession } = await sessionQuery.maybeSingle();

        const appliedCouponCode = checkoutSession?.applied_coupon || null;
        const useWallet = checkoutSession?.use_wallet || false;
        const selectedAddressId = checkoutSession?.selected_address_id || null;
        const gstin = checkoutSession?.gstin || null;
        const guestLat = checkoutSession?.guest_lat;
        const guestLng = checkoutSession?.guest_lng;

        // 2. WYSHKIT 2026: The "One-Trip" Orchestration
        const { data: context, error: contextError } = await supabase.rpc('get_checkout_context' as any, {
            p_user_id: user?.id,
            p_session_id: guestSessionId,
            p_selected_address_id: selectedAddressId,
            p_applied_coupon: appliedCouponCode,
            p_use_wallet: useWallet,
            p_guest_lat: guestLat,
            p_guest_lng: guestLng
        });

        if (contextError) {
            logError(contextError, 'GetCheckoutContext:RPCError');
            throw new Error(contextError.message);
        }

        const typedContext = context as unknown as CheckoutContext; // Typed from JSONB RPC
        const items = (typedContext.items || []) as DraftLineItem[];
        const addresses = (typedContext.addresses || []) as Address[];
        const pricing = typedContext.pricing as PricingBreakdown | null;
        const distanceKm = typedContext.distance_km ? Number(typedContext.distance_km) : null;

        if (items.length === 0) {
            return {
                items: [],
                addresses: addresses,
                wallet_info: typedContext.wallet_info,
                pricing: null,
                applied_coupon: null,
                use_wallet: useWallet,
                selected_address_id: selectedAddressId,
                user: user ? { id: user.id, email: user.email } : null,
                error: 'Cart is empty'
            }
        }

        let appliedCoupon: { code: string; discount: number } | null = null;
        if (appliedCouponCode && pricing && pricing.discount > 0) {
            appliedCoupon = {
                code: appliedCouponCode,
                discount: pricing.discount
            }
        }

        return {
            items: items,
            addresses: addresses,
            wallet_info: typedContext.wallet_info,
            pricing: pricing,
            applied_coupon: appliedCoupon,
            use_wallet: useWallet,
            selected_address_id: selectedAddressId,
            gstin: gstin || null,
            user: user ? { id: user.id, email: user.email } : null,
            partner_name: items[0]?.partner_name,
            partner_city: items[0]?.partner_city || 'Bangalore',
            partner_prep_mins: items[0]?.partner_prep_hours ? items[0].partner_prep_hours * 60 : 30,
            distance_km: distanceKm,
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch checkout data';
        logError(error, 'GetCheckoutData');
        return {
            items: [],
            addresses: [],
            wallet_info: null,
            pricing: null,
            applied_coupon: null,
            use_wallet: false,
            selected_address_id: null,
            user: null,
            error: errorMessage
        }
    }
})

/**
 * WYSHKIT 2026: Commerce Intent Proxies
 * These actions now delegate to the unified executeCommerceIntent engine.
 */
export async function applyCouponAction(code: string | null) {
    return executeCommerceIntent({ intent: 'APPLY_COUPON', payload: { code } });
}

export async function toggleWalletAction(use: boolean) {
    return executeCommerceIntent({ intent: 'TOGGLE_WALLET', payload: { enabled: use } });
}

export async function setSelectedAddressAction(addressId: string | null) {
    if (!addressId) return { success: false };
    return executeCommerceIntent({ intent: 'SET_ADDRESS', payload: { address_id: addressId } });
}

