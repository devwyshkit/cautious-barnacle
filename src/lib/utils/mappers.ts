import { DBPartner, DBItem, ItemWithPartner, Tables } from '@/lib/supabase/types';
import { MappedPartner } from '@/lib/types/partner';
import { WyshkitItem } from '@/lib/types/item';

/**
 * WYSHKIT 2026: Unified Mapping Hub
 * 
 * Ensures consistent data structures between Supabase and the Frontend.
 * Adheres to DRY and KISS by eliminating fragmented mapping in server actions.
 */

export interface TrendingItemView {
    id: string;
    name: string;
    basePrice: number | null;
    images: string[] | null;
    partnerId: string | null;
    businessName: string | null;
}

export function mapPartner(p: any): MappedPartner {
    return {
        id: p.id,
        name: p.display_name || p.name || 'Local Store',
        imageUrl: p.image_url || p.logo_url || '/images/logo.png',
        rating: p.rating || 0,
        city: p.city,
        // WYSHKIT 2026: Hyperlocal first. Defaulting to 45 mins (0.75h) prep.
        prepHours: p.prep_hours || p.prepHours || 0.75,
        deliveryFee: p.delivery_fee || p.deliveryFee || 40,
        slug: p.slug,
        businessType: p.business_type || 'Store',
        isOnline: p.is_online ?? true,
        description: p.description,
    };
}

export function mapWyshkitItem(item: any): any {
    // Guard for RPC/View results (get_nearby_items / v_trending_items)
    if (('item_id' in item || 'itemId' in item || 'basePrice' in item)) {
        return {
            id: item.item_id || item.itemId || item.id,
            name: item.item_name || item.itemName || item.name || 'Product',
            base_price: item.base_price || item.basePrice || 0,
            mrp: item.mrp || 0,
            images: item.images || [],
            partner_id: item.partner_id || item.partnerId,
            partner_name: item.partner_name || item.partnerName || item.businessName || 'Local Store',
            rating: item.rating || 0,
            is_online: item.is_online ?? true,
            has_personalization: item.has_personalization || false,
            stock_status: item.stock_status || 'in_stock',
            stock_quantity: item.stock_quantity ?? 99,
            distance_km: item.distance_km,
        };
    }

    // DB Item Type (SnakeCase from Tables)
    return {
        id: item.id,
        name: item.name || 'Product',
        base_price: item.base_price || 0,
        mrp: item.mrp || 0,
        images: item.images || [],
        partner_id: item.partner_id || (item.partners?.id),
        partner_name: item.partners?.display_name || item.partners?.name || 'Local Store',
        rating: item.rating || 0,
        is_online: item.is_online ?? true,
        has_personalization: item.has_personalization || false,
        stock_status: item.stock_status || 'in_stock',
        stock_quantity: item.stock_quantity ?? 99,
        production_time_minutes: item.production_time_minutes || 45,
    };
}
