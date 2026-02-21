import { PRICING } from '@/lib/constants/pricing';

/**
 * WYSHKIT 2026: Pricing Utilities
 * 
 * Zero Reinvention: All pricing math lives in the Postgres RPC.
 * This file contains ONLY pure display/formatting helpers.
 */

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
