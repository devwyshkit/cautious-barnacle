/**
 * Product Types - Wyshkit 2026: Zero Data Mismatch
 * 
 * All types derive directly from Supabase database types.
 * UI-only types are kept for display transformations.
 * 
 * Hyperlocal Product Marketplace with Optional Personalization
 * (Like Apple engraving - this IS personalization, NOT personalizing)
 */

import type { Tables } from '@/lib/supabase/types';
import { ValidatedWyshkitProduct } from '../validations/discovery';

export type { Product } from '@/lib/supabase/types';
export type ProductSummary = Tables<'products'> & {
  price?: number;
  image_url?: string;
  vendor_name?: string;
  vendors?: { id: string; name: string } | null;
  variants?: Array<{ id: string; name: string | null; price: number | null; stock_quantity: number | null }>;
  stock_quantity?: number;
  production_time_minutes?: number;
};



/**
 * WyshkitProduct: The standard product shape for all discovery components.
 * Derives directly from Supabase 'products' table plus joins.
 */
export interface WyshkitProduct extends Omit<Tables<'products'>, 'variants' | 'personalization_options' | 'video_url' | 'preview_time_minutes'> {
  // UI Computed & Joined fields
  price?: number; // Normalized price (base_price or variant price)
  image_url?: string;
  vendor_name?: string;
  vendor_slug?: string;
  category_name?: string;
  category_slug?: string;
  distance_km?: number | null;
  distance_meters?: number | null;
  is_promoted: boolean | null;
  vendor_prep_time?: number;

  // Joins
  vendors?: {
    id: string;
    name: string;
    slug: string;
    city?: string;
    rating?: number;
    image_url?: string;
    is_active?: boolean;
  } | null;
  product_variants?: Array<Tables<'product_variants'> & { price: number | null; stock_quantity: number | null }>;

  // Aliases & Missing Fields (Shadow State Resolution)
  variants?: Array<Tables<'product_variants'> & { price: number | null; stock_quantity: number | null }>;
  personalization_options: any;
  video_url: string | null;
  preview_time_minutes: number | null;
  return_eligible?: boolean;

  elite_signals?: ValidatedWyshkitProduct['elite_signals'];
}

