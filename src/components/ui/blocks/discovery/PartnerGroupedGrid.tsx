'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ItemCard } from '@/components/ui/ItemCard';

interface PartnerGroupedGridProps {
    data: any[];
    title?: string;
    subtitle?: string;
    context?: any;
}

export function PartnerGroupedGrid({ data, title, subtitle, context }: PartnerGroupedGridProps) {
    if (!data || data.length === 0) return null;

    const groupedData = data.reduce((acc: any, item: any) => {
        const pId = item.partner_id || '';
        if (!acc[pId]) acc[pId] = { partnerName: item.partner_name || 'Local Store', items: [] };
        acc[pId].items.push(item);
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
                {Object.entries(groupedData).map(([pId, group]: [string, any]) => (
                    <div
                        key={pId}
                        className="p-2.5 bg-zinc-50/50 rounded-2xl border border-zinc-100/80 hover:bg-white hover:shadow-sm transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-2.5 px-0.5">
                            <div className="min-w-0">
                                <h3 className="text-[11px] font-black text-zinc-950 tracking-tight group-hover:text-[var(--primary)] transition-colors truncate">
                                    {group.partnerName}
                                </h3>
                            </div>
                            <Link
                                href={`/store/${pId}`}
                                className="text-[9px] font-black text-zinc-400 tracking-tight hover:text-zinc-950 transition-colors bg-white px-2 py-1 rounded-lg border border-zinc-100 shadow-sm uppercase shrink-0"
                            >
                                Shop
                            </Link>
                        </div>
                        <div className={cn("grid gap-2", group.items.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                            {group.items.slice(0, 4).map((item: any) => (
                                <ItemCard key={item.id} data={item} variant="portrait" className="bg-white" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
