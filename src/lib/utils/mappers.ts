/**
 * Swiggy 2026: Shared Mappers
 * 
 * Centralizing complex transformations to avoid duplication and data mismatch.
 * Zero Reinvention: Maps directly from Supabase raw rows to purified UI types.
 */

import { DraftLineItem, SelectedPersonalization, SelectedAddon } from "@/lib/types/personalization";

export interface CartItemRawRow {
    id: string | null;
    item_id: string | null;
    quantity: number | null;
    selected_variant_id: string | null;
    personalization: any | null;
    selected_addons: any | null;
    // Fields from v_active_cart_detailed flat view
    item_name: string | null;
    item_image: string | null;
    base_price: number | null;
    personalization_options: any | null;
    item_is_active: boolean | null;
    variant_name: string | null;
    variant_price: number | null;
    partner_id: string | null;
    partner_name: string | null;
    partner_city: string | null;
    partner_latitude: number | null;
    partner_longitude: number | null;
    partner_prep_hours: number | null;
}

export function mapRawToDraftLineItem(row: CartItemRawRow): DraftLineItem {
    const item_base_price = Number(row.base_price || 0);
    const variant_price = row.variant_price != null ? Number(row.variant_price) : null;
    const unit_price = variant_price !== null ? variant_price : item_base_price;
    const quantity = Number(row.quantity) || 1;

    const selected_addons = (row.selected_addons as unknown as SelectedAddon[]) || [];
    const addons_price = selected_addons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);

    const personalization = (row.personalization as unknown as SelectedPersonalization) || { enabled: false };
    const personalization_price = (personalization?.price || 0);

    return {
        id: row.id || '',
        item_id: row.item_id || '',
        item_name: row.item_name || 'Product',
        item_image: row.item_image || '/images/logo.png',
        quantity: quantity,
        unit_price: unit_price,
        total_price: (unit_price + addons_price + personalization_price) * quantity,
        selected_variant_id: row.selected_variant_id,
        personalization: personalization,
        selected_addons: selected_addons,
        partner_name: row.partner_name || 'Store',
        partner_id: row.partner_id || '',
        partner_latitude: row.partner_latitude,
        partner_longitude: row.partner_longitude,
        partner_city: row.partner_city || null,
        partner_prep_hours: Number(row.partner_prep_hours) || null,
        base_price: item_base_price,
        variant_price: variant_price,
        variant_name: row.variant_name || undefined,
        personalization_price: personalization_price,
        addons_price: addons_price,
        is_personalized: !!personalization?.enabled,
        personalization_details: personalization?.enabled ? personalization : null,
        personalization_options: row.personalization_options || [],
        item_addons: [], // v_active_cart_detailed doesn't include item_addons for now
    };
}
