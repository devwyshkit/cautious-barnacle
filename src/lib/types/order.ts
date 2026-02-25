/**
 * Order Types - Wyshkit 2026: Zero Data Mismatch
 * 
 * All types derive directly from Supabase database types.
 * UI-only types are kept for display transformations.
 * 
 * Hyperlocal Product Marketplace with Optional Personalization
 */

import type { Tables, Views } from '@/lib/supabase/types';
import type { PersonalizationConfig, SelectedPersonalization, SelectedAddon } from './personalization';

// View type from Supabase
export type ViewOrderDetailed = Views<'v_order_tracking'>;

/**
 * OrderListItem: Unified shape for order lists.
 * Derives directly from v_order_tracking view.
 */
export interface OrderListItem extends Omit<Views<'v_order_tracking'>, 'personalization_status' | 'first_product_name' | 'vendor_name'> {
  // Any extra UI fields NOT in the view can be added here
  // But for WYSHKIT 2026, we prefer view-authority
  products?: any[]; // Keep for compatibility if needed, though view uses first_product_name
  personalization_status?: string | null; // Placeholder if needed
  item_count?: number;
  first_product_name?: string | null;
  vendor_name?: string | null;
}

export interface OrderForPDF {
  order_number: string;
  created_at: string;
  subtotal: number;
  delivery_fee: number;
  platform_fee: number;
  gst: number;
  personalization_charges: number;
  discount: number;
  total: number;
  vendor: {
    name: string;
    gstin?: string;
  };
  order_products: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

export interface VendorForPDF {
  name: string;
  gstin?: string;
  business_type?: string;
  pan_number?: string;
}

export interface PreviewSubmission {
  id: string;
  order_id: string;
  order_product_id: string;
  preview_url: string;
  status: 'pending' | 'approved' | 'change_requested';
  vendor_notes?: string;
  customer_feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface OrderItemDetail {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  quantity_number: number;
  unit_price: number;
  total_price: number;
  is_personalized: boolean;
  status: string;
  personalization_config?: any;
  personalization_details?: any;
  selected_addons?: any[];

}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface OrderDetail extends Tables<'orders'> {
  order_personalization?: PreviewSubmission[];
  personalizations?: any[];
  order_products?: OrderItemDetail[];
  status_history?: Record<string, any>[] | null;

  // Composite/Joins
  vendors?: Pick<Tables<'vendors'>, 'name' | 'image_url'> | null;
  users?: Pick<Tables<'users'>, 'full_name' | 'email'> | null;

  // Mapped for UI Convenience (snake_case)
  vendor_name: string | null;
  vendor_image: string | null;
  personalization_status?: string | null;
  gst?: number | null;
}
