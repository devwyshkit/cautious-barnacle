'use client';

import { useCart } from "@/components/customer/CartProvider";
import { useMemo } from "react";

/**
 * WYSHKIT 2026: Proactive Cart Validation
 * Helps detect if the user is browsing a partner different from their current cart.
 */
export function useCartValidation(targetPartnerId?: string | null) {
    const { draftOrder } = useCart();

    const isMismatch = useMemo(() => {
        if (!draftOrder.partnerId || !targetPartnerId) return false;
        return draftOrder.partnerId !== targetPartnerId;
    }, [draftOrder.partnerId, targetPartnerId]);

    const hasItemsInCart = draftOrder.items.length > 0;

    return {
        isMismatch: isMismatch && hasItemsInCart,
        currentCartPartnerId: draftOrder.partnerId,
        hasItemsInCart
    };
}
