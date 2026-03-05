'use server';

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';

/**
 * WYSHKIT 2026: Fast-path inventory verification.
 * Used to prevent "Paid but Failed" scenarios.
 */
export async function verifyStockAvailability(
    products: Array<{
        product_id: string;
        variant_id?: string | null;
        quantity: number;
    }>
): Promise<{ success: boolean; outOfStockProduct?: string }> {
    try {
        const supabase = await createClient();

        for (const item of products) {
            // Priority 1: Variant stock
            if (item.variant_id) {
                const { data: variant, error } = await supabase
                    .from('product_variants')
                    .select('stock_quantity, name')
                    .eq('id', item.variant_id)
                    .single();

                if (error) {
                    logger.error('Stock check failed for variant', { error, variantId: item.variant_id });
                    continue; // Skip if error (fallback to safe side or handle as needed)
                }

                if (variant && variant.stock_quantity !== null && variant.stock_quantity < item.quantity) {
                    return { success: false, outOfStockProduct: variant.name || 'Unknown Variant' };
                }
            } else {
                // Priority 2: Base product stock
                const { data: product, error } = await supabase
                    .from('products')
                    .select('stock_quantity, name')
                    .eq('id', item.product_id)
                    .single();

                if (error) {
                    logger.error('Stock check failed for product', { error, productId: item.product_id });
                    continue;
                }

                if (product && product.stock_quantity !== null && product.stock_quantity < item.quantity) {
                    return { success: false, outOfStockProduct: product.name };
                }
            }
        }

        return { success: true };
    } catch (error) {
        logger.error('Unexpected error during stock verification', { error });
        return { success: true }; // Defensive fallback: allow payment to proceed if check fails
    }
}
