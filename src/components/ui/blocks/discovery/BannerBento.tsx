'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { EntityCard } from '@/components/ui/EntityCard';

interface BannerBentoProps {
    data: any[];
    title?: string;
    subtitle?: string;
    timeContext?: string | null;
    onQuickLook?: (id: string, type: any) => void;
}

export function BannerBento({ data, title, subtitle, timeContext, onQuickLook }: BannerBentoProps) {
    if (!data || data.length === 0) return null;

    return (
        <>
            <div className="flex items-center gap-2 mb-3">
                <div className="size-12 bg-[var(--primary)]/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-[var(--primary)]/20">
                    <Sparkles className="size-6 text-[var(--primary)]" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-zinc-900">
                        {title || 'Trending now'} {timeContext ? `· ${timeContext}` : ''}
                    </h2>
                    <p className="text-xs font-black text-zinc-600 tracking-wider">
                        {subtitle || 'Popular in your area'}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {data[0] && <EntityCard type="bento" data={data[0]} variant="bento_large" priority onQuickLook={onQuickLook} />}
                {data[1] && <EntityCard type="bento" data={data[1]} variant="bento_small" onQuickLook={onQuickLook} />}
                {data[2] && <EntityCard type="bento" data={data[2]} variant="bento_small" onQuickLook={onQuickLook} />}
            </div>
        </>
    );
}
