'use client';

import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, ArrowLeft, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";
import type { Tables } from "@/lib/supabase/database.types";
import { ActionSlider } from "@/components/ui/ActionSlider";
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { PartnerCard } from "@/components/customer/PartnerCard";

export function GlobalSearch() {
  const router = useRouter();
  // WYSHKIT 2026: Use router navigation (replaces Zustand)
  const goBack = () => {
    triggerHaptic(HapticPattern.ACTION);
    router.back();
  };
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { data: searchResults, isLoading, error } = useSearch({
    q: debouncedQuery.trim().length >= 2 ? debouncedQuery.trim() : undefined,
  });

  // WYSHKIT 2026: React 19 Compiler handles memoization automatically
  // No manual useMemo needed - React Compiler optimizes this calculation
  const results = {
    items: (searchResults?.items || []) as Tables<'v_item_listings'>[],
    partners: (searchResults?.partners || []) as Tables<'v_partners_detailed'>[],
  };

  const hasResults = results.items.length > 0 || results.partners.length > 0;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={goBack} className="size-9 rounded-lg shrink-0">
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

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-zinc-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-zinc-500">Search failed. Please try again.</p>
          </div>
        ) : !query ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="size-10 text-zinc-200 mb-4" />
            <p className="text-sm font-semibold text-zinc-400">Search for items or stores</p>
          </div>
        ) : !hasResults ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="size-8 text-zinc-200 mb-3" />
            <p className="text-sm font-medium text-zinc-500">No results for "{query}"</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.partners.length > 0 && (
              <div>
                <p className="text-xs font-medium text-zinc-400 mb-3">Stores</p>
                <div className="space-y-2">
                  {results.partners.map((partner) => (
                    <div
                      key={partner.id as any}
                      onClick={() => triggerHaptic(HapticPattern.ACTION)}
                    >
                      <PartnerCard
                        id={partner.id as any}
                        name={(partner.name as any) || 'Store'}
                        city={(partner.city as any) || 'City'}
                        image_url={partner.image_url ?? '/images/logo.png'}
                        rating={partner.rating as any}
                        variant="row"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.items.length > 0 && (
              <div>
                <p className="text-xs font-medium text-zinc-400 mb-3">Items</p>
                <div className="space-y-2">
                  {results.items.map((item) => (
                    <button
                      key={item.id as any}
                      onClick={() => {
                        // WYSHKIT 2026: Momentum Haptic
                        triggerHaptic(HapticPattern.ACTION);

                        // WYSHKIT 2026: Navigate to item via partner route
                        const partnerId = (item as any).partnerId || (item as any).partner_id;
                        if (partnerId) {
                          router.push(`/partner/${partnerId}?item=${item.id as any}`);
                        } else {
                          // No partner context — navigate to search with item ID for intent resolution
                          router.push(`/search?q=${encodeURIComponent(item.name as any)}&item=${item.id as any}`);
                        }
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors text-left"
                    >
                      <div className="size-12 rounded-lg overflow-hidden shrink-0 bg-zinc-50 relative border border-zinc-100">
                        <Image src={(item.images as any)?.[0] ?? '/images/logo.png'} alt={(item.name as any) || 'Item'} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 truncate">{item.name as any}</p>
                        <p className="text-xs text-zinc-500">{(item.partner_name || 'Store')} · ₹{item.base_price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
