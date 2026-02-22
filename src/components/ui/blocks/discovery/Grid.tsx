'use client';

import { EntityCard } from '@/components/ui/EntityCard';
import { LayoutGrid } from '@/components/ui/LayoutGrid';

interface GridProps {
    data: any[];
    onQuickLook?: (id: string, type: any) => void;
}

export function Grid({ data, onQuickLook }: GridProps) {
    if (!data || data.length === 0) return null;

    return (
        <LayoutGrid cols={3} gap="md">
            {data.map((item: any) => (
                <EntityCard
                    key={item.id}
                    type={item.partner_id ? 'item' : 'partner'}
                    data={item}
                    variant="portrait"
                    onQuickLook={onQuickLook}
                    className="bg-zinc-50/50 border-zinc-100 hover:bg-white hover:shadow-xl transition-all"
                />
            ))}
        </LayoutGrid>
    );
}
