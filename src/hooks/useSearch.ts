'use client';

import { useState, useEffect } from 'react';
import { searchFiltered } from '@/lib/actions/discovery/search';
import { ValidatedWyshkitProduct, ValidatedVendor } from '@/lib/validations/discovery';

interface SearchParams {
  q?: string;
  type?: string;
  category?: string;
  city?: string;
  limit?: number;
  offset?: number;
}

interface SearchResults {
  products: ValidatedWyshkitProduct[];
  vendors: ValidatedVendor[];
  total: number;
}

/**
 * useSearch Hook - Wyshkit 2026
 * 
 * Hyperlocal Product Marketplace Search
 * Supabase real-time subscriptions handle real-time data updates.
 */
export function useSearch(params: SearchParams) {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isEnabled = !!(params.q && params.q.length >= 2) || !!params.category || params.type === 'trending';

  useEffect(() => {
    if (!isEnabled) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    let timeoutId: NodeJS.Timeout;

    async function fetchSearch() {
      setIsLoading(true);
      setError(null);

      try {
        // WYSHKIT 2026: Use Server Action instead of API route (WyshKit Pattern)
        const result = await searchFiltered({
          q: params.q,
          category: params.category,
          limit: params.limit || 20,
        });

        if (!cancelled) {
          setResults({
            products: (result.products || []) as any[],
            vendors: (result.vendors || []) as any[],
            total: result.total || (result.products?.length || 0) + (result.vendors?.length || 0),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Search failed'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    // WYSHKIT 2026: Debounce search to prevent server thrashing
    timeoutId = setTimeout(() => {
      fetchSearch();
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [params.q, params.type, params.category, params.city, params.limit, params.offset, isEnabled]);

  return {
    data: results,
    isLoading,
    error,
  };
}
