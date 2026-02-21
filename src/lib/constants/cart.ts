import type { DraftTransaction } from '@/lib/types/personalization';

export const EMPTY_CART: DraftTransaction = {
    items: [],
    partner_id: null,
    subtotal: 0,
    personalization_charges: 0,
    delivery_fee: 0,
    platform_fee: 0,
    gst: 0,
    discount: 0,
    wallet_discount: 0,
    total: 0,
    item_count: 0
};
