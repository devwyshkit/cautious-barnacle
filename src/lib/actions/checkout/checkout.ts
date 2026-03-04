'use server'

// Imports removed as they are unused or broken in WYSHKIT 2026
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import { calculateOrderTotalRPC } from './pricing'
import { logError } from '@/lib/utils/error-handler'
import { logger } from '@/lib/logging/logger';
import { hasProductPersonalization } from '@/lib/utils/personalization'
import type { PricingBreakdown } from '@/components/customer/checkout/types'
import type { CartProduct } from '@/lib/types/personalization'
import type { Address } from '@/lib/types/address'
import type { WalletInfo } from '../user/wallet'
import type { CheckoutContext } from '@/lib/types/checkout'
import type { UpsellItem } from '@/components/customer/checkout/UpsellGrid'


export interface CheckoutData {
    products: CartProduct[]
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
    vendor_name?: string
    vendor_city?: string
    vendor_prep_mins?: number
    distance_km?: number | null
    eta_minutes?: number | null
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
        if (!user && !guestSessionId) {
            return {
                products: [],
                addresses: [],
                wallet_info: null,
                pricing: null,
                applied_coupon: null,
                use_wallet: false,
                selected_address_id: null,
                user: null,
                error: 'Session not found'
            }
        }

        let sessionQuery = supabase.from('checkout_sessions').select('*');
        if (user) {
            sessionQuery = sessionQuery.eq('user_id', user.id);
        } else {
            sessionQuery = sessionQuery.eq('session_id', guestSessionId!);
        }

        const { data: checkoutSession } = await sessionQuery.maybeSingle();

        const appliedCouponCode = checkoutSession?.applied_coupon || null;
        const useWallet = checkoutSession?.use_wallet || false;
        const selectedAddressId = checkoutSession?.selected_address_id || null;
        const gstin = checkoutSession?.gstin || null;
        const guestLat = checkoutSession?.guest_lat;
        const guestLng = checkoutSession?.guest_lng;

        // 2. WYSHKIT 2026: The "One-Trip" Orchestration
        const { data: context, error: contextError } = await supabase.rpc('get_checkout_context', {
            p_user_id: user?.id ?? undefined,
            p_session_id: guestSessionId ?? undefined,
            p_selected_address_id: selectedAddressId ?? undefined,
            p_applied_coupon: appliedCouponCode ?? undefined,
            p_use_wallet: useWallet ?? undefined,
            p_guest_lat: guestLat ?? undefined,
            p_guest_lng: guestLng ?? undefined
        });

        if (contextError) {
            logError(contextError, 'GetCheckoutContext:RPCError');
            throw new Error(contextError.message);
        }

        const typedContext = context as unknown as CheckoutContext;
        const products = (typedContext.products || []) as CartProduct[];
        const addresses = (typedContext.addresses || []) as Address[];
        let pricing = typedContext.pricing as PricingBreakdown | null;

        // 3. WYSHKIT 2026: Address Pre-selection (Frictionless Logic)
        // If no address is selected but addresses exist, pre-select the first one.
        let efSelectedAddressId = selectedAddressId;
        if (!efSelectedAddressId && addresses.length > 0) {
            efSelectedAddressId = addresses[0].id;

            // Proactively refresh pricing with the new address to avoid "NaN" or zero fees
            // Zero Shadow Math: Recalculate server-side to ensure distances/fees are correct
            const { data: refreshedPricing } = await calculateOrderTotalRPC(
                products.map(p => ({
                    product_id: p.product_id,
                    quantity: p.quantity,
                    variant_id: p.variant_id,
                    selected_addons: p.selected_addons
                })),
                null,
                efSelectedAddressId,
                appliedCouponCode,
                useWallet,
                user?.id
            );
            if (refreshedPricing) {
                pricing = refreshedPricing;
            }
        }

        const distanceKm = typedContext.distance_km ? Number(typedContext.distance_km) : null;

        if (products.length === 0) {
            return {
                products: [],
                addresses: addresses,
                wallet_info: typedContext.wallet_info,
                pricing: null,
                applied_coupon: null,
                use_wallet: useWallet,
                selected_address_id: efSelectedAddressId,
                user: user ? { id: user.id, email: user.email } : null,
                error: 'Cart is empty'
            }
        }

        let appliedCoupon: { code: string; discount: number } | null = null;
        if (appliedCouponCode && pricing && (Number(pricing.discount) || 0) > 0) {
            appliedCoupon = {
                code: appliedCouponCode,
                discount: Number(pricing.discount) || 0
            }
        }

        return {
            products: products,
            addresses: addresses,
            wallet_info: typedContext.wallet_info,
            pricing: pricing ? {
                ...pricing,
                subtotal: Number(pricing.subtotal) || 0,
                total: Number(pricing.total) || 0,
                delivery_fee: Number(pricing.delivery_fee) || 0,
                platform_fee: Number(pricing.platform_fee) || 0,
                gst: Number(pricing.gst) || 0,
                discount: Number(pricing.discount) || 0,
                wallet_discount: Number(pricing.wallet_discount) || 0
            } : null,
            applied_coupon: appliedCoupon,
            use_wallet: useWallet,
            selected_address_id: efSelectedAddressId,
            gstin: gstin || null,
            user: user ? { id: user.id, email: user.email } : null,
            vendor_name: products[0]?.vendor_name || undefined,
            vendor_city: products[0]?.vendor_city || '',
            vendor_prep_mins: products[0]?.vendor_prep_mins || 30,
            distance_km: distanceKm,
            eta_minutes: typedContext.eta_minutes ? Number(typedContext.eta_minutes) : null,
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch checkout data';
        logError(error, 'GetCheckoutData');
        return {
            products: [],
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

