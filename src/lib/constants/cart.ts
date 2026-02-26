import type { DraftTransaction } from '@/lib/types/personalization';

export const EMPTY_CART: DraftTransaction = {
    products: [],
    vendor_id: null,
    subtotal: 0,
    personalization_charges: 0,
    delivery_fee: 0,
    platform_fee: 0,
    gst: 0,
    discount: 0,
    wallet_discount: 0,
    total: 0,
    cashback_amount: 0,
    wyshkit_money_earned: 0,
    total_savings: 0,
    product_count: 0,
};
