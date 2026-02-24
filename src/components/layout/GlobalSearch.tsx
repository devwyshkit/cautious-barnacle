'use client';

import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, ArrowLeft, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";
import type { Tables } from "@/lib/supabase/types";
import { ActionSlider } from "@/components/ui/ActionSlider";
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { VendorCard } from "@/components/ui/VendorCard";

type EntityItem = any;
type EntityPartner = any;

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
    products: (searchResults?.products || []) as EntityItem[],
    vendors: (searchResults?.vendors || []) as EntityPartner[],
  };

  const hasResults = results.products.length > 0 || results.vendors.length > 0;

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
            placeholder="Search products, stores..."
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
            <p className="text-sm font-semibold text-zinc-400">Search for products or stores</p>
          </div>
        ) : !hasResults ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="size-8 text-zinc-200 mb-3" />
            <p className="text-sm font-medium text-zinc-500">No results for "{query}"</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.vendors.length > 0 && (
              <div>
                <p className="text-xs font-medium text-zinc-400 mb-3">Stores</p>
                <div className="space-y-2">
                  {results.vendors.map((vendor) => (
                    <div
                      key={vendor.id as any}
                      onClick={() => triggerHaptic(HapticPattern.ACTION)}
                    >
                      <VendorCard
                        data={vendor}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.products.length > 0 && (
              <div>
                <p className="text-xs font-medium text-zinc-400 mb-3">Products</p>
                <div className="space-y-2">
                  {results.products.map((product) => (
                    <button
                      key={product.id || 'new'}
                      onClick={() => {
                        // WYSHKIT 2026: Momentum Haptic
                        triggerHaptic(HapticPattern.ACTION);

                        // WYSHKIT 2026: Navigate to product via vendor route
                        const partnerId = product.vendor_id || (product as any).partnerId;
                        if (partnerId) {
                          router.push(`/vendor/${partnerId}?product=${product.id}`);
                        } else {
                          // No vendor context — navigate to search with product ID for intent resolution
                          router.push(`/search?q=${encodeURIComponent(product.name || '')}&product=${product.id}`);
                        }
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors text-left"
                    >
                      <div className="size-12 rounded-lg overflow-hidden shrink-0 bg-zinc-50 relative border border-zinc-100">
                        <Image src={(product as any).image_url || ((product as any).images?.[0]) || '/images/logo.png'} alt={product.name || 'Item'} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 truncate">{product.name}</p>
                        <p className="text-xs text-zinc-500">{(product.vendor_name || 'Store')} · ₹{product.base_price}</p>
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
