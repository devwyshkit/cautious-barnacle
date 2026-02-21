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
export type OrderStatusHistory = Tables<'order_status_history'>;
export type PreviewSubmission = Tables<'preview_submissions'>;
export type OrderPersonalization = Tables<'order_personalization'>;
export type ItemAddon = Tables<'item_addons'>;
export type PersonalizationOption = Tables<'personalization_options'>;
export type ItemReview = Tables<'item_reviews'>;


// WYSHKIT 2026: Composite Types for Joins (Single Source of Truth)
// Use these instead of `as any` when querying with joins

export type OrderWithItems = Order & {
    order_items: OrderItem[];
    partners: Pick<Partner, 'name' | 'image_url'> | null;
};

export type OrderWithRelations = Order & {
    order_items: OrderItem[];
    order_status_history: OrderStatusHistory[];
    partners: Pick<Partner, 'name' | 'image_url'> | null;
    preview_submissions?: PreviewSubmission[];
};

// For `getOrderWithHistory` return type
export interface OrderDetails extends Order {
    order_items: OrderItem[];
    order_status_history: OrderStatusHistory[];
    partners?: {
        name: string;
        image_url: string | null;
    } | null;
    preview_submissions?: PreviewSubmission[];

    // Computed/Mapped properties for frontend
    partner_name: string | null;
    partner_image?: string | null;
}

export type ItemWithPartner = Item & {
    partners: Pick<Partner, 'id' | 'name' | 'slug' | 'display_name' | 'image_url'> | null;
};

export type ItemListing = Views<'v_item_listings'>;

export type ItemWithFullSpec = Item & {
    partners: Pick<Partner, 'id' | 'name' | 'slug' | 'city' | 'rating' | 'display_name' | 'image_url' | 'fssai_license' | 'gstin'> | null;
    variants: Variant[];
    item_addons: ItemAddon[];
    personalization_options: PersonalizationOption[];
};
