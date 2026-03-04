'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';

interface BannerBentoProps {
    data: any[];
    title?: string;
    subtitle?: string;
    timeContext?: string | null;
}

export function BannerBento({ data, title, subtitle, timeContext }: BannerBentoProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="relative w-full mb-[var(--space-4)]">
            {(title || subtitle) && (
                <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-3)]">
                    <div className="size-10 bg-[var(--primary)]/10 backdrop-blur-md rounded-[var(--radius-md)] flex items-center justify-center border border-[var(--primary)]/20">
                        <Sparkles className="size-5 text-[var(--primary)]" />
                    </div>
                    <div>
                        {title && (
                            <h2 className="text-sm font-bold text-[var(--text-primary)] tracking-tight uppercase">
                                {title} {timeContext ? `· ${timeContext}` : ''}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            )}
            <div className="flex gap-[var(--space-4)] overflow-x-auto no-scrollbar snap-x snap-mandatory pb-[var(--space-2)]">
                {data.map((product, idx) => (
                    <div key={product.id || idx} className="w-[85vw] md:w-[400px] shrink-0 snap-center">
                        <BentoCard data={product} variant="large" priority={idx === 0} />
                    </div>
                ))}
            </div>
        </div>
    );
}
