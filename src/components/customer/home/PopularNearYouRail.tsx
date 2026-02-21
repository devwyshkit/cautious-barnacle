'use client';

import React from 'react';
import { ItemCard } from '@/components/customer/ItemCard';
import { Sparkles } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

import { WyshkitItem } from '@/lib/types/item';

interface PopularNearYouRailProps {
    items: WyshkitItem[];
}

export function PopularNearYouRail({ items }: PopularNearYouRailProps) {
    if (items.length === 0) return null;

    return (
        <section className="px-4 py-12 md:px-8 border-y border-border/50 bg-background overflow-hidden relative">
            {/* Background decoration - Static only for zero JS/GPU overhead */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <Sparkles className="size-64 rotate-12 text-foreground" />
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1.5">
                        <h2 className="text-3xl md:text-5xl font-black text-zinc-950 uppercase tracking-tighter leading-none italic skew-x-[-4deg]">
                            Popular <span className="text-[var(--primary)]">Near You</span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-[var(--primary)] px-2.5 py-1 rounded-sm shadow-sm">
                                <span className="size-1 bg-white rounded-full animate-ping" />
                                <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] leading-none">Live Trends</span>
                            </div>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2 border-l border-zinc-200">Neighborhood Favorites</span>
                        </div>
                    </div>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        dragFree: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {items.map((item, index) => (

                            <CarouselItem
                                key={`${item.id}-${index}`}
                                className="pl-2 md:pl-4 basis-[200px] sm:basis-[240px] animate-in slide-in-from-bottom-8 duration-700 fill-mode-backwards"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <ItemCard
                                    item={item}
                                    className="bg-card border-border/50 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500"
                                    variant="default"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}
