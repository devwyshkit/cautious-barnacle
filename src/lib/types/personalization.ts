/**
 * Personalization Types - Wyshkit 2026
 * 
 * Hyperlocal Item Marketplace with Optional Personalization
 * Like Apple engraving - this IS personalization, NOT customization (we don't customize items, we personalize them)
 * 
 * This file contains ONLY personalization-related types.
 * Draft transaction types are in @/surfaces-customer/transaction/types.ts
 */

export interface PersonalizationConfig {
  allow_text?: boolean;
  text_required?: boolean;
  text_label?: string;
  char_limit?: number;
  placeholder?: string;
  allow_image?: boolean;
  image_required?: boolean;
  instructions?: string;
}

export interface SelectedPersonalization {
  enabled: boolean;
  option_id?: string;
  text?: string;
  file_url?: string;
  instructions?: string;
  price?: number;
}

export interface SelectedAddon {
  id: string;
  name: string;
  price: number;
  requires_preview?: boolean;
}

import type { PersonalizationOption, ItemAddon } from '@/lib/supabase/types';

export interface DraftLineItem {
  id: string;
  item_id: string;
  item_name: string;
  item_image?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_variant_id: string | null;
  personalization?: SelectedPersonalization;
  selected_addons?: SelectedAddon[];
  partner_name?: string;
  partner_id?: string | null;
  partner_latitude?: number | null;
  partner_longitude?: number | null;
  // WYSHKIT 2026: Hydration fields for Checkout
  base_price?: number | null;
  variant_price?: number | null;
  variant_name?: string;
  personalization_price?: number | null;
  addons_price?: number | null;
  partner_city?: string | null;
  partner_prep_hours?: number | null;
  // WYSHKIT 2026: Metadata for hasItemPersonalization and IdentityForm
  personalization_options?: PersonalizationOption[];
  item_addons?: ItemAddon[];
  is_personalized?: boolean;
  personalization_details?: SelectedPersonalization | null;
}

export interface DraftTransaction {
  items: DraftLineItem[];
  partner_id: string | null;
  // Financials - Standardized snake_case
  subtotal: number;
  personalization_charges: number;
  delivery_fee: number;
  platform_fee: number;
  gst: number;
  discount: number;
  wallet_discount: number;
  total: number;
  item_count: number;
}
