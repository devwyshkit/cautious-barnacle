'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { AddToCartButton } from '@/components/customer/AddToCartButton';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    data: any;
    className?: string;
    variant?: 'portrait' | 'landscape' | 'row';
}

export function ProductCard({ data, className, variant = 'portrait' }: ProductCardProps) {
    const isPortrait = variant === 'portrait';
    const isRow = variant === 'row';

    return (
        <Card className={cn(
            "overflow-hidden border-none shadow-none group transition-all duration-300",
            isRow ? "flex flex-row gap-4 p-2" : "flex flex-col gap-2",
            className
        )}>
            <div className={cn(
                "relative rounded-xl overflow-hidden bg-zinc-100",
                isPortrait ? "aspect-square w-full" : "aspect-square w-24 shrink-0"
            )}>
                {(data.images?.[0] || data.image_url) ? (
                    <Image
                        src={data.images?.[0] || data.image_url}
                        alt={data.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 30vw, 200px"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wysh</span>
                    </div>
                )}
            </div>

            <div className={cn("flex flex-col", isRow ? "flex-1 justify-center" : "")}>
                <h3 className="text-xs font-black text-zinc-950 truncate tracking-tight">{data.name}</h3>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-black text-zinc-950 tracking-tighter">₹{data.base_price}</span>
                    <AddToCartButton
                        product_id={data.id}
                        product_name={data.name}
                        product_image={data.images?.[0] || data.image_url}
                        unit_price={data.base_price}
                        vendor_id={data.vendor_id || data.vendor_id}
                        vendor_name={data.vendor_name || data.vendor_name || 'Store'}
                        className="h-7 w-16 text-[9px] font-black tracking-widest uppercase"
                    />
                </div>
            </div>
        </Card>
    );
}
