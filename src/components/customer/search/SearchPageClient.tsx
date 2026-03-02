'use client';

import { useState, useEffect, useRef, useMemo, use, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from 'next/image';
import { Search, X, Loader2, ArrowLeft, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { logger } from '@/lib/logging/logger';
import { VendorCard } from "@/components/ui/VendorCard";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from 'next/link';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

interface SearchPageClientProps {
  searchParams: Promise<{ q?: string; category?: string }>;
  initialResults: {
    products: any[];
    vendors: any[];
    total: number;
  };
}

/**
 * WYSHKIT 2026: Elite Search (Zero Shadow State)
 * Pattern: URL-Authoritative Design
 * - NO local results state. Data flows from Server Component via props.
 * - URL is the absolute source of truth for query/category.
 * - useTransition handles the visual pending state during URL updates.
 * - Eradicates redundant useEffect fetches and dual-authority bugs.
 */
export function SearchPageClient({ searchParams, initialResults }: SearchPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const params = use(searchParams);
  const currentQ = searchParamsHook.get('q') || '';
  const currentCategory = searchParamsHook.get('category') || '';

  // Only keep local state for the INPUT value to ensure zero-lag typing
  const [inputValue, setInputValue] = useState(currentQ);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value if URL changes (e.g. browser back/forward)
  useEffect(() => {
    setInputValue(currentQ);
  }, [currentQ]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearchUpdate = (q: string, cat?: string) => {
    const params = new URLSearchParams(searchParamsHook.toString());
    if (q) params.set('q', q); else params.delete('q');
    if (cat !== undefined) {
      if (cat) params.set('category', cat); else params.delete('category');
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Debouncing for the URL update, NOT for a local fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== currentQ) {
        handleSearchUpdate(inputValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, currentQ]);

  const results = initialResults;
  const hasResults = results.products.length > 0 || results.vendors.length > 0;
  const hasActiveFilters = currentQ || currentCategory;

  // No local state for product selection - URL takes precedence

  return (
    <div className="flex flex-col h-full bg-[var(--surface)]">
      <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            triggerHaptic(HapticPattern.ACTION);
            router.back();
          }}
          className="size-9 rounded-[var(--radius-md)] shrink-0"
        >
          <ArrowLeft className="size-5 text-[var(--text-secondary)]" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)]" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products, stores..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-9 h-10 bg-[var(--surface-muted)] border-[var(--border)] text-sm rounded-[var(--radius-md)] focus-visible:ring-[var(--primary-ring)]"
          />
          {(inputValue || isPending) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isPending && <Loader2 className="size-3 animate-spin text-[var(--text-tertiary)]" />}
              {inputValue && (
                <button
                  onClick={() => {
                    triggerHaptic(HapticPattern.ACTION);
                    setInputValue("");
                    handleSearchUpdate("");
                  }}
                  className="p-1"
                >
                  <X className="size-4 text-[var(--text-tertiary)]" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {currentCategory && (
        <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-muted)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-[var(--text-tertiary)]">Category:</span>
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase">{currentCategory}</span>
            <button
              onClick={() => {
                triggerHaptic(HapticPattern.ACTION);
                handleSearchUpdate(inputValue, "");
              }}
              className="ml-auto text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {isPending && !hasResults ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
          </div>
        ) : !hasActiveFilters ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="size-10 text-[var(--border)] mb-4" />
            <p className="text-sm font-black uppercase tracking-tight text-[var(--text-tertiary)]">Search for products or stores</p>
          </div>
        ) : !hasResults ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="size-20 bg-[var(--surface-muted)] rounded-full flex items-center justify-center mb-6">
              <Search className="size-8 text-[var(--border)]" />
            </div>
            <p className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] mb-2">No Results</p>
            <p className="text-xs font-bold text-[var(--text-secondary)] max-w-[200px] mb-8 leading-relaxed">
              We couldn&apos;t find {currentQ ? `&quot;${currentQ}&quot;` : 'what you were looking for'}
              {currentCategory && ` in ${currentCategory}`}.
            </p>
            <Button
              onClick={() => {
                triggerHaptic(HapticPattern.ACTION);
                router.push('/');
              }}
              variant="outline"
              className="rounded-[var(--radius-xl)] border-[var(--border)] text-xs font-black uppercase tracking-tight px-8 h-10"
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <div className={cn("space-y-6 transition-opacity", isPending ? "opacity-50" : "opacity-100")}>
            <div className="space-y-8">
              {results.vendors.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight mb-4 px-1">Top stores</h3>
                  <div className="space-y-4">
                    {results.vendors.map((vendor) => (
                      <VendorCard
                        key={vendor.id}
                        data={vendor}
                        className="bg-[var(--surface-muted)]/50 p-2"
                      />
                    ))}
                  </div>
                </div>
              )}

              {results.products.length > 0 && (
                <div className="pb-safe">
                  <h3 className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight mb-4 px-1">Products from stores</h3>
                  <div className="space-y-6">
                    {Object.entries(
                      results.products.reduce((acc: Record<string, { vendorName: string, products: any[] }>, product: any) => {
                        const vId = product.vendor_id || '';
                        if (!acc[vId]) acc[vId] = { vendorName: product.vendor_name || 'Vendor', products: [] };
                        acc[vId].products.push(product);
                        return acc;
                      }, {})
                    ).map(([vId, group]) => (
                      <div key={vId} className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <Link href={`/vendor/${vId}`} className="text-xs font-bold text-[var(--text-primary)] tracking-tight hover:text-[var(--primary)] transition-colors">
                            {group.vendorName}
                          </Link>
                          <span className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight">{group.products.length} Match{group.products.length > 1 ? 'es' : ''}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-6">
                          {group.products.map((product) => (
                            <ProductCard
                              key={product.id}
                              data={product}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
