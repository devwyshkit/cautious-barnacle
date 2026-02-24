'use client';

import { useCart } from "@/components/customer/CartProvider";
import { useMemo } from "react";

/**
 * WYSHKIT 2026: Proactive Cart Validation
 * Helps detect if the user is browsing a vendor different from their current cart.
 */
export function useCartValidation(targetPartnerId?: string | null) {
    const { draftOrder } = useCart();

    const isMismatch = useMemo(() => {
        if (!draftOrder.vendor_id || !targetPartnerId) return false;
        return draftOrder.vendor_id !== targetPartnerId;
    }, [draftOrder.vendor_id, targetPartnerId]);

    const hasItemsInCart = draftOrder.products.length > 0;

    return {
        isMismatch: isMismatch && hasItemsInCart,
        currentCartPartnerId: draftOrder.vendor_id,
        hasItemsInCart
    };
}
