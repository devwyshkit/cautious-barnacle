import type { Database } from '@/lib/supabase/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

/**
 * Review Types - Wyshkit 2026: Zero Data Mismatch
 */

// ✅ UI-optimized types for review operations
export type ItemReview = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export interface CreateReviewInput {
  product_id: string;
  rating: number;
  comment?: string;
  images?: string[];
}
