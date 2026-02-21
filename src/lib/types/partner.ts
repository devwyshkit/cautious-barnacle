/**
 * Partner Types - Wyshkit 2026: Zero Data Mismatch
 * 
 * All types derive directly from Supabase database types.
 */

import { ValidatedPartner } from '../validations/discovery';

export type { Partner } from '@/lib/supabase/types';
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
  elite_signals?: ValidatedPartner['elite_signals'];
}

