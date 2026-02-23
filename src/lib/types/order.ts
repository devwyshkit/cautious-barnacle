/**
 * Order Types - Wyshkit 2026: Zero Data Mismatch
 * 
 * All types derive directly from Supabase database types.
 * UI-only types are kept for display transformations.
 * 
 * Hyperlocal Item Marketplace with Optional Personalization
 */

import type { Tables, Views } from '@/lib/supabase/types';
import type { PersonalizationConfig, SelectedPersonalization, SelectedAddon } from './personalization';

// View type from Supabase
export type ViewOrderDetailed = Views<'v_orders_detailed'>;

import type { Order, OrderItem, OrderPersonalization } from '@/lib/supabase/types';
export type { OrderItem, OrderPersonalization };

/**
 * OrderListItem: Unified shape for order lists.
 * Derives directly from v_orders_detailed view.
 */
export interface OrderListItem extends ViewOrderDetailed {
  // Computed/UI-only fields that might not be in the view but are needed for legacy UI
  item_count?: number;
  first_item_image?: string | null;
  first_item_name?: string | null;
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
  partner: {
    name: string;
    gstin?: string;
  };
  order_items: Array<{
    item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

export interface PartnerForPDF {
  name: string;
  gstin?: string;
  business_type?: string;
  pan_number?: string;
}

export interface PreviewSubmission {
  id: string;
  order_id: string;
  order_item_id: string;
  preview_url: string;
  status: 'pending' | 'approved' | 'change_requested';
  partner_notes?: string;
  customer_feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface OrderItemDetail {
  id: string;
  item_id: string;
  item_name: string;
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

export interface OrderDetail extends Order {
  preview_submissions?: PreviewSubmission[];
  personalizations?: OrderPersonalization[];
  order_items?: OrderItemDetail[];
  order_status_history?: OrderStatusHistory[];

  // Composite/Joins
  partners?: Pick<Tables<'partners'>, 'name' | 'image_url'> | null;
  users?: Pick<Tables<'users'>, 'full_name' | 'email'> | null;

  // Mapped for UI Convenience (snake_case)
  partner_name: string | null;
  partner_image: string | null;
}
