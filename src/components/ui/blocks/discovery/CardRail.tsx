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
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-4">
                {data.map((product, index) => {
                    const isProduct = !!product.vendor_id || !!product.base_price;  // products have vendor_id; fallback: has base_price
                    return (
                        <CarouselItem key={product.id} className="pl-4 basis-[200px] sm:basis-[240px]">
                            {isProduct ? (
                                <ProductCard
                                    data={product}
                                    variant="portrait"
                                    className="hover:shadow-sm transition-all duration-500"
                                />
                            ) : (
                                <VendorCard
                                    data={product}
                                    className="hover:shadow-sm transition-all duration-500"
                                />
                            )}
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
        </Carousel>
    );
}
