import type { PricingBreakdown } from '@/lib/types/pricing';


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

/**
 * DraftLineItem: Maps directly to output columns from v_active_cart_detailed view.
 * Eliminates manual type-drift and shadow data.
 * NOTE: We no longer extend the view type directly to avoid optional/non-optional conflicts.
 */
export interface DraftLineItem {
  // Cart item identity
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;

  // Session routing
  user_id?: string | null;
  session_id?: string | null;

  // DB product fields
  unit_price: number;
  quantity: number;
  line_total: number;
  personalization_fee?: number | null;
  has_personalization?: boolean | null;
  is_personalized: boolean;

  // Variants
  variant_id?: string | null;
  variant_name?: string | null;

  // Typed JSON overrides
  personalization?: SelectedPersonalization;
  selected_addons: SelectedAddon[];

  // Vendor context (DB-aligned v_active_cart_detailed column names)
  vendor_id?: string | null;
  vendor_name?: string | null;
  vendor_city?: string | null;
  vendor_prep_mins?: number | null;

  // UI-only computed extensions
  item_addons: any[];
  addons_price?: number | null;
  base_price?: number;
  variant_price?: number | null;
  product_addons?: any;
  personalization_options?: any[];
}


export interface DraftTransaction extends PricingBreakdown {
  products: DraftLineItem[];
  vendor_id: string | null;
  item_count: number;
  // Session fields
  applied_coupon?: string | null;
  use_wallet?: boolean;
  selected_address_id?: string | null;
  gstin?: string | null;
}
