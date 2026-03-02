'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/ui/ProductCard';

interface VendorGroupedGridProps {
    data: any[];
    title?: string;
    subtitle?: string;
    context?: any;
}

export function VendorGroupedGrid({ data, title, subtitle, context }: VendorGroupedGridProps) {
    if (!data || data.length === 0) return null;

    const groupedData = data.reduce((acc: any, product: any) => {
        const vId = product.vendor_id || '';
        if (!acc[vId]) acc[vId] = { vendorName: product.vendor_name || 'Local Store', products: [] };
        acc[vId].products.push(product);
        return acc;
    }, {});

    return (
        <div className="flex flex-col gap-3">
            {title && (
                <div className="flex flex-col gap-0.5 mb-1 px-1">
                    <h2 className="text-sm font-bold text-[var(--text-primary)] tracking-widest uppercase">{title}</h2>
                    {subtitle && <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-tight">{subtitle}</p>}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {Object.entries(groupedData).map(([vId, group]: [string, any]) => (
                    <div
                        key={vId}
                        className="p-2.5 bg-[var(--surface-muted)]/50 rounded-[var(--radius-lg)] border border-[var(--border)]/80 hover:bg-[var(--surface)] hover:shadow-sm transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-2.5 px-0.5">
                            <div className="min-w-0">
                                <h3 className="text-xs font-bold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--primary)] transition-colors truncate">
                                    {group.vendorName}
                                </h3>
                            </div>
                            <Link
                                href={`/vendor/${vId}`}
                                className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight hover:text-[var(--text-primary)] transition-colors bg-[var(--surface)] px-2 py-1 rounded-[var(--radius-sm)] border border-[var(--border)] shadow-sm uppercase shrink-0"
                            >
                                Shop
                            </Link>
                        </div>
                        <div className={cn("grid gap-2", group.products.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                            {group.products.slice(0, 4).map((product: any) => (
                                <ProductCard key={product.id} data={product} variant="portrait" className="bg-[var(--surface)]" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
