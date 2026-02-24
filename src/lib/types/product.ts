/**
 * Product Types - Wyshkit 2026: Zero Data Mismatch
 * 
 * All types derive directly from Supabase database types.
 * UI-only types are kept for display transformations.
 * 
 * Hyperlocal Product Marketplace with Optional Personalization
 * (Like Apple engraving - this IS personalization, NOT customization)
 */

import type { Tables } from '@/lib/supabase/types';
import type { ItemWithFullSpec, Variant } from '@/lib/supabase/types';
import { ValidatedWyshkitItem } from '../validations/discovery';

export type { Product } from '@/lib/supabase/types';
export type ItemListItem = Tables<'products'> & {
  price?: number;
  image_url?: string;
  vendor_name?: string;
  vendors?: { id: string; name: string } | null;
  variants?: Array<{ id: string; name: string | null; price: number | null; stock_quantity: number | null }>;
  stock_quantity?: number;
  production_time_minutes?: number;
};



/**
 * WyshkitItem: The standard product shape for all discovery components.
 * Derives directly from Supabase 'products' table plus joins.
 */
export interface WyshkitItem extends Omit<Tables<'products'>, 'variants' | 'personalization_options' | 'video_url' | 'preview_time_minutes'> {
  // UI Computed & Joined fields
  price?: number; // Normalized price (base_price or variant price)
  image_url?: string | null;
  vendor_name?: string | null;
  distance_km?: number | null;
  distance_meters?: number | null;
  is_promoted: boolean | null;

  // Joins
  vendors?: {
    id: string;
    name: string;
    city?: string;
    rating?: number;
    image_url?: string;
  } | null;
  product_variants?: Array<Tables<'product_variants'> & { price: number | null; stock_quantity: number | null }>;

  // Aliases & Missing Fields (Shadow State Resolution)
  variants?: Array<Tables<'product_variants'> & { price: number | null; stock_quantity: number | null }>;
  personalization_options?: any;
  video_url?: string | null;
  preview_time_minutes?: number | null;
  return_eligible?: boolean;

  elite_signals?: ValidatedWyshkitItem['elite_signals'];
}

