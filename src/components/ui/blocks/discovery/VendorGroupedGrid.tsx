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
                    <h2 className="text-sm font-black text-zinc-950 tracking-widest uppercase">{title}</h2>
                    {subtitle && <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{subtitle}</p>}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {Object.entries(groupedData).map(([vId, group]: [string, any]) => (
                    <div
                        key={vId}
                        className="p-2.5 bg-zinc-50/50 rounded-2xl border border-zinc-100/80 hover:bg-white hover:shadow-sm transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-2.5 px-0.5">
                            <div className="min-w-0">
                                <h3 className="text-[11px] font-black text-zinc-950 tracking-tight group-hover:text-[var(--primary)] transition-colors truncate">
                                    {group.vendorName}
                                </h3>
                            </div>
                            <Link
                                href={`/store/${vId}`}
                                className="text-[9px] font-black text-zinc-400 tracking-tight hover:text-zinc-950 transition-colors bg-white px-2 py-1 rounded-lg border border-zinc-100 shadow-sm uppercase shrink-0"
                            >
                                Shop
                            </Link>
                        </div>
                        <div className={cn("grid gap-2", group.products.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                            {group.products.slice(0, 4).map((product: any) => (
                                <ProductCard key={product.id} data={product} variant="portrait" className="bg-white" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
