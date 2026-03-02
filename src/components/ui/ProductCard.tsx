'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { AddToCartButton } from '@/components/customer/AddToCartButton';
import { cn } from '@/lib/utils';
import type { WyshkitProduct } from '@/lib/types/product';

interface ProductCardProps {
    data: WyshkitProduct;
    className?: string;
    variant?: 'portrait' | 'landscape' | 'row';
}

export function ProductCard({ data, className, variant = 'portrait' }: ProductCardProps) {
    const isPortrait = variant === 'portrait';
    const isRow = variant === 'row';
    const vendorId = data.vendor_id;
    const productPath = `/vendor/${vendorId}/product/${data.id}`;

    return (
        <Card className={cn(
            "overflow-hidden border-none shadow-none group transition-all duration-300",
            isRow ? "flex flex-row gap-[var(--space-4)] p-[var(--space-2)]" : "flex flex-col gap-[var(--space-2)]",
            className
        )}>
            <Link href={productPath} className="contents">
                <div className={cn(
                    "relative rounded-[var(--radius-lg)] overflow-hidden bg-[var(--surface-muted)]",
                    isPortrait ? "aspect-square w-full" : "aspect-square w-24 shrink-0"
                )}>
                    {(() => {
                        const productImage = data.images?.[0] || data.image_url;
                        if (!productImage) return (
                            <div className="flex items-center justify-center h-full bg-[var(--surface-muted)]">
                                <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Wysh</span>
                            </div>
                        );
                        return (
                            <Image
                                src={productImage}
                                alt={data.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 30vw, 200px"
                            />
                        );
                    })()}
                </div>
            </Link>

            <div className={cn("flex flex-col", isRow ? "flex-1 justify-center" : "")}>
                <Link href={productPath}>
                    <h3 className="text-xs font-bold text-[var(--text-primary)] truncate tracking-tight hover:text-[var(--primary)] transition-colors">
                        {data.name}
                    </h3>
                </Link>
                <div className="flex items-center justify-between mt-[var(--space-1)]">
                    <span className="text-xs font-bold text-[var(--text-primary)] tabular-nums">₹{data.base_price}</span>
                    <AddToCartButton
                        product_id={data.id}
                        product_name={data.name}
                        product_image={data.images?.[0] || data.image_url}
                        unit_price={data.base_price}
                        vendor_id={data.vendor_id}
                        vendor_name={data.vendor_name || 'Store'}
                        className="h-7 w-16 text-xs font-bold tracking-widest uppercase"
                        has_personalization={!!(data.personalization_options as any[] | null)?.length}
                    />
                </div>
            </div>
        </Card>
    );
}
