'use client';

import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { EntityCard } from '@/components/ui/EntityCard';

interface CardRailProps {
    data: any[];
}

export function CardRail({ data }: CardRailProps) {
    if (!data || data.length === 0) return null;

    return (
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-4">
                {data.map((item) => (
                    <CarouselItem key={item.id} className="pl-4 basis-[200px] sm:basis-[240px]">
                        <EntityCard
                            type={item.partner_id ? 'item' : 'partner'}
                            data={item}
                            variant="portrait"
                            className="surface-card hover:shadow-xl transition-all duration-500"
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
