'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { triggerHaptic, HapticPattern, cn, formatCurrency, formatPrepTime } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { AddToCartButton } from '@/components/customer/AddToCartButton';
import { useUI } from '@/providers/UIProvider';
import type { WyshkitProduct } from '@/lib/types/product';
import { logger } from '@/lib/logging/logger';

interface ProductCardProps {
    data: WyshkitProduct;
    className?: string;
    variant?: 'portrait' | 'landscape' | 'row';
}

export function ProductCard({ data, className, variant = 'portrait' }: ProductCardProps) {
    const isPortrait = variant === 'portrait';
    const isRow = variant === 'row';
    const vendorIdentifier = data.vendor_slug || (data as any).v_slug;
    const productSlug = data.slug;

    // WYSHKIT 2026: Slug-First Audit Guard
    const isUuid = (str?: string) => str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    if (isUuid(vendorIdentifier) || isUuid(productSlug)) {
        logger.error(`[WYSHKIT 2026 P0] Slug-First Violation: Detected UUID in URL construction.`, undefined, {
            vendor: vendorIdentifier,
            product: productSlug
        });
    }

    const { openProductSheet } = useUI();
    const productPath = vendorIdentifier && productSlug ? `/vendor/${vendorIdentifier}/product/${productSlug}` : '#';
    const etaMins = data.vendor_prep_time;
    const router = useRouter();

    const handleProductClick = (e: React.MouseEvent) => {
        e.preventDefault();
        triggerHaptic(HapticPattern.ACTION);
        openProductSheet(data);
    };

    return (
        <Card className={cn(
            "overflow-hidden border border-[var(--border)] shadow-[var(--shadow-xs)] group transition-all duration-500 active:scale-[0.98] relative rounded-[var(--radius-xl)] bg-[var(--surface)] hover:border-[var(--primary-ring)]/40",
            isRow ? "flex flex-row gap-3 p-1.5" : "flex flex-col gap-1.5",
            className
        )}>
            {/* Background Action for Product Sheet */}
            <button
                onClick={handleProductClick}
                className="absolute inset-0 z-0 text-left cursor-pointer appearance-none bg-transparent border-none p-0 w-full"
                aria-label={`View ${data.name}`}
            />
            <div className={cn(
                "relative overflow-hidden bg-[var(--surface-muted)] z-10 pointer-events-none",
                isPortrait ? "aspect-square w-full rounded-t-[calc(var(--radius-xl)-2px)]" : "aspect-square w-20 shrink-0 rounded-[var(--radius-lg)]"
            )}>
                {(() => {
                    const productImage = data.image_url ?? data.images?.[0];
                    if (!productImage) return (
                        <div className="flex items-center justify-center h-full bg-[var(--surface-muted)]">
                            <span className="text-[10px] font-bold text-[var(--text-tertiary)] tracking-tight">WyshKit</span>
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
                {etaMins && (
                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-[var(--surface)]/90 backdrop-blur-md rounded-[var(--radius-sm)] shadow-[var(--shadow-xs)] flex items-center gap-1 pointer-events-none">
                        <Clock className="size-2 text-[var(--text-primary)]" />
                        <span className="text-[9px] font-bold text-[var(--text-primary)] tracking-tight">
                            {formatPrepTime(etaMins)}
                        </span>
                    </div>
                )}
            </div>

            <div className={cn("flex flex-col z-10 pointer-events-none px-2.5 pb-2.5", isRow ? "flex-1 justify-center pr-1.5" : "")}>
                <h3 className="text-[13px] font-bold text-[var(--text-primary)] truncate tracking-tight group-hover:text-[var(--primary)] transition-colors leading-tight">
                    {data.name}
                </h3>
                <div className="flex items-center justify-between mt-1 z-20 relative pointer-events-auto">
                    <span className="text-xs font-black text-[var(--text-primary)] tabular-nums">{formatCurrency(data.base_price)}</span>
                    <AddToCartButton
                        product_id={data.id}
                        product_name={data.name}
                        product_slug={data.slug}
                        product_image={data.image_url ?? data.images?.[0]}
                        unit_price={data.base_price}
                        vendor_id={data.vendor_id}
                        vendor_name={data.vendor_name || 'Store'}
                        vendor_slug={data.vendor_slug}
                        className="h-7 min-w-[30px] px-2"
                        has_personalization={!!(data.personalization_options as any[] | null)?.length}
                    />
                </div>
            </div>
        </Card>
    );
}
