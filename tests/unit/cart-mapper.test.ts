import { describe, it, expect } from 'vitest';
import { mapRawToDraftLineItem, CartItemRawRow } from '@/lib/utils/mappers';

describe('mapRawToDraftLineItem', () => {
    const baseRow: CartItemRawRow = {
        id: 'cart-1',
        item_id: 'item-abc',
        quantity: 2,
        selected_variant_id: null,
        personalization: null,
        selected_addons: null,
        item_name: 'Custom Mug',
        item_image: '/mug.jpg',
        base_price: 500,
        personalization_options: [],
        item_is_active: true,
        variant_name: null,
        variant_price: null,
        partner_id: 'partner-1',
        partner_name: 'Artisan Studio',
        partner_city: 'Bangalore',
        partner_latitude: 12.97,
        partner_longitude: 77.59,
        partner_prep_hours: 2,
    };

    it('maps basic item with correct prices', () => {
        const result = mapRawToDraftLineItem(baseRow);
        expect(result.item_id).toBe('item-abc');
        expect(result.item_name).toBe('Custom Mug');
        expect(result.unit_price).toBe(500);
        expect(result.total_price).toBe(1000); // 500 * 2
        expect(result.quantity).toBe(2);
        expect(result.partner_name).toBe('Artisan Studio');
        expect(result.partner_city).toBe('Bangalore');
    });

    it('uses variant price when variant is present', () => {
        const row: CartItemRawRow = {
            ...baseRow,
            selected_variant_id: 'var-1',
            variant_name: 'Large',
            variant_price: 750,
        };
        const result = mapRawToDraftLineItem(row);
        expect(result.unit_price).toBe(750);
        expect(result.total_price).toBe(1500); // 750 * 2
        expect(result.variant_name).toBe('Large');
    });

    it('includes addon pricing in total', () => {
        const row: CartItemRawRow = {
            ...baseRow,
            selected_addons: [
                { id: 'addon-1', name: 'Gift Wrap', price: 50 },
                { id: 'addon-2', name: 'Card', price: 30 },
            ],
        };
        const result = mapRawToDraftLineItem(row);
        expect(result.addons_price).toBe(80);
        expect(result.total_price).toBe((500 + 80) * 2); // (base + addons) * qty
    });

    it('includes personalization pricing in total', () => {
        const row: CartItemRawRow = {
            ...baseRow,
            personalization: { enabled: true, option_id: 'opt-1', price: 100 },
        };
        const result = mapRawToDraftLineItem(row);
        expect(result.personalization_price).toBe(100);
        expect(result.is_personalized).toBe(true);
        expect(result.total_price).toBe((500 + 100) * 2); // (base + pers) * qty
    });

    it('handles missing item data gracefully', () => {
        const row: CartItemRawRow = {
            ...baseRow,
            item_name: null,
            base_price: null,
            partner_name: null,
        };
        const result = mapRawToDraftLineItem(row);
        expect(result.item_name).toBe('Product');
        expect(result.unit_price).toBe(0);
        expect(result.partner_name).toBe('Store');
    });
});
