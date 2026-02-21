'use server'

import { getCart, getTransactionData } from './draft-order'
import { getAddresses } from './addresses'
import { getWalletInfo } from './wallet'
import { calculateOrderTotalRPC } from './pricing'
import { logError } from '@/lib/utils/error-handler'
import { calculateHaversineDistance } from '@/lib/utils/distance'
import { getDeliveryFeeByDistance } from '@/lib/utils/pricing'
import { hasItemPersonalization } from '@/lib/utils/personalization'
import type { HydratedDraftItem, PricingBreakdown } from '@/components/customer/checkout/types'
import type { Address } from '@/lib/types/address'
import type { WalletInfo } from './wallet'
import type { UpsellItem } from '@/components/features/UpsellGrid'

export interface CheckoutData {
    items: HydratedDraftItem[]
    addresses: Address[]
    walletInfo: WalletInfo | null
    pricing: PricingBreakdown | null
    appliedCoupon: {
        code: string
        discount: number
    } | null
    useWallet: boolean
    gstin?: string | null
    user: {
        id: string
        email?: string
        name?: string
    } | null
    partnerName?: string
    partnerCity?: string
    partnerPrepMins?: number
    error?: string
}

import { cache } from 'react'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { validateCoupon } from './coupons'

/**
 * WYSHKIT 2026: The "One-Trip" Checkout Orchestrator
 * Consolidates all necessary checkout data into a single server-side call.
 * 
 * Swiggy 2026 Pattern: Deduplicated Server Fetching
 * - Uses React cache() to ensure a single execution per request.
 * - State (coupons, wallet toggle) managed via cookies for stateless resilience.
 */
export const getCheckoutData = cache(async (): Promise<CheckoutData> => {
    try {
        const cookieStore = await cookies()
        const appliedCouponCode = cookieStore.get('applied_coupon')?.value
        const useWallet = cookieStore.get('use_wallet')?.value === 'true'
        const selectedAddressId = cookieStore.get('selected_address_id')?.value
        const gstin = cookieStore.get('gstin')?.value

        // 1. Fetch base data in parallel
        const supabase = await (await import('@/lib/supabase/server')).createClient();
        const [cartRes, addressesRes, walletRes, { data: { user } }] = await Promise.all([
            getCart(),
            getAddresses(),
            getWalletInfo(),
            supabase.auth.getUser()
        ])

        const cart = cartRes.cart
        const addresses = addressesRes.addresses as Address[] || []
        const walletInfo = walletRes.data || null

        if (!cart || cart.items.length === 0) {
            return {
                items: [],
                addresses: addresses,
                walletInfo: walletInfo,
                pricing: null,
                appliedCoupon: null,
                useWallet: useWallet,
                user: user ? { id: user.id, email: user.email } : null,
                error: 'Cart is empty'
            }
        }

        // 2. Hydrate items (Already hydrated from getCart, just map to HydratedDraftItem if needed)
        // Wyshkit 2026: Strict Type Mapping
        const hydratedItems: HydratedDraftItem[] = cart.items.map(item => ({
            itemId: item.item_id,
            variantId: item.selected_variant_id,
            personalization: item.personalization || { enabled: false },
            selectedAddons: item.selected_addons || [],
            quantity: item.quantity,
            id: item.id,
            name: item.item_name,
            image: item.item_image || '/images/logo.png',
            basePrice: item.base_price || item.unit_price,
            variantPrice: item.variant_price || 0,
            variantName: item.variant_name,
            personalizationPrice: item.personalization_price || 0,
            partnerId: item.partner_id,
            partnerName: item.partner_name
        }));

        const pricingItems = hydratedItems.map(item => ({
            item_id: item.itemId,
            quantity: item.quantity,
            variant_id: item.variantId,
            personalization_option_id: item.personalization.option_id || null,
            has_personalization: hasItemPersonalization(item),
            selected_addons: item.selectedAddons || []
        }))

        // WYSHKIT 2026: Prioritize the manually selected address from cookie
        let defaultAddress = selectedAddressId
            ? addresses.find(a => a.id === selectedAddressId) || addresses.find(a => a.is_default) || addresses[0]
            : addresses.find(a => a.is_default) || addresses[0]

        // WYSHKIT 2026: Guest Fallback Logic (Zero-Return Disconnect Fix)
        // If no saved address, try to create a "Virtual Address" from homepage location cookies.
        if (!defaultAddress) {
            const guestLat = cookieStore.get('wyshkit_lat')?.value
            const guestLng = cookieStore.get('wyshkit_lng')?.value
            const guestName = cookieStore.get('wyshkit_location_name')?.value

            if (guestLat && guestLng) {
                defaultAddress = {
                    id: 'guest_location',
                    name: guestName || 'Selected Location',
                    address_line1: 'Current Location',
                    latitude: parseFloat(guestLat),
                    longitude: parseFloat(guestLng),
                    is_default: false
                } as Address
            }
        }

        // WYSHKIT 2026: If no address exists (even virtual), we skip RPC but return valid structure
        if (!defaultAddress) {
            return {
                items: hydratedItems,
                addresses: addresses,
                walletInfo: walletInfo,
                pricing: null,
                appliedCoupon: null,
                useWallet: useWallet,
                user: user ? { id: user.id, email: user.email } : null
            }
        }

        // WYSHKIT 2026: Extract partner location from the first item (Swiggy Pattern: single store per order)
        const firstItem = cart.items[0];
        const partnerLat = firstItem?.partner_latitude || 12.9716; // Default to Bangalore center if missing
        const partnerLng = firstItem?.partner_longitude || 77.5946;

        const distanceKm = calculateHaversineDistance(
            defaultAddress.latitude,
            defaultAddress.longitude,
            partnerLat,
            partnerLng
        )

        // WYSHKIT 2026: Atomic Pricing Pivot
        // We pass useWallet and userId to the RPC. 
        // We no longer calculate deliveryFee in JS; RPC handles it via distanceKm.
        const pricingRes = await calculateOrderTotalRPC(
            pricingItems,
            0, // deliveryFee override not needed
            defaultAddress.id,
            appliedCouponCode,
            distanceKm ?? undefined,
            useWallet,
            user?.id
        )

        if (pricingRes.error || !pricingRes.data) {
            logError(new Error(pricingRes.error || 'Pricing calculation returned no data'), 'GetCheckoutData:PricingRPC');
            return {
                items: hydratedItems,
                addresses: addresses,
                walletInfo: walletInfo,
                pricing: null,
                appliedCoupon: null,
                useWallet: useWallet,
                user: user ? { id: user.id, email: user.email } : null,
                error: pricingRes.error || 'Pricing calculation failed',
                gstin: gstin || null,
            }
        }

        const pricing = pricingRes.data;
        let appliedCoupon: { code: string; discount: number } | null = null

        if (appliedCouponCode && pricing.discount > 0) {
            appliedCoupon = {
                code: appliedCouponCode,
                discount: pricing.discount
            }
        }

        return {
            items: hydratedItems,
            addresses: addresses,
            walletInfo: walletInfo,
            pricing: pricing,
            appliedCoupon: appliedCoupon,
            useWallet: useWallet,
            gstin: gstin || null,
            user: user ? { id: user.id, email: user.email } : null,
            partnerName: hydratedItems[0]?.partnerName,
            partnerCity: 'Bangalore', // Default city - can be hydrated from partner metadata if needed
            partnerPrepMins: 30, // Default prep mins
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch checkout data';
        logError(error, 'GetCheckoutData');
        return {
            items: [],
            addresses: [],
            walletInfo: null,
            pricing: null,
            appliedCoupon: null,
            useWallet: false,
            user: null,
            error: errorMessage
        }
    }
})

/**
 * WYSHKIT 2026: Stateless Mutations
 * These actions update cookies and revalidate the checkout layout.
 */
export async function applyCouponAction(code: string | null) {
    const cookieStore = await cookies()
    if (code) {
        cookieStore.set('applied_coupon', code, { maxAge: 60 * 60 }) // 1 hour
    } else {
        cookieStore.delete('applied_coupon')
    }
    revalidatePath('/checkout')
    return { success: true }
}

export async function toggleWalletAction(use: boolean) {
    const cookieStore = await cookies()
    cookieStore.set('use_wallet', String(use), { maxAge: 60 * 60 })
    revalidatePath('/checkout')
    return { success: true }
}

export async function setSelectedAddressAction(addressId: string | null) {
    const cookieStore = await cookies()
    if (addressId) {
        cookieStore.set('selected_address_id', addressId, { maxAge: 60 * 60 })
    } else {
        cookieStore.delete('selected_address_id')
    }
    revalidatePath('/checkout')
    return { success: true }
}
