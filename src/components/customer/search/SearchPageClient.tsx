'use client';

import { useState, useEffect, useRef, useMemo, use, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from 'next/image';
import { Search, X, Loader2, ArrowLeft, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { logger } from '@/lib/logging/logger';
import { EntityCard } from "@/components/ui/EntityCard";
import { QuickItemSheet } from "@/components/customer/item/QuickItemSheet";
import Link from 'next/link';

interface SearchPageClientProps {
  searchParams: Promise<{ q?: string; category?: string }>;
  initialResults: {
    items: any[];
    partners: any[];
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
  const hasResults = results.items.length > 0 || results.partners.length > 0;
  const hasActiveFilters = currentQ || currentCategory;

  // ELITE: Quick Look State
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleItemClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    setSelectedItemId(item.id);
  };

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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-9 h-10 bg-zinc-50 border-zinc-100 text-sm rounded-lg focus-visible:ring-zinc-200"
          />
          {(inputValue || isPending) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isPending && <Loader2 className="size-3 animate-spin text-zinc-400" />}
              {inputValue && (
                <button onClick={() => { setInputValue(""); handleSearchUpdate(""); }} className="p-1">
                  <X className="size-4 text-zinc-400" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {currentCategory && (
        <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-600">Category:</span>
            <span className="text-xs text-zinc-900 capitalize">{currentCategory}</span>
            <button
              onClick={() => handleSearchUpdate(inputValue, "")}
              className="ml-auto text-xs text-zinc-500 hover:text-zinc-900"
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
              We couldn't find {currentQ ? `"${currentQ}"` : 'what you were looking for'}
              {currentCategory && ` in ${currentCategory}`}.
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
          <div className={cn("space-y-6 transition-opacity", isPending ? "opacity-50" : "opacity-100")}>
            <div className="space-y-8">
              {results.partners.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 px-1">Top Stores</h3>
                  <div className="space-y-4">
                    {results.partners.map((partner) => (
                      <EntityCard
                        key={partner.id}
                        type="partner"
                        data={partner}
                        variant="row"
                        className="bg-zinc-50/50 p-2"
                      />
                    ))}
                  </div>
                </div>
              )}

              {results.items.length > 0 && (
                <div className="pb-safe">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 px-1">Items from Stores</h3>
                  <div className="space-y-6">
                    {Object.entries(
                      results.items.reduce((acc: Record<string, { partnerName: string, items: any[] }>, item: any) => {
                        const pId = item.partner_id || '';
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

                        <div className="grid grid-cols-1 gap-4">
                          {group.items.map((item) => (
                            <div key={item.id} onClick={(e) => handleItemClick(e, item)}>
                              <EntityCard
                                type="item"
                                data={item}
                              />
                            </div>
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

      {/* WYSHKIT 2026: Quick Look Sheet */}
      <QuickItemSheet
        itemId={selectedItemId}
        open={!!selectedItemId}
        onClose={() => setSelectedItemId(null)}
      />
    </div>
  );
}

