'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmittedPersonalizationProps {
    details: {
        text?: string | null;
        image_url?: string | null;
        addons?: string[];
    };
    itemName?: string;
    isOptimisticSubmitted?: boolean;
}

export function SubmittedPersonalization({ details, itemName, isOptimisticSubmitted }: SubmittedPersonalizationProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasContent = details.text || details.image_url || (details.addons && details.addons.length > 0);

    if (!hasContent && !isOptimisticSubmitted) {
        return null;
    }

    return (
        <div className="rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[var(--surface-muted)]/50 transition-colors"
            >
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-sm">
                        <FileText className="size-4 text-[var(--text-tertiary)]" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight">
                            {isOptimisticSubmitted && !hasContent ? 'Brief Processing...' : 'Submitted Personalisation'}
                        </p>
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[150px]">
                            {itemName || (isOptimisticSubmitted ? 'Sharing Vision...' : 'View your details')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {details.image_url && !isExpanded && (
                        <div className="size-6 rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] shadow-sm animate-in zoom-in duration-300">
                            <img src={details.image_url} alt="Submitted" className="size-full object-cover" />
                        </div>
                    )}
                    {isExpanded ? (
                        <ChevronUp className="size-4 text-[var(--text-tertiary)]" />
                    ) : (
                        <ChevronDown className="size-4 text-[var(--text-tertiary)]" />
                    )}
                </div>
            </button>

            {isExpanded && (
                <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    {details.text && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-[0.15em]">Instructions</p>
                            <div className="bg-[var(--surface)] p-3 rounded-[var(--radius-md)] border border-[var(--border)] italic text-sm text-[var(--text-secondary)] leading-relaxed">
                                &quot;{details.text}&quot;
                            </div>
                        </div>
                    )}

                    {details.image_url && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-[0.15em]">Reference Image</p>
                            <div className="relative aspect-video rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] group bg-[var(--border)]">
                                <img src={details.image_url} alt="Submitted reference" className="size-full object-cover" />
                                <a
                                    href={details.image_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute bottom-2 right-2 px-3 py-1.5 bg-[var(--surface)]/90 backdrop-blur-md rounded-[var(--radius-sm)] text-xs font-bold text-[var(--text-primary)] shadow-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ExternalLink className="size-3" />
                                    View Original
                                </a>
                            </div>
                        </div>
                    )}

                    {details.addons && details.addons.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-[0.15em]">Included Add-ons</p>
                            <div className="flex flex-wrap gap-1.5">
                                {details.addons.map((addon) => (
                                    <span
                                        key={addon}
                                        className="px-2 py-0.5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)]"
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
