import { DraftTransaction as Cart, DraftLineItem, SelectedAddon, SelectedPersonalization } from '@/lib/types/personalization';
import { calculateItemPrice } from './pricing';

export type OptimisticCartItem = {
    item_id: string;
    variant_id: string | null;
    personalization: SelectedPersonalization;
    selected_addons?: SelectedAddon[];
    quantity: number;
    item_name?: string;
    item_image?: string;
    unit_price?: number;
    partner_id?: string;
    partner_name?: string;
};

/**
 * WYSHKIT 2026: Optimistic Cart Reducer
 * Pure logic for handling cart state updates before server confirmation.
 */
export function cartOptimisticReducer(state: Cart, newItem: OptimisticCartItem): Cart {
    const newItemAddonsKey = (newItem.selected_addons || []).map(a => a.id).sort().join(',');

    const existingItemIndex = state.items.findIndex(
        i => i.item_id === newItem.item_id &&
            (i.selected_variant_id ?? null) === newItem.variant_id &&
            ((i.selected_addons || []).map(a => a.id).sort().join(',') === newItemAddonsKey) &&
            (i.personalization?.enabled === newItem.personalization?.enabled &&
                (i.personalization?.option_id ?? null) === (newItem.personalization?.option_id ?? null))
    );

    let newItems;
    if (existingItemIndex >= 0) {
        newItems = state.items.map((item, idx) => {
            if (idx === existingItemIndex) {
                const updatedQuantity = item.quantity + newItem.quantity;
                const updatedItem = { ...item, quantity: updatedQuantity };
                return {
                    ...updatedItem,
                    total_price: calculateItemPrice(updatedItem)
                };
            }
            return item;
        });
    } else {
        const tempId = `optimistic-${newItem.item_id}-${newItem.variant_id || 'base'}-${Date.now()}`;
        const newItemObj: DraftLineItem = {
            id: tempId,
            item_id: newItem.item_id,
            item_name: newItem.item_name || 'Loading...',
            item_image: newItem.item_image || '/images/logo.png',
            quantity: newItem.quantity,
            unit_price: newItem.unit_price || 0,
            total_price: 0,
            selected_variant_id: newItem.variant_id,
            personalization: newItem.personalization,
            selected_addons: newItem.selected_addons,
            partner_name: newItem.partner_name,
            partner_id: newItem.partner_id,
        };

        newItems = [
            ...state.items,
            {
                ...newItemObj,
                total_price: calculateItemPrice(newItemObj)
            },
        ];
    }

    const newItemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
    const newSubtotal = newItems.reduce((sum, i) => sum + i.total_price, 0);

    return {
        ...state,
        items: newItems,
        item_count: newItemCount,
        subtotal: newSubtotal,
        total: newSubtotal,
        partner_id: newItem.partner_id || state.partner_id,
    };
}
