/**
 * WYSHKIT 2026: Pricing Types
 * 
 * Mastered by the Postgres RPC 'calculate_order_total'.
 */

export interface PricingBreakdown {
    subtotal: number;
    personalization_charges: number;
    delivery_fee: number;
    platform_fee: number;
    gst: number;
    discount: number;
    wallet_discount: number;
    total: number;
    wyshkit_money_earned: number;
    total_savings: number;
}
