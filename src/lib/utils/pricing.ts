import { PRICING } from '@/lib/constants/pricing';
import { DraftLineItem } from '@/lib/types/personalization';

/**
 * Calculates delivery fee based on distance.
 */
export function getDeliveryFeeByDistance(distanceKm: number | null): number {
    if (distanceKm === null) return PRICING.DELIVERY_FEE_3KM;
    if (distanceKm <= 3) return PRICING.DELIVERY_FEE_3KM;
    if (distanceKm <= 5) return PRICING.DELIVERY_FEE_5KM;
    return PRICING.DELIVERY_FEE_ABOVE_5KM;
}


/**
 * Calculates total price for a single line item including variants and addons.
 * Wyshkit 2026: Inclusive GST Model. Price displayed = Price inclusive of GST.
 * 
 * Swiggy 2026: Single Logic Path
 * This must match the Postgres RPC `calculate_order_total` exactly.
 */
export function calculateItemPrice(item: DraftLineItem): number {
    // 1. Resolve Base/Variant Price
    // Handle both DraftLineItem (unit_price) and HydratedDraftItem (base_price/variant_price)
    const basePrice = Number(item.variant_price ?? item.base_price ?? item.unit_price) || 0;
    const quantity = Number(item.quantity) || 1;

    // 2. Addons Sum
    const addonsTotal = (item.selected_addons || []).reduce((sum: number, addon: any) => sum + (Number(addon.price) || 0), 0);

    // 3. Personalization Fee
    // RPC currently uses 50 as standard if enabled, unless overridden by personalization_price
    const personalizationFee = item.personalization_price ?? (item.personalization?.enabled ? (Number(item.personalization.price) || 50) : 0);

    return (basePrice + addonsTotal + personalizationFee) * quantity;
}

/**
 * Calculates cart subtotal across all items.
 */
export function calculateCartSubtotal(items: DraftLineItem[]): number {
    return items.reduce((sum, item) => sum + calculateItemPrice(item), 0);
}

/**
 * Formats a number as Indian Rupee (Swiggy 2026 Standard)
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

