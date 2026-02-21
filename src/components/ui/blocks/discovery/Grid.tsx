'use client';

import React from 'react';
import { EntityCard } from '@/components/ui/EntityCard';

interface GridProps {
    data: any[];
}

export function Grid({ data }: GridProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data.map((item) => (
                <EntityCard
                    key={item.id}
                    type={item.partner_id ? 'item' : 'partner'}
                    data={item}
                    variant="portrait"
                    className="bg-zinc-50/50 border-zinc-100 hover:bg-white hover:shadow-xl transition-all"
                />
            ))}
        </div>
    );
}
