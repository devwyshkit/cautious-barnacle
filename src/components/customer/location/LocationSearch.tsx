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
            <div className="px-5 py-4 border-b border-zinc-100 bg-white sticky top-0 z-10">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        {searching ? (
                            <Loader2 className="size-4 animate-spin text-[#D91B24]" />
                        ) : (
                            <Search className="size-4 text-zinc-400 group-focus-within:text-[#D91B24] transition-colors" />
                        )}
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search for area, street name..."
                        className="w-full bg-zinc-50 border-none rounded-2xl py-3.5 pl-11 pr-11 text-sm font-semibold placeholder:text-zinc-400 focus:ring-2 focus:ring-[#D91B24]/10 transition-all outline-none"
                    />
                    {query && (
                        <button
                            onClick={() => onQueryChange('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 rounded-full transition-colors"
                        >
                            <X className="size-3 text-zinc-500" />
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
                            className="w-full flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-all text-left group"
                        >
                            <div className="size-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-rose-50 transition-colors">
                                <MapPin className="size-4 text-zinc-400 group-hover:text-[#D91B24]" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1 pt-0.5">
                                <span className="text-sm font-bold text-zinc-900 truncate">
                                    {result.structured_formatting.main_text}
                                </span>
                                <span className="text-xs text-zinc-600 truncate mt-0.5">
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
