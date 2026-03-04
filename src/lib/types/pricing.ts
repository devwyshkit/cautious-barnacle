/**
 * WYSHKIT 2026: Pricing Types
 * 
 * Mastered by the Postgres RPC 'calculate_order_total'.
 */

export interface PricingBreakdown {
    subtotal: number;
    personalization_charges: number;
    addons_price: number;
    delivery_fee: number;
    platform_fee: number;
    gst: number;
    discount: number;
    wallet_discount: number;
    total: number;
    total_paise: number; // WYSHKIT 2026: Precise amount for Razorpay (Law 1)
    cashback_amount: number;
    wyshkit_money_earned: number;
    total_savings: number;
}
