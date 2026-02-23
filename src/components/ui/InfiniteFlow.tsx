'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { logger } from '@/lib/logging/logger';
import { cn } from '@/lib/utils';

interface InfiniteFlowProps<T> {
    initialData: T[];
    fetchAction: (options: { limit: number; offset: number }) => Promise<{ data?: { items: T[]; total: number }; error?: string }>;
    renderItem: (item: T, index: number) => React.ReactNode;
    limit?: number;
    startOffset?: number;
    totalCount?: number;
    emptyState?: React.ReactNode;
    className?: string;
    gridClassName?: string;
    renderContainer?: (props: { children: React.ReactNode }) => React.ReactElement;
}

/**
 * WYSHKIT 2026: InfiniteFlow (Elite Primitive)
 * Pattern: Polymorphic Workflow
 * - Handles all infinite scrolling logic in a single, reusable boundary.
 * - Accepts a generic `renderItem` to support Items, Partners, or anything else.
 * - Zero Shadow State: Syncs internal offset with startOffset prop.
 */
export function InfiniteFlow<T extends { id: string | number }>({
    initialData,
    fetchAction,
    renderItem,
    limit = 12,
    startOffset = 0,
    totalCount,
    emptyState,
    className,
    gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    renderContainer,
}: InfiniteFlowProps<T>) {
    const [items, setItems] = useState<T[]>(initialData);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(() => {
        if (totalCount !== undefined) return initialData.length + startOffset < totalCount;
        return initialData.length >= limit;
    });

    const loaderRef = useRef<HTMLDivElement>(null);
    const offsetRef = useRef(startOffset + initialData.length);

    // Sync state if initialData changes (e.g. category switch)
    useEffect(() => {
        setItems(initialData);
        offsetRef.current = startOffset + initialData.length;
        setHasMore(totalCount !== undefined
            ? (initialData.length + startOffset < totalCount)
            : (initialData.length >= limit)
        );
    }, [initialData, startOffset, totalCount, limit]);

    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        const currentOffset = offsetRef.current;

        try {
            const res = await fetchAction({ limit, offset: currentOffset });

            if (res.data?.items && res.data.items.length > 0) {
                setItems(prev => {
                    // Prevent duplicates by checking IDs
                    const existingIds = new Set(prev.map(i => i.id));
                    const newItems = res.data!.items.filter(i => !existingIds.has(i.id));
                    return [...prev, ...newItems];
                });

                offsetRef.current += res.data.items.length;

                if (res.data.total !== undefined) {
                    setHasMore(offsetRef.current < res.data.total);
                } else {
                    setHasMore(res.data.items.length === limit);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            logger.error('InfiniteFlow LoadMore Failed', error);
            setHasMore(false);
        } finally {
            setIsLoadingMore(false);
        }
    }, [fetchAction, hasMore, isLoadingMore, limit]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasMore && !isLoadingMore) {
                    // WYSHKIT 2026: Strict Unobserve to prevent memory leaks and racing
                    observer.unobserve(target.target);
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, isLoadingMore, loadMore]);

    if (items.length === 0 && !isLoadingMore && emptyState) {
        return <>{emptyState}</>;
    }

    return (
        <div className={cn("space-y-8", className)}>
            {renderContainer ? (
                renderContainer({
                    children: items.map((item, index) => renderItem(item, index))
                })
            ) : (
                <div className={gridClassName}>
                    {items.map((item, index) => renderItem(item, index))}
                </div>
            )}

            <div ref={loaderRef} className="flex justify-center py-12">
                {isLoadingMore ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="size-6 text-[var(--primary)] animate-spin" />
                        <p className="text-xs font-black text-zinc-400 tracking-tight">Hydrating Flow...</p>
                    </div>
                ) : !hasMore && items.length > 0 ? (
                    <div className="flex flex-col items-center gap-3 opacity-30">
                        <Sparkles className="size-5 text-zinc-400" />
                        <p className="text-xs font-black text-zinc-400 tracking-tight">End of Discovery</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
