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
type EntityVendor = any;

export function GlobalSearch() {
  const router = useRouter();
  // WYSHKIT 2026: Use router navigation (replaces Zustand)
  const goBack = () => {
    triggerHaptic(HapticPattern.ACTION);
    router.back();
  };
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { data: searchResults, isLoading, error } = useSearch({
    q: query.trim().length >= 2 ? query.trim() : undefined,
  });

  // WYSHKIT 2026: React 19 Compiler handles memoization automatically
  // No manual useMemo needed - React Compiler optimizes this calculation
  const results = {
    products: (searchResults?.products || []) as EntityItem[],
    vendors: (searchResults?.vendors || []) as EntityVendor[],
  };

  const hasResults = results.products.length > 0 || results.vendors.length > 0;

  return (
    <div className="flex flex-col h-full bg-[var(--surface)]">
      <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={goBack} className="size-9 rounded-lg shrink-0">
          <ArrowLeft className="size-5 text-[var(--text-secondary)]" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)]" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products, stores..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 bg-[var(--surface-muted)] border-[var(--border)] text-sm rounded-lg"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="size-4 text-[var(--text-tertiary)]" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-[var(--text-tertiary)]" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-[var(--text-secondary)]">Search failed. Please try again.</p>
          </div>
        ) : !query ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="size-10 text-[var(--border)] mb-4" />
            <p className="text-sm font-semibold text-[var(--text-tertiary)]">Search for products or stores</p>
          </div>
        ) : !hasResults ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="size-8 text-[var(--border)] mb-3" />
            <p className="text-sm font-medium text-[var(--text-secondary)]">No results for &quot;{query}&quot;</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.vendors.length > 0 && (
              <div>
                <p className="text-xs font-medium text-[var(--text-tertiary)] mb-3">Stores</p>
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
                <p className="text-xs font-medium text-[var(--text-tertiary)] mb-3">Products</p>
                <div className="space-y-2">
                  {results.products.map((product) => (
                    <button
                      key={product.id || 'new'}
                      onClick={() => {
                        // WYSHKIT 2026: Momentum Haptic
                        triggerHaptic(HapticPattern.ACTION);

                        // WYSHKIT 2026: Navigate to product via vendor route
                        const vendorId = product.vendor_id || (product as any).vendorId;
                        if (vendorId) {
                          router.push(`/vendor/${vendorId}?product=${product.id}`);
                        } else {
                          // No vendor context — navigate to search with product ID for intent resolution
                          router.push(`/search?q=${encodeURIComponent(product.name || '')}&product=${product.id}`);
                        }
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-[var(--surface-muted)] rounded-xl hover:bg-[var(--surface-muted)] transition-colors text-left"
                    >
                      <div className="size-12 rounded-lg overflow-hidden shrink-0 bg-[var(--surface-muted)] relative border border-[var(--border)]">
                        <Image src={(product as any).image_url || ((product as any).images?.[0]) || '/images/logo.png'} alt={product.name || 'Product'} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{product.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{(product.vendor_name || 'Store')} · ₹{product.base_price}</p>
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
