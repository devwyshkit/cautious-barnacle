import { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export type Vendor = Tables<'vendors'>;
export type Product = Tables<'products'>;
export type Order = Tables<'orders'>;
export type User = Tables<'users'>;
export type Address = Tables<'user_addresses'>;
export type Variant = Tables<'product_variants'>;
export type OrderItem = Tables<'order_products'>;
export type OrderPersonalization = OrderItem['personalization_details'];
export type Return = Tables<'returns'>;
export type UserRole = Tables<'user_roles'>;

// WYSHKIT 2026: Order Status Canonical (DB-Driven)
export type OrderStatus = Enums<'order_status'>;

/**
 * Legacy Status Mapper (Safe Landing)
 * Maps deprecated statuses from old system to the new 8-state FSM.
 */
export const mapLegacyStatus = (status: string): OrderStatus => {
    const map: Record<string, OrderStatus> = {
        'READY': 'PACKED',
        'SHIPPED': 'OUT_FOR_DELIVERY',
        'OUT_FOR_DELIVERY': 'OUT_FOR_DELIVERY',
    };
    return (map[status] || status) as OrderStatus;
};


// WYSHKIT 2026: Composite Types for Joins (Single Source of Truth)
// Use these instead of `as any` when querying with joins

export type OrderWithItems = Order & {
    order_products: (OrderItem & {
        personalization_details: any;
    })[];
    vendors: Pick<Vendor, 'name' | 'image_url'> | null;
};

// For `getOrderWithHistory` return type
export interface OrderDetails extends Order {
    order_products: OrderItem[];
    vendors?: {
        name: string;
        image_url: string | null;
    } | null;

    // Computed/Mapped properties for frontend
    vendor_name: string | null;
    partner_image?: string | null;
}

export type ItemWithPartner = Product & {
    vendors: Pick<Vendor, 'id' | 'name' | 'slug' | 'image_url'> | null;
};

export type ItemListing = Pick<Product, 'id' | 'name' | 'slug' | 'base_price' | 'images' | 'rating' | 'total_ratings' | 'category' | 'has_personalization' | 'is_perishable' | 'delivery_time_min' | 'delivery_time_max'> & {
    vendors: Pick<Vendor, 'id' | 'name' | 'slug' | 'city' | 'is_online' | 'is_active'> | null;
};

export type ItemWithFullSpec = Product & {
    vendors: Pick<Vendor, 'id' | 'name' | 'slug' | 'city' | 'rating' | 'image_url' | 'fssai_license' | 'gstin' | 'is_active'> | null;
    product_variants: Variant[];
};
