/**
 * Item Types - Wyshkit 2026: Zero Data Mismatch
 * 
 * All types derive directly from Supabase database types.
 * UI-only types are kept for display transformations.
 * 
 * Hyperlocal Item Marketplace with Optional Personalization
 * (Like Apple engraving - this IS personalization, NOT customization)
 */

import type { Tables } from '@/lib/supabase/database.types';
import type { ItemWithFullSpec, PersonalizationOption as DBPersonalizationOption, Variant, ItemAddon } from '@/lib/supabase/types';
import { ValidatedWyshkitItem } from '../validations/discovery';

export type { Item } from '@/lib/supabase/types';
export type ItemListItem = Tables<'items'> & {
  price?: number;
  image_url?: string;
  partner_name?: string;
  partners?: { id: string; name: string } | null;
  variants?: Array<{ id: string; name: string | null; price: number | null; stock_quantity: number | null }>;
  stock_quantity?: number;
  production_time_minutes?: number;
};



/**
 * WyshkitItem: The standard item shape for all discovery components.
 * Derives directly from Supabase 'items' table plus joins.
 */
export interface WyshkitItem extends Omit<Tables<'items'>, 'personalization_options' | 'variants'> {
  // UI Computed & Joined fields
  price?: number; // Normalized price (base_price or variant price)
  image_url?: string | null;
  partner_name?: string | null;
  distance_km?: number | null;
  distance_meters?: number | null;
  is_promoted: boolean | null;

  // Joins
  partners?: {
    id: string;
    name: string;
    city?: string;
    rating?: number;
    image_url?: string;
  } | null;
  variants?: Array<Tables<'variants'> & { price: number | null; stock_quantity: number | null }>;
  item_addons?: Tables<'item_addons'>[];
  personalization_options?: Tables<'personalization_options'>[];
  elite_signals?: ValidatedWyshkitItem['elite_signals'];
}

// Re-export from Supabase Types for consistency
export type { PersonalizationOption } from '@/lib/supabase/types';

