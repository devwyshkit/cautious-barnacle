'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmittedIdentityProps {
    details: {
        text?: string | null;
        image_url?: string | null;
        addons?: string[];
    };
    itemName?: string;
    isOptimisticSubmitted?: boolean;
}

export function SubmittedIdentity({ details, itemName, isOptimisticSubmitted }: SubmittedIdentityProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasContent = details.text || details.image_url || (details.addons && details.addons.length > 0);

    if (!hasContent && !isOptimisticSubmitted) {
        return null;
    }

    return (
        <div className="rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-zinc-100/50 transition-colors"
            >
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                        <FileText className="size-4 text-zinc-400" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-zinc-400 tracking-tight">
                            {isOptimisticSubmitted && !hasContent ? 'Brief Processing...' : 'Submitted Identity'}
                        </p>
                        <p className="text-xs font-bold text-zinc-900 truncate max-w-[150px]">
                            {itemName || (isOptimisticSubmitted ? 'Sharing Vision...' : 'View your details')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {details.image_url && !isExpanded && (
                        <div className="size-6 rounded-md overflow-hidden border border-zinc-200 shadow-sm animate-in zoom-in duration-300">
                            <img src={details.image_url} alt="Submitted" className="size-full object-cover" />
                        </div>
                    )}
                    {isExpanded ? (
                        <ChevronUp className="size-4 text-zinc-400" />
                    ) : (
                        <ChevronDown className="size-4 text-zinc-400" />
                    )}
                </div>
            </button>

            {isExpanded && (
                <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    {details.text && (
                        <div className="space-y-1.5">
                            <p className="text-[11px] font-black text-zinc-400 tracking-[0.15em]">Instructions</p>
                            <div className="bg-white p-3 rounded-xl border border-zinc-100 italic text-sm text-zinc-700 leading-relaxed">
                                &quot;{details.text}&quot;
                            </div>
                        </div>
                    )}

                    {details.image_url && (
                        <div className="space-y-1.5">
                            <p className="text-[11px] font-black text-zinc-400 tracking-[0.15em]">Reference Image</p>
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 group bg-zinc-200">
                                <img src={details.image_url} alt="Submitted reference" className="size-full object-cover" />
                                <a
                                    href={details.image_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg text-[11px] font-black text-zinc-900 shadow-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ExternalLink className="size-3" />
                                    View Original
                                </a>
                            </div>
                        </div>
                    )}

                    {details.addons && details.addons.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-[11px] font-black text-zinc-400 tracking-[0.15em]">Included Add-ons</p>
                            <div className="flex flex-wrap gap-1.5">
                                {details.addons.map((addon) => (
                                    <span
                                        key={addon}
                                        className="px-2 py-0.5 rounded-md bg-white border border-zinc-100 text-[11px] font-bold text-zinc-600"
                                    >
                                        {addon}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
