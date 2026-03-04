'use client';

import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { ProductCard } from '@/components/ui/ProductCard';
import { VendorCard } from '@/components/ui/VendorCard';

interface CardRailProps {
    data: any[];
}

export function CardRail({ data }: CardRailProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="relative w-full py-[var(--space-1)] isolate">
            <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                <CarouselContent className="-ml-4 pb-[var(--space-4)] -mx-4 px-4 md:mx-0 md:px-0">
                    {data.map((product, index) => {
                        const isProduct = product.type === 'product' || !!product.vendor_id;
                        return (
                            <CarouselItem key={product.id} className="pl-4 basis-[200px] sm:basis-[240px]">
                                {isProduct ? (
                                    <ProductCard
                                        data={product}
                                        variant="portrait"
                                        className="hover:shadow-[var(--shadow-sm)] transition-all duration-500"
                                    />
                                ) : (
                                    <VendorCard
                                        data={product}
                                        className="hover:shadow-[var(--shadow-sm)] transition-all duration-500"
                                    />
                                )}
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
