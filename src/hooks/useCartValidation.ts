'use client';

import { useCart } from "@/components/customer/CartProvider";
import { useMemo } from "react";

/**
 * WYSHKIT 2026: Proactive Cart Validation
 * Helps detect if the user is browsing a vendor different from their current cart.
 */
export function useCartValidation(targetVendorId?: string | null) {
    const { draftOrder } = useCart();

    const isMismatch = useMemo(() => {
        if (!draftOrder?.vendor_id || !targetVendorId) return false;
        return draftOrder.vendor_id !== targetVendorId;
    }, [draftOrder?.vendor_id, targetVendorId]);

    const hasProductsInCart = (draftOrder?.products?.length || 0) > 0;

    return {
        isMismatch: isMismatch && hasProductsInCart,
        currentCartVendorId: draftOrder?.vendor_id,
        hasProductsInCart
    };
}
