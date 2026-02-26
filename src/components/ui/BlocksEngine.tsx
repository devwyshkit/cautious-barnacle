import React, { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { InfiniteProductsGrid } from '@/components/customer/home/InfiniteProductsGrid';

/**
 * WYSHKIT 2026: Server-Driven UI Engine
 * Swiggy Principle: Structural components should be RSC to enable streaming.
 * Interactivity is scoped to individual blocks.
 */

// Discovery Blocks
const CircleRail = React.lazy(() => import('./blocks/discovery/CircleRail').then(m => ({ default: m.CircleRail })));
const CardRail = React.lazy(() => import('./blocks/discovery/CardRail').then(m => ({ default: m.CardRail })));
const BannerBento = React.lazy(() => import('./blocks/discovery/BannerBento').then(m => ({ default: m.BannerBento })));
const Grid = React.lazy(() => import('./blocks/discovery/Grid').then(m => ({ default: m.Grid })));
const VendorGroupedGrid = React.lazy(() => import('./blocks/discovery/VendorGroupedGrid').then(m => ({ default: m.VendorGroupedGrid })));
const StoreHeader = React.lazy(() => import('./blocks/vendor/StoreHeader').then(m => ({ default: m.StoreHeader })));

// Checkout Blocks - PURGED as per Wyshkit 2026 Structural Blueprint (SPI Principle)

export type BlockType = 'CIRCLE_RAIL' | 'CARD_RAIL' | 'GRID' | 'BANNER_BENTO' | 'VENDOR_LIST' | 'VENDOR_GROUPED_GRID' | 'INFINITE_GRID' | 'STORE_HEADER';

export interface BlockData<T = any> {
    id: string;
    type: BlockType;
    title?: string;
    subtitle?: string;
    data: T[];
    metadata?: Record<string, any>;
}

interface BlocksEngineProps {
    blocks: BlockData<any>[];
    className?: string;
    context?: {
        time_of_day?: string | null;
        [key: string]: any;
    };
}

export function BlocksEngine({ blocks, className, context }: BlocksEngineProps) {
    if (!blocks || blocks.length === 0) return null;

    const renderBlock = (block: BlockData) => {
        switch (block.type) {
            case 'BANNER_BENTO':
                // @ts-ignore
                return <BannerBento data={block.data} title={block.title} subtitle={block.subtitle} timeContext={context?.time_of_day} />;
            case 'CIRCLE_RAIL':
                return <CircleRail data={block.data} context={context} />;
            case 'CARD_RAIL':
                return <CardRail data={block.data} />;
            case 'GRID':
                return <Grid data={block.data} />;
            case 'VENDOR_LIST':
            case 'VENDOR_GROUPED_GRID':
                return <VendorGroupedGrid data={block.data} title={block.title} subtitle={block.subtitle} context={context} />;
            case 'INFINITE_GRID':
                return (
                    <InfiniteProductsGrid
                        initialProducts={block.data || []}
                        category={block.metadata?.category || null}
                        totalCount={block.metadata?.totalCount}
                        startOffset={block.data?.length || 0}
                    />
                );
            case 'STORE_HEADER':
                return <StoreHeader data={block.data[0]} />;
            default:
                return null;
        }
    };

    return (
        <div className={cn("flex flex-col gap-1.5 md:gap-2", className)}>
            {blocks.map(block => {
                if (!block.data && block.type !== 'INFINITE_GRID' && block.type !== 'CIRCLE_RAIL') return null;

                return (
                    <section key={block.id} className={cn("px-4 md:px-8 max-w-[1440px] mx-auto w-full", block.type === 'BANNER_BENTO' ? "pt-1 pb-0.5" : "py-1.5")}>
                        {block.title && block.type !== 'BANNER_BENTO' && (
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h2 className="text-lg md:text-xl font-black text-zinc-950 tracking-tighter leading-none">
                                        {block.title}
                                    </h2>
                                    {block.subtitle && (
                                        <p className="text-[10px] font-black text-zinc-500 tracking-tight mt-1 px-1 border-l-2 border-[var(--primary)]">
                                            {block.subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <Suspense fallback={<div className="h-24 animate-pulse bg-zinc-50 rounded-xl" />}>
                            {renderBlock(block)}
                        </Suspense>
                    </section>
                );
            })}
        </div>
    );
}
