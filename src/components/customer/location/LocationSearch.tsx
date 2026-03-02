'use client';

import React from 'react';
import { Search, X, Loader2, MapPin } from 'lucide-react';

interface LocationSearchProps {
    query: string;
    onQueryChange: (query: string) => void;
    results: any[];
    searching: boolean;
    onSelectPlace: (placeId: string) => void;
}

export function LocationSearch({ query, onQueryChange, results, searching, onSelectPlace }: LocationSearchProps) {
    return (
        <div className="flex flex-col h-full">
            <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-10">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        {searching ? (
                            <Loader2 className="size-4 animate-spin text-[var(--primary)]" />
                        ) : (
                            <Search className="size-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--primary)] transition-colors" />
                        )}
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search for area, street name..."
                        className="w-full bg-[var(--surface-muted)] border-none rounded-[var(--radius-xl)] py-3.5 pl-11 pr-11 text-sm font-semibold placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all outline-none"
                    />
                    {query && (
                        <button
                            onClick={() => onQueryChange('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--border)] rounded-full transition-colors"
                        >
                            <X className="size-3 text-[var(--text-secondary)]" />
                        </button>
                    )}
                </div>
            </div>

            {results.length > 0 && (
                <div className="p-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {results.map((result) => (
                        <button
                            key={result.place_id}
                            onClick={() => onSelectPlace(result.place_id)}
                            className="w-full flex items-start gap-4 p-4 rounded-[var(--radius-xl)] hover:bg-[var(--surface)] hover:shadow-[var(--shadow-sm)] transition-all text-left group"
                        >
                            <div className="size-10 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)]/5 transition-colors">
                                <MapPin className="size-4 text-[var(--text-tertiary)] group-hover:text-[var(--primary)]" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1 pt-0.5">
                                <span className="text-sm font-bold text-[var(--text-primary)] truncate">
                                    {result.structured_formatting.main_text}
                                </span>
                                <span className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                                    {result.structured_formatting.secondary_text}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
