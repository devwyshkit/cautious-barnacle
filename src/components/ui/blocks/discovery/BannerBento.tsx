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
        <>
            <div className="flex items-center gap-2 mb-3">
                <div className="size-10 bg-[var(--primary)]/10 backdrop-blur-md rounded-[var(--radius-md)] flex items-center justify-center border border-[var(--primary)]/20">
                    <Sparkles className="size-5 text-[var(--primary)]" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-[var(--text-primary)] tracking-tight uppercase">
                        {title || 'Trending now'} {timeContext ? `· ${timeContext}` : ''}
                    </h2>
                    <p className="text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase">
                        {subtitle || 'Popular in your area'}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {data[0] && <BentoCard data={data[0]} variant="large" priority />}
                {data[1] && <BentoCard data={data[1]} variant="small" />}
                {data[2] && <BentoCard data={data[2]} variant="small" />}
            </div>
        </>
    );
}
