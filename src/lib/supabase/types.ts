import { Database } from './database.types';

// WYSHKIT 2026: Strict Type Definitions (Zero Shadow Types)
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type View<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Canonical Discovery Types
export type ProductResult = Database['public']['Functions']['search_products_atomic']['Returns'][0];

export type Product = Tables<'products'>;
export type Vendor = Tables<'vendors'>;
export type Category = Tables<'categories'>;
export type Order = Tables<'orders'>;
export type OrderProduct = Tables<'order_products'>;
export type Address = Tables<'user_addresses'>;
export type OrderDetails = View<'v_order_detail'>;
export type OrderWithProducts = Order & {
    order_products: OrderProduct[];
    user_addresses: Address | null;
};

export type { Database };
