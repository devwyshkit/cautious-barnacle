'use client';

import React from 'react';
import { EntityCard } from '@/components/ui/EntityCard';

interface CheckoutItemsProps {
    data: any[];
}

export function CheckoutItems({ data }: CheckoutItemsProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="surface-card p-4">
            <div className="space-y-4">
                {data.map((item: any) => (
                    <EntityCard key={item.id} type="item" data={item} variant="compact" />
                ))}
            </div>
        </div>
    );
}
