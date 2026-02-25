'use client';

import { useCallback } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { getFilteredProducts } from '@/lib/actions/discovery/search';
import { WyshkitProduct } from '@/lib/types/product';
import { InfiniteFlow } from '@/components/ui/InfiniteFlow';
import { LayoutGrid } from '@/components/ui/LayoutGrid';

interface InfiniteProductsGridProps {
    initialProducts: WyshkitProduct[];
    category: string | null;
    categoryName?: string | null;
    startOffset?: number;
    totalCount?: number;
}

/**
 * WYSHKIT 2026: InfiniteProductsGrid (Renamed)
 * Pattern: Elite Composition
 * - Uses InfiniteFlow primitive for high-performance pagination.
 * - Simply provides the specialized 'getFilteredProducts' action and 'ProductCard' renderer.
 */
export function InfiniteProductsGrid({
    initialProducts,
    category,
    startOffset = 0,
    totalCount
}: InfiniteProductsGridProps) {

    const fetchMore = useCallback(async ({ limit, offset }: { limit: number; offset: number }) => {
        return getFilteredProducts({
            limit,
            offset,
            category: category || undefined
        });
    }, [category]);

    return (
        <InfiniteFlow<WyshkitProduct>
            initialData={initialProducts}
            fetchAction={fetchMore}
            renderItem={(product) => (
                <ProductCard
                    key={product.id}
                    data={product}
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
