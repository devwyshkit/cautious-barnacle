'use client';

import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { ItemCard } from '@/components/ui/ItemCard';
import { PartnerCard } from '@/components/ui/PartnerCard';

interface CardRailProps {
    data: any[];
}

export function CardRail({ data }: CardRailProps) {
    if (!data || data.length === 0) return null;

    return (
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-4">
                {data.map((item, index) => {
                    const isItem = !!item.partner_id;
                    return (
                        <CarouselItem key={item.id} className="pl-4 basis-[200px] sm:basis-[240px]">
                            {isItem ? (
                                <ItemCard
                                    data={item}
                                    variant="portrait"
                                    className="hover:shadow-sm transition-all duration-500"
                                />
                            ) : (
                                <PartnerCard
                                    data={item}
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
