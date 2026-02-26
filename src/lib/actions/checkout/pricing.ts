'use server';

import { createClient } from '@/lib/supabase/server';
import type { Json } from '@/lib/supabase/database.types';
import type { PricingBreakdown } from '@/lib/types/pricing';
import { logger } from '@/lib/logging/logger';

/**
 * WYSHKIT 2026: Server Action for Atomic Order Total Calculation
 * 
 * Swiggy 2026 Pattern: Database as Single Source of Truth
 * The RPC computes everything. We return it directly — zero shadow math.
 */
export async function calculateOrderTotalRPC(
  cartProducts: Array<{
    product_id: string;
    quantity: number;
    variant_id?: string | null;
    personalization_option_id?: string | null;
    has_personalization?: boolean;
    selected_addons?: any[];
  }>,
  deliveryFeeOverride?: number | null,
  addressId?: string | null,
  couponCode?: string | null,
  distanceKm?: number | null,
  useWallet: boolean = false,
  userId?: string | null
): Promise<{ data: PricingBreakdown | null; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('calculate_order_total', {
      p_products: cartProducts.map(product => ({
        product_id: product.product_id,
        quantity: product.quantity,
        variant_id: product.variant_id ?? null,
        personalization_option_id: product.personalization_option_id ?? null,
        has_personalization: product.has_personalization ?? false,
        selected_addons: product.selected_addons ?? []
      })) as unknown as Json,
      p_delivery_fee_override: deliveryFeeOverride ?? undefined,
      p_address_id: addressId || undefined,
      p_coupon_code: couponCode || undefined,
      p_distance_km: distanceKm || undefined,
      p_use_wallet: useWallet,
      p_user_id: userId || undefined
    });

    if (error) {
      logger.error('Postgres RPC error in calculateOrderTotalRPC', error);
      return { data: null, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { data: null, error: 'Invalid response from pricing calculation' };
    }

    // Handle error response from RPC
    const response = data as Record<string, unknown>;
    if (response.error && typeof response.error === 'string') {
      return { data: null, error: response.error };
    }

    // SWIGGY 2026: Trust the database. Zero shadow math.
    const result = data as Record<string, any>;
    return {
      data: {
        subtotal: Number(result.subtotal) || 0,
        personalization_charges: Number(result.personalization_charges) || 0,
        delivery_fee: Number(result.delivery_fee) || 0,
        platform_fee: Number(result.platform_fee) || 0,
        gst: Number(result.gst) || 0,
        discount: Number(result.discount) || 0,
        wallet_discount: Number(result.wallet_discount) || 0,
        total: Number(result.total) || 0,
        cashback_amount: Number(result.cashback_amount) || 0,
      },
    };
  } catch (error) {
    logger.error('Unexpected error in calculateOrderTotalRPC', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to calculate order total',
    };
  }
}
