import type { CartProduct } from './personalization';
import type { Address } from './address';
import type { PricingBreakdown } from './pricing';
import type { WalletInfo } from '@/lib/actions/user/wallet';

/**
 * WYSHKIT 2026: Checkout Context
 * Representing the JSONB payload returned from get_checkout_context RPC.
 */
export interface CheckoutContext {
    products: CartProduct[];
    addresses: Address[];
    pricing: PricingBreakdown | null;
    wallet_info: WalletInfo | null;
    distance_km?: number | null;
    eta_minutes?: number | null;
}
