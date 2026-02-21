'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { cn } from '@/lib/utils';
import { InfiniteItemsGrid } from '@/components/customer/home/InfiniteItemsGrid';

// Discovery Blocks
const CircleRail = lazy(() => import('./blocks/discovery/CircleRail').then(m => ({ default: m.CircleRail })));
const CardRail = lazy(() => import('./blocks/discovery/CardRail').then(m => ({ default: m.CardRail })));
const BannerBento = lazy(() => import('./blocks/discovery/BannerBento').then(m => ({ default: m.BannerBento })));
const Grid = lazy(() => import('./blocks/discovery/Grid').then(m => ({ default: m.Grid })));
const PartnerGroupedGrid = lazy(() => import('./blocks/discovery/PartnerGroupedGrid').then(m => ({ default: m.PartnerGroupedGrid })));

// Checkout Blocks
const CheckoutItems = lazy(() => import('./blocks/checkout/CheckoutItems').then(m => ({ default: m.CheckoutItems })));
const CheckoutAddress = lazy(() => import('./blocks/checkout/CheckoutAddress').then(m => ({ default: m.CheckoutAddress })));
const CheckoutSummary = lazy(() => import('./blocks/checkout/CheckoutSummary').then(m => ({ default: m.CheckoutSummary })));

export type BlockType = 'CIRCLE_RAIL' | 'CARD_RAIL' | 'GRID' | 'BANNER_BENTO' | 'PARTNER_LIST' | 'PARTNER_GROUPED_GRID' | 'INFINITE_GRID' | 'CHECKOUT_ITEMS' | 'CHECKOUT_ADDRESS' | 'CHECKOUT_PAYMENT' | 'CHECKOUT_SUMMARY';

export interface BlockData {
    id: string;
    type: BlockType;
    title?: string;
    subtitle?: string;
    data: any[];
    metadata?: Record<string, any>;
}

interface BlocksEngineProps {
    blocks: BlockData[];
    className?: string;
}

function useTimeContext(): string | null {
    const [greeting, setGreeting] = useState<string | null>(null);
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('Good morning');
        else if (hour >= 12 && hour < 17) setGreeting('Good afternoon');
        else if (hour >= 17 && hour < 21) setGreeting('Good evening');
        else setGreeting('Late night');
    }, []);
    return greeting;
}

export function BlocksEngine({ blocks, className }: BlocksEngineProps) {
    const timeContext = useTimeContext();

    if (!blocks || blocks.length === 0) return null;

    const renderBlock = (block: BlockData) => {
        switch (block.type) {
            case 'BANNER_BENTO':
                return <BannerBento data={block.data} title={block.title} subtitle={block.subtitle} timeContext={timeContext} />;
            case 'CIRCLE_RAIL':
                return <CircleRail data={block.data} />;
            case 'CARD_RAIL':
                return <CardRail data={block.data} />;
            case 'GRID':
                return <Grid data={block.data} />;
            case 'PARTNER_LIST':
            case 'PARTNER_GROUPED_GRID':
                return <PartnerGroupedGrid data={block.data} />;
            case 'INFINITE_GRID':
                return (
                    <InfiniteItemsGrid
                        initialItems={block.data || []}
                        category={block.metadata?.category || null}
                        totalCount={block.metadata?.totalCount}
                        startOffset={block.data?.length || 0}
                    />
                );
            case 'CHECKOUT_ITEMS':
                return <CheckoutItems data={block.data} />;
            case 'CHECKOUT_ADDRESS':
                return <CheckoutAddress data={block.data} metadata={block.metadata} />;
            case 'CHECKOUT_SUMMARY':
                return <CheckoutSummary metadata={block.metadata} />;
            default:
                return null;
        }
    };

    return (
        <div className={cn("flex flex-col gap-6 md:gap-10", className)}>
            {blocks.map(block => {
                if (!block.data && block.type !== 'INFINITE_GRID') return null;

                return (
                    <section key={block.id} className={cn("px-4 md:px-8 max-w-[1440px] mx-auto w-full", block.type === 'BANNER_BENTO' ? "pt-2 pb-1" : "py-4")}>
                        {/* Block Header */}
                        {block.title && block.type !== 'BANNER_BENTO' && (
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-zinc-950 uppercase tracking-tighter leading-none">
                                        {block.title}
                                    </h2>
                                    {block.subtitle && (
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-2 px-1 border-l-2 border-[var(--primary)]">
                                            {block.subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <Suspense fallback={<div className="h-24 animate-pulse bg-zinc-50 rounded-[32px]" />}>
                            {renderBlock(block)}
                        </Suspense>
                    </section>
                );
            })}
        </div>
    );
}
