/**
 * WYSHKIT 2026: Doctrine Message Mapping
 * Translates structured internal codes into user-friendly, doctrine-aligned copy.
 * Principles: Reassurance, Clarity, Helpful Friction.
 */

export const DOCTRINE_ERRORS: Record<string, string> = {
    // Financial Integrity
    'LIABILITY_SHIFT_REACHED': 'This order has already entered production and cannot be modified.',
    'LIABILITY_SHIFTED': 'Production has already started. Cancellations are no longer possible.',
    'INSUFFICIENT_WALLET_BALANCE': 'Your wallet balance is insufficient for this transaction.',

    // Commerce Constraints
    'VENDOR_MISMATCH': 'You already have products from another store in your cart. Start a new order?',
    'PRODUCT_NOT_FOUND': 'One or more products are no longer available. We\'ve updated your cart.',
    'OUT_OF_STOCK': 'This product just sold out. Please explore other variants.',
    'PRICE_MISMATCH': 'Pricing has been updated. Please review the new bill before proceeding.',

    // Logistics & Auth
    'UNSERVICEABLE_LOCATION': 'This store is currently unable to deliver to your selected address.',
    'AUTH_REQUIRED': 'Please sign in to complete your order.',
    'ORDER_LIMIT_EXCEEDED': 'Maximum order limit reached for this store.',
};

/**
 * Returns a human-friendly message for a given error code.
 * Falls back to a default message if code is unknown.
 */
export function getDoctrineMessage(code: string, fallback?: string): string {
    return DOCTRINE_ERRORS[code] || fallback || 'Something went wrong. Please try again.';
}
