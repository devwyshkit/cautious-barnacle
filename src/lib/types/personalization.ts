import type { Views } from '@/lib/supabase/types';
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
 * DraftLineItem: Derived directly from DB v_active_cart_detailed view.
 * Eliminates manual type-drift and shadow data.
 */
export interface DraftLineItem extends Omit<Views<'v_active_cart_detailed'>, 'personalization' | 'selected_addons' | 'personalization_options' | 'quantity'> {
  // Overrides for more specific JSON typing
  personalization: SelectedPersonalization;
  selected_addons: SelectedAddon[];
  personalization_options: any[];
  quantity: number;

  // DB-backed fields (Shadow Math Elimination)
  line_total: number;
  personalization_fee: number;

  // UI-only computed extensions
  is_personalized: boolean;
  item_addons: any[];

  // Legacy mappings (Optional fallbacks)
  unit_price: number;
  addons_price?: number | null;
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
