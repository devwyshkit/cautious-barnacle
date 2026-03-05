'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import { X, Loader2, Search as SearchIcon } from 'lucide-react';
import { AppText, AppHeading } from '@/components/ui/Typography';
import { Input } from '@/components/ui/input';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { useUI } from '@/providers/UIProvider';
import { searchFiltered } from '@/lib/actions/discovery/search';
import { VendorCard } from '@/components/ui/VendorCard';
import { ProductCard } from '@/components/ui/ProductCard';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function SearchSheet() {
    const { isSearchSheetOpen, closeSearchSheet } = useUI();
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState<{ products: any[], vendors: any[], total: number }>({
        products: [],
        vendors: [],
        total: 0
    });
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input when opened
    useEffect(() => {
        if (isSearchSheetOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setInputValue('');
            setResults({ products: [], vendors: [], total: 0 });
        }
    }, [isSearchSheetOpen]);

    // Handle search fetch
    useEffect(() => {
        if (!inputValue.trim()) {
            setResults({ products: [], vendors: [], total: 0 });
            return;
        }

        const timer = setTimeout(() => {
            startTransition(async () => {
                const data = await searchFiltered({ q: inputValue, limit: 20 });
                setResults(data);
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue]);

    const hasResults = results.products.length > 0 || results.vendors.length > 0;

    return (
        <ResponsiveSurface
            open={isSearchSheetOpen}
            onOpenChange={closeSearchSheet}
            className="p-0 sm:max-w-xl h-[90dvh] bg-[var(--surface-muted)]"
        >
            <div className="flex flex-col h-full overflow-hidden">
                {/* Search Header */}
                <div className="p-4 bg-[var(--surface)] border-b border-[var(--border)] flex items-center gap-3 sticky top-0 z-10">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)]" />
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Search products, stores..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="pl-9 h-12 bg-[var(--surface-muted)] border-[var(--border)] text-sm rounded-[var(--radius-md)] focus-visible:ring-[var(--primary-ring)]"
                        />
                        {(inputValue || isPending) && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {isPending && <Loader2 className="size-4 animate-spin text-[var(--primary)]" />}
                                {inputValue && (
                                    <button
                                        onClick={() => {
                                            triggerHaptic(HapticPattern.ACTION);
                                            setInputValue("");
                                        }}
                                        className="p-1 hover:bg-[var(--surface-muted)] rounded-full transition-colors"
                                    >
                                        <X className="size-4 text-[var(--text-tertiary)]" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Area */}
                <div className="flex-1 overflow-y-auto overscroll-contain pb-safe scrollbar-hide">
                    {!inputValue.trim() ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                            <div className="size-16 bg-[var(--surface)] rounded-full flex items-center justify-center mb-4 shadow-sm border border-[var(--border)]">
                                <SearchIcon className="size-8 text-[var(--border)]" />
                            </div>
                            <AppText variant="label" weight="bold" color="primary">Search WyshKit</AppText>
                            <AppText variant="caption" color="tertiary" className="mt-1">Find bespoke products and top vendors</AppText>
                        </div>
                    ) : isPending && !hasResults ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
                        </div>
                    ) : !hasResults ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
                            <AppText variant="label" weight="bold" color="primary">No matches found</AppText>
                            <AppText variant="caption" color="tertiary" className="mt-2 mx-auto max-w-[200px]">
                                Try searching for something else or browse categories on the home page.
                            </AppText>
                        </div>
                    ) : (
                        <div className={cn("p-4 space-y-8 transition-opacity duration-300", isPending ? "opacity-50" : "opacity-100")}>
                            {/* Vendor Section */}
                            {results.vendors.length > 0 && (
                                <section className="space-y-4">
                                    <AppHeading level={3} color="tertiary" className="uppercase tracking-[0.2em] px-1">Top Stores</AppHeading>
                                    <div className="space-y-3">
                                        {results.vendors.map((vendor) => (
                                            <div key={vendor.id} onClick={closeSearchSheet}>
                                                <VendorCard
                                                    data={vendor}
                                                    className="bg-[var(--surface)] border border-[var(--border)] shadow-sm p-3 group"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Product Section */}
                            {results.products.length > 0 && (
                                <section className="space-y-4">
                                    <AppHeading level={3} color="tertiary" className="uppercase tracking-[0.2em] px-1">Products</AppHeading>
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-6">
                                        {results.products.map((product) => (
                                            <div key={product.id} onClick={closeSearchSheet}>
                                                <ProductCard
                                                    data={product}
                                                    className="h-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ResponsiveSurface>
    );
}
