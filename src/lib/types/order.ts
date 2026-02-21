/**
 * Order Types - Wyshkit 2026: Zero Data Mismatch
 * 
 * All types derive directly from Supabase database types.
 * UI-only types are kept for display transformations.
 * 
 * Hyperlocal Item Marketplace with Optional Personalization
 */

import type { Tables } from '@/lib/supabase/database.types';
import type { PersonalizationConfig, SelectedPersonalization, SelectedAddon } from './personalization';

// View type from Supabase
export type ViewOrderDetailed = Tables<'v_orders_detailed'>;

export type OrderItem = Tables<'order_items'>;
export type OrderPersonalization = Tables<'order_personalization'>;

/**
 * OrderListItem: Unified shape for order lists.
 * Derives directly from v_orders_detailed view.
 */
export interface OrderListItem extends ViewOrderDetailed {
  // Computed/UI-only fields that might not be in the view but are needed for legacy UI
  // We keep them as optional while we transition to full snake_case
  item_count?: number;
  first_item_image?: string | null;
  first_item_name?: string | null;

  // Deprecated: Remove these once components are updated to snake_case
  /** @deprecated use order_number */
  orderNumber?: string | null;
  /** @deprecated use created_at */
  createdAt?: string | null;
  /** @deprecated use partner_name */
  partnerName?: string | null;
  /** @deprecated use itemCount */
  itemCount?: number;
  /** @deprecated use first_item_image */
  firstItemImage?: string | null;
  /** @deprecated use first_item_name */
  firstItemName?: string | null;
  /** @deprecated use has_personalization */
  hasPersonalization?: boolean;
  /** @deprecated use personalization_status */
  personalizationStatus?: string | null;
}

export interface OrderForPDF {
  orderNumber: string;
  createdAt: string;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  total: number;
  partners: {
    name: string;
    gstin?: string;
  };
  orderItems: Array<{
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export interface PartnerForPDF {
  name: string;
  gstin?: string;
  businessType?: string;
  panNumber?: string;
}

export interface PreviewSubmission {
  id: string;
  orderId: string;
  previewUrl: string;
  version: number;
  status: 'pending' | 'approved' | 'change_requested';
  partnerNotes?: string;
  customerFeedback?: string;
  submittedAt: string;
}

export interface OrderItemDetail {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  personalizationConfig?: unknown;
  imageUrl?: string;

  // Swiggy 2026: Snake-case standardized fields
  item_id: string;
  item_name: string;
  quantity_number: number;
  unit_price: number;
  total_price: number;
  is_personalized: boolean;
  status: string;
  personalization_config?: PersonalizationConfig;
  personalization_details?: SelectedPersonalization;
  selected_addons?: SelectedAddon[];

  /** @deprecated use item_name */
  itemName?: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface OrderDetail extends Omit<ViewOrderDetailed, 'delivery_address'> {
  // Financials - snake_case preferred, keep camelCase as deprecated while moving
  subtotal?: number;
  personalization_charges?: number;
  delivery_fee?: number;
  platform_fee?: number;
  gst?: number;
  discount?: number;

  /** @deprecated use personalization_charges */
  personalizationCharges?: number;
  /** @deprecated use delivery_fee */
  deliveryFee?: number;
  /** @deprecated use platform_fee */
  platformFee?: number;

  has_personalization: boolean | null;
  /** @deprecated use has_personalization */
  hasPersonalization: boolean | null;

  personalization_input: Record<string, unknown> | null;
  /** @deprecated use personalization_input */
  personalizationInput?: Record<string, unknown> | null;

  personalization_status: string | null;
  /** @deprecated use personalization_status */
  personalizationStatus?: string | null;

  placed_at: string | null;
  /** @deprecated use placed_at */
  placedAt?: string | null;

  paid_at: string | null;
  /** @deprecated use paid_at */
  paidAt?: string | null;

  details_submitted_at?: string | null;
  approved_at?: string | null;

  preview_submissions?: PreviewSubmission[];
  /** @deprecated use preview_submissions */
  previewSubmissions?: PreviewSubmission[];

  personalizations?: OrderPersonalization[];

  order_items?: OrderItemDetail[];
  /** @deprecated use order_items */
  orderItems?: OrderItemDetail[];

  order_status_history?: OrderStatusHistory[];
  /** @deprecated use order_status_history */
  orderStatusHistory?: OrderStatusHistory[];

  partners?: {
    name?: string;
    gstin?: string;
    business_type?: string;
    pan_number?: string;
    /** @deprecated use business_type */
    businessType?: string;
    /** @deprecated use pan_number */
    panNumber?: string;
  };
  users?: {
    full_name?: string;
    email?: string;
    /** @deprecated use full_name */
    fullName?: string;
  };
  delivery_address?: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    pincode?: string;
    country?: string;
    name?: string;
    phone?: string;
    /** @deprecated use address_line1 */
    addressLine1?: string;
  } | null;
}
