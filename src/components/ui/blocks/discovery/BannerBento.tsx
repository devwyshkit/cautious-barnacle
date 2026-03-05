'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { HomeSection } from '@/components/customer/home/HomeSection';

interface BannerBentoProps {
    data: any[];
    title?: string;
    subtitle?: string;
    timeContext?: string | null;
}

export function BannerBento({ data, title, subtitle, timeContext }: BannerBentoProps) {
    if (!data || data.length === 0) return null;

    const displayTitle = title ? `${title} ${timeContext ? `· ${timeContext}` : ''}` : undefined;

    return (
        <HomeSection title={displayTitle || ''} subtitle={subtitle}>
            <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-4 px-4">
                {data.map((product, idx) => (
                    <div key={product.id || idx} className="w-[85vw] md:w-[400px] shrink-0 snap-center">
                        <BentoCard data={product} variant="large" priority={idx === 0} />
                    </div>
                ))}
            </div>
        </HomeSection>
    );
}
