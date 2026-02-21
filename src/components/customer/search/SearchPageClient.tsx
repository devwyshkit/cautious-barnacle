'use client';

import { useState, useEffect, useRef, useMemo, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from 'next/image';
import { Search, X, Loader2, ArrowLeft, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchFiltered } from "@/lib/actions/search";
import type { Tables } from "@/lib/supabase/database.types";
import { logger } from '@/lib/logging/logger';
import { PartnerCard } from "@/components/customer/PartnerCard";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ItemDetailView } from "@/components/customer/item/ItemDetailView";
import Link from 'next/link';

interface SearchPageClientProps {
  searchParams: Promise<{ q?: string; category?: string }>;
  initialResults?: {
    items: any[];
    partners: any[];
    total: number;
  };
}

/**
 * WYSHKIT 2026: Intent-Based Search Page Client Component
 * Swiggy 2026 Pattern: "Data Should Come to User, Not User Go to Data"
 * - Receives initialResults from Server Component (data comes to user)
 * - Only fetches new data when query changes (debounced) - progressive enhancement
 * - No client-side waterfall on initial load
 */
export function SearchPageClient({ searchParams, initialResults }: SearchPageClientProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams(); // For real-time URL reading

  // WYSHKIT 2026: React 19 use() hook for Promise (requires Suspense boundary)
  const params = use(searchParams);
  const initialQuery = params.q || '';
  const initialCategory = params.category || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // WYSHKIT 2026: Use server-provided initial results (data comes to user)
  const [results, setResults] = useState<{
    items: any[];
    partners: any[];
  }>(() => ({
    items: initialResults?.items || [],
    partners: initialResults?.partners || [],
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // WYSHKIT 2026: Sync with URL params (for browser back/forward)
  useEffect(() => {
    const urlQ = urlSearchParams.get('q') || '';
    const urlCategory = urlSearchParams.get('category') || '';

    if (urlQ !== query) {
      setQuery(urlQ);
      setDebouncedQuery(urlQ);
    }
    if (urlCategory !== category) {
      setCategory(urlCategory);
    }
  }, [urlSearchParams, query, category]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // WYSHKIT 2026: Update URL when query/category changes (intent-based navigation)
  useEffect(() => {
    const urlQ = urlSearchParams.get('q') || '';
    const urlCategory = urlSearchParams.get('category') || '';

    if (debouncedQuery !== urlQ || category !== urlCategory) {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set('q', debouncedQuery);
      if (category) params.set('category', category);

      const url = params.toString() ? `/search?${params.toString()}` : '/search';
      router.replace(url, { scroll: false });
    }
  }, [debouncedQuery, category, router, urlSearchParams]);

  // WYSHKIT 2026: Only fetch new data when query changes (progressive enhancement)
  // Initial data comes from Server Component - no waterfall on first load
  useEffect(() => {
    const searchQuery = debouncedQuery.trim();
    const shouldSearch = (searchQuery.length >= 2 || category) &&
      (searchQuery !== initialQuery || category !== initialCategory);

    if (!shouldSearch) {
      // Use initial results if no new search
      if (initialResults) {
        setResults({
          items: initialResults.items,
          partners: initialResults.partners,
        });
      }
      return;
    }

    let cancelled = false;

    async function fetchNewResults() {
      setIsLoading(true);
      setError(null);

      try {
        const newResults = await searchFiltered({
          q: searchQuery.length >= 2 ? searchQuery : undefined,
          category: category || undefined,
          limit: 20,
        });

        if (!cancelled) {
          setResults({
            items: newResults.items,
            partners: newResults.partners,
          });
        }
      } catch (err) {
        if (!cancelled) {
          const error = err instanceof Error ? err : new Error('Search failed');
          logger.error('Search failed', error, { query: debouncedQuery, category });
          setError(error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchNewResults();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, category, initialQuery, initialCategory, initialResults]);

  const hasResults = results.items.length > 0 || results.partners.length > 0;
  const hasActiveFilters = debouncedQuery || category;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="size-9 rounded-lg shrink-0"
        >
          <ArrowLeft className="size-5 text-zinc-600" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search items, stores..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 bg-zinc-50 border-zinc-100 text-sm rounded-lg"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="size-4 text-zinc-400" />
            </button>
          )}
        </div>
      </div>

      {/* WYSHKIT 2026: Show active category filter */}
      {category && (
        <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-600">Category:</span>
            <span className="text-xs text-zinc-900 capitalize">{category}</span>
            <button
              onClick={() => {
                setCategory('');
                const params = new URLSearchParams();
                if (debouncedQuery) params.set('q', debouncedQuery);
                const url = params.toString() ? `/search?${params.toString()}` : '/search';
                router.replace(url, { scroll: false });
              }}
              className="ml-auto text-xs text-zinc-500 hover:text-zinc-900"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-zinc-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-zinc-500">Search failed. Please try again.</p>
          </div>
        ) : !hasActiveFilters ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="size-10 text-zinc-200 mb-4" />
            <p className="text-sm font-semibold text-zinc-400">Search for items or stores</p>
          </div>
        ) : !hasResults ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="size-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
              <Search className="size-8 text-zinc-200" />
            </div>
            <p className="text-sm font-black text-zinc-900 uppercase tracking-tight mb-2">No Results</p>
            <p className="text-xs font-medium text-zinc-500 max-w-[200px] mb-8 leading-relaxed">
              We couldn't find {debouncedQuery ? `"${debouncedQuery}"` : 'what you were looking for'}
              {category && ` in ${category}`}.
            </p>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="rounded-xl border-zinc-200 text-xs font-black uppercase tracking-widest px-8"
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* WYSHKIT 2026: Combined Search Context (One Vendor, One Card) */}
            {hasResults && (
              <div className="space-y-8">
                {/* 1. Direct Store Matches */}
                {results.partners.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 px-1">Top Stores</h3>
                    <div className="space-y-4">
                      {results.partners.map((partner) => (
                        <PartnerCard
                          key={partner.id as any}
                          id={partner.id as any}
                          name={(partner.name as any) || 'Store'}
                          city={(partner.city as any) || 'City'}
                          image_url={partner.image_url ?? '/images/logo.png'}
                          rating={partner.rating as any}
                          variant="row"
                          className="bg-zinc-50/50 p-2"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Item Groups by Vendor */}
                {results.items.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 px-1">Items from Stores</h3>
                    <div className="space-y-6">
                      {Object.entries(
                        results.items.reduce((acc: Record<string, { partnerName: string, items: any[] }>, item: any) => {
                          const pId = item.partner_id || 'unknown';
                          if (!acc[pId]) acc[pId] = { partnerName: item.partner_name || 'Partner', items: [] };
                          acc[pId].items.push(item);
                          return acc;
                        }, {})
                      ).map(([pId, group]) => (
                        <div key={pId} className="space-y-3">
                          <div className="flex items-center justify-between px-1">
                            <Link href={`/partner/${pId}`} className="text-xs font-black text-zinc-900 uppercase tracking-tight hover:text-[var(--primary)] transition-colors">
                              {group.partnerName}
                            </Link>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{group.items.length} Match{group.items.length > 1 ? 'es' : ''}</span>
                          </div>

                          <div className="space-y-2">
                            {group.items.map((item) => {
                              const itemHref = `/partner/${pId}/item/${item.id}${debouncedQuery ? `?q=${encodeURIComponent(debouncedQuery)}` : ''}`;

                              return (
                                <Link
                                  key={item.id as any}
                                  href={itemHref}
                                  scroll={false}
                                  className="w-full flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition-all text-left group border border-zinc-100/50"
                                >
                                  <div className="size-14 rounded-xl overflow-hidden shrink-0 bg-zinc-100 relative border border-zinc-100">
                                    <Image src={(item.images as any)?.[0] || (item as any).image_url || '/images/logo.png'} alt={(item.name as any) || 'Item'} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="56px" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-zinc-900 truncate tracking-tight">{item.name as any}</p>
                                    <p className="text-xs text-zinc-500 font-bold mt-0.5">₹{item.base_price}</p>
                                    {item.has_personalization && (
                                      <div className="mt-1">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/5 px-1.5 py-0.5 rounded border border-[var(--primary)]/10">Identity</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="h-8 px-4 bg-white border border-zinc-200 rounded-lg text-xs font-black text-emerald-600 shadow-sm hover:border-emerald-200 active:scale-95 transition-all flex items-center justify-center">
                                    ADD+
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
