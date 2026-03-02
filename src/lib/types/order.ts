/**
 * Order Types - Wyshkit 2026: Zero Data Mismatch
 * 
 * All types derive directly from Supabase database types.
 * UI-authority is the v_order_detail view.
 */

import type { Tables, Views } from '@/lib/supabase/database.types';

// WYSHKIT 2026: V_ORDER_DETAIL is the "God-Level" single-trip source.
export type OrderDetail = Views<'v_order_detail'>;

export interface OrderProductListItem extends Omit<Views<'v_order_tracking'>, 'personalization_status' | 'first_product_name' | 'vendor_name'> {
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
  personalization_details?: any;
  final_approved_mockup_url?: string | null;
}

export interface PreviewSubmission {
  id: string;
  order_product_id: string;
  preview_url: string;
  status: string;
  submitted_at: string;
}

