import { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export type Partner = Tables<'partners'>;
export type Item = Tables<'items'>;
export type Order = Tables<'orders'>;
export type User = Tables<'users'>;
export type Address = Tables<'addresses'>;
export type Variant = Tables<'variants'>;
export type OrderItem = Tables<'order_items'>;
export type OrderPersonalization = Tables<'order_personalization'>;


// WYSHKIT 2026: Composite Types for Joins (Single Source of Truth)
// Use these instead of `as any` when querying with joins

export type OrderWithItems = Order & {
    order_items: OrderItem[];
    partners: Pick<Partner, 'name' | 'image_url'> | null;
};

// For `getOrderWithHistory` return type
export interface OrderDetails extends Order {
    order_items: OrderItem[];
    partners?: {
        name: string;
        image_url: string | null;
    } | null;

    // Computed/Mapped properties for frontend
    partner_name: string | null;
    partner_image?: string | null;
}

export type ItemWithPartner = Item & {
    partners: Pick<Partner, 'id' | 'name' | 'slug' | 'image_url'> | null;
};

export type ItemListing = Views<'v_item_listings_search'>;

export type ItemWithFullSpec = Item & {
    partners: Pick<Partner, 'id' | 'name' | 'slug' | 'city' | 'rating' | 'image_url' | 'fssai_license' | 'gstin'> | null;
    variants: Variant[];
};
