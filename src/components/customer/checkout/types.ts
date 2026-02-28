/**
 * Transaction Surface Types
 * Wyshkit 2026 Model - Block-based architecture
 */

import type { CartProduct } from '@/lib/types/personalization';
import type { Address } from '@/lib/types/address';
import type { PricingBreakdown } from '@/lib/types/pricing';

export type { PricingBreakdown };

/**
 * Address commit state
 */
export interface AddressCommitState {
  address: Address | null;
  committed: boolean;
}

/**
 * Payment method
 */
export type PaymentMethod = 'upi' | 'card' | 'netbanking';
