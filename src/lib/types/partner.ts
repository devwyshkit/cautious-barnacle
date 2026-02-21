/**
 * Partner Types - Wyshkit 2026: Zero Data Mismatch
 * 
 * All types derive directly from Supabase database types.
 */

import type { Tables } from '@/lib/supabase/database.types';

// ✅ Use Supabase table type for partner data (zero data mismatch)
export type Partner = Tables<'partners'>;
// ✅ UI-optimized partner shape (Subset of table for performance & clarity)
export interface MappedPartner {
  id: string;
  name: string;
  image_url: string | null;
  rating: number | null;
  city: string | null;
  prep_hours: number | null;
  delivery_fee: number;
  slug: string | null;
  business_type: string | null;
  is_online: boolean;
  description: string | null;
  gstin?: string | null;
}

// ✅ Use Supabase table type for full partner data
export type PartnerFull = Tables<'partners'>;

// ✅ UI-only list item (subset of table)
export type PartnerListItem = Tables<'partners'>;
