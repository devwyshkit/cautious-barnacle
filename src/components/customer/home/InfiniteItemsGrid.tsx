'use client';

import { useCallback } from 'react';
import { ItemCard } from '@/components/ui/ItemCard';
import { getFilteredItems } from '@/lib/actions/discovery/search';
import { WyshkitItem } from '@/lib/types/item';
import { InfiniteFlow } from '@/components/ui/InfiniteFlow';
import { LayoutGrid } from '@/components/ui/LayoutGrid';

interface InfiniteItemsGridProps {
    initialItems: WyshkitItem[];
    category: string | null;
    categoryName?: string | null;
    startOffset?: number;
    totalCount?: number;
}

/**
 * WYSHKIT 2026: InfiniteItemsGrid (Refactored)
 * Pattern: Elite Composition
 * - Uses InfiniteFlow primitive for high-performance pagination.
 * - Simply provides the specialized 'getFilteredItems' action and 'ItemCard' renderer.
 */
export function InfiniteItemsGrid({
    initialItems,
    category,
    startOffset = 0,
    totalCount
}: InfiniteItemsGridProps) {

    const fetchMore = useCallback(async ({ limit, offset }: { limit: number; offset: number }) => {
        return getFilteredItems({
            limit,
            offset,
            category: category || undefined
        });
    }, [category]);

    return (
        <InfiniteFlow<WyshkitItem>
            initialData={initialItems}
            fetchAction={fetchMore}
            renderItem={(item) => (
                <ItemCard
                    key={item.id}
                    data={item}
                />
            )}
            startOffset={startOffset}
            totalCount={totalCount}
            limit={12}
            gridClassName=""
            renderContainer={({ children }: { children: React.ReactNode }) => (
                <LayoutGrid cols={3} gap="md">
                    {children}
                </LayoutGrid>
            )}
        />
    );
}
