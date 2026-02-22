import type { PersonalizationOption, ItemAddon } from '@/lib/supabase/types';
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
  personalization_details?: any; // Generic JSONB from DB

}

export interface DraftTransaction extends PricingBreakdown {
  items: DraftLineItem[];
  partner_id: string | null;
  item_count: number;
  // Session fields
  applied_coupon?: string | null;
  use_wallet?: boolean;
  selected_address_id?: string | null;
  gstin?: string | null;
}
