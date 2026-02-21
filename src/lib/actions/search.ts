import { createClient } from '@/lib/supabase/server';
import type { Item, Partner } from '@/lib/supabase/types';

interface SearchOptions {
  q?: string;
  category?: string;
  limit?: number;
}

/**
 * WYSHKIT 2026: Server-First Search (Swiggy Pattern)
 * Data comes to user - fetched server-side, streamed to client
 */
export async function searchFiltered(options: SearchOptions = {}) {
  const supabase = await createClient();
  const { q, category, limit = 20 } = options;

  // WYSHKIT 2026: Use purified view (Zero Reinvention)
  let itemsQuery = supabase
    .from('v_item_listings_search')
    .select('*')
    .limit(limit);

  // WYSHKIT 2026: Use Postgres Full-Text Search (FTS) for superior ranking
  if (q && q.length >= 2) {
    itemsQuery = itemsQuery.textSearch('fts_vector', q, {
      type: 'websearch',
      config: 'english'
    });
  }

  // Apply category filter (Case-insensitive)
  if (category) {
    itemsQuery = itemsQuery.ilike('category', category);
  }

  // Build partners query
  let partnersQuery = supabase
    .from('v_partner_listings')
    .select('*')
    .limit(Math.floor(limit / 2));

  // WYSHKIT 2026: Use FTS for Partner search too
  if (q && q.length >= 2) {
    // Note: v_partner_listings doesn't have fts_vector yet, fallback to ilike on name
    // or we could add FTS to v_partner_listings later. For now, keep it simple.
    partnersQuery = partnersQuery.ilike('name', `%${q}%`);
  }

  // WYSHKIT 2026: Parallel fetch (zero waterfall)
  const [itemsResponse, partnersResponse] = await Promise.all([
    itemsQuery,
    partnersQuery
  ]);

  return {
    items: (itemsResponse.data || []).map((item) => ({
      ...item,
      image: item.images?.[0] || '/images/logo.png',
      // Purified: items already have partner_name from view
    })),
    partners: (partnersResponse.data || []).map((p) => ({
      ...p,
      image: p.image_url || '/images/logo.png'
    })),
    total: (itemsResponse.data?.length || 0) + (partnersResponse.data?.length || 0)
  };
}
