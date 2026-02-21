/**
 * Wyshkit 2026 Unified Pricing Constants
 * Hyperlocal Item Marketplace with Optional Personalization
 * 
 * CONSTRAINTS:
 * - 100% advance payment (no COD)
 * - Flat delivery fee for non-personalized items
 * - Shadowfax handles all delivery
 */
/**
 * WYSHKIT 2026: Pricing Estimates (DEPRECATED)
 * 
 * [!WARNING]
 * DO NOT use these constants for actual order calculations. 
 * The database RPC 'calculate_order_total' is the single source of truth.
 * These are kept ONLY for frontend estimate displays until the unified config RPC is ready.
 */
export const PRICING = {
  DEPRECATED_ESTIMATE_PLATFORM_FEE: 10,
  DEPRECATED_ESTIMATE_DELIVERY_FEE_3KM: 40,
  DEPRECATED_ESTIMATE_DELIVERY_FEE_5KM: 60,
  DEPRECATED_ESTIMATE_DELIVERY_FEE_7KM: 80,
  DEPRECATED_ESTIMATE_DELIVERY_FEE_ABOVE_7KM: 100,
  DEPRECATED_ESTIMATE_HIGH_VALUE_INSURANCE: 20,
  DEPRECATED_ESTIMATE_HIGH_VALUE_THRESHOLD: 50000,
  DEPRECATED_ESTIMATE_PERSONALIZATION_FEE: 50,
  DEPRECATED_ESTIMATE_DEFAULT_PREP_MINS: 30,
  DEPRECATED_ESTIMATE_PERSONALIZED_PREP_MINS: 120,
  RAZORPAY_FEE_PERCENTAGE: 0.02,
  DEFAULT_COMMISSION_PERCENTAGE: 0.10,
} as const;


export type PricingBreakdown = {
  subtotal: number;
  personalization_charges: number;
  delivery_fee: number;
  platform_fee: number;
  gst: number;
  discount: number;         // Added for coupons
  wallet_discount: number;   // Added for wallet
  total: number;
}
