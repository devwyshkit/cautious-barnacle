/**
 * Order Types - Wyshkit 2026: Zero Data Mismatch
 * 
 * All types derive directly from Supabase database types.
 * UI-authority is the v_order_detail view.
 */

import type { Database } from '@/lib/supabase/database.types';

type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type Views<T extends keyof PublicSchema['Views']> = PublicSchema['Views'][T]['Row'];

// WYSHKIT 2026: V_ORDER_DETAIL is the "God-Level" single-trip source.
// We cast Json fields to their specific interfaces for UI safety.
export interface OrderDetail extends Omit<Views<'v_order_detail'>, 'order_products' | 'previews' | 'timeline' | 'status' | 'change_request_count' | 'awb_number' | 'courier_vendor' | 'tracking_url' | 'max_change_requests' | 'personalization_status'> {
  order_products: OrderProductDetail[] | null;
  previews: PreviewSubmission[] | null;
  timeline: OrderStatusHistory[] | null;
  status: string | null;

  // Tracking & Status extensions (ensure these are synced in the View)
  personalization_status?: string | null;
  awb_number?: string | null;
  courier_vendor?: string | null;
  tracking_url?: string | null;
  max_change_requests?: number | null;
  change_request_count?: number | null;

  // WYSHKIT 2026: Live Pulse Coordinates
  vendor_lat?: number | null;
  vendor_lng?: number | null;
  rider_lat?: number | null;
  rider_lng?: number | null;
}

export interface OrderProductSummary extends Omit<Views<'v_order_tracking'>, 'personalization_status' | 'first_product_name' | 'vendor_name'> {
  products?: any[];
  personalization_status?: string | null;
  product_count: number | null;
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

export interface OrderStatusHistory {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface OrderProductDetail {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_personalized: boolean;
  status: string;
  personalization_status?: string | null;
  personalization_details?: any;
  product_image_url?: string | null;
  final_approved_mockup_url?: string | null;
  selected_variant_options?: any;
}

export interface PreviewSubmission {
  id: string;
  order_product_id: string;
  preview_url: string;
  status: string;
  vendor_notes?: string | null;
  submitted_at: string;
}
export interface OrderProductListItem extends Views<'v_order_tracking'> {
  personalization_status?: string | null;
}
