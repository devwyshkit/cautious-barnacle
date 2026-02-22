'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { EntityCard } from '@/components/ui/EntityCard';

interface PartnerGroupedGridProps {
    data: any[];
    onQuickLook?: (id: string, type: any) => void;
}

export function PartnerGroupedGrid({ data, onQuickLook }: PartnerGroupedGridProps) {
    if (!data || data.length === 0) return null;

    const groupedData = data.reduce((acc: any, item: any) => {
        const pId = item.partner_id || '';
        if (!acc[pId]) acc[pId] = { partnerName: item.partner_name || 'Local Store', items: [] };
        acc[pId].items.push(item);
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {Object.entries(groupedData).map(([pId, group]: [string, any]) => (
                <div
                    key={pId}
                    className="p-4 bg-zinc-50/50 rounded-[32px] border border-zinc-100 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-500 group"
                >
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div>
                            <h3 className="text-[13px] font-black text-zinc-950 tracking-tight group-hover:text-[var(--primary)] transition-colors">
                                {group.partnerName}
                            </h3>
                            <p className="text-[11px] font-bold text-zinc-400 tracking-wider mt-0.5">
                                {group.items.length} {group.items.length === 1 ? 'Item' : 'Items'}
                            </p>
                        </div>
                        <Link
                            href={`/partner/${pId}`}
                            className="text-[11px] font-black text-zinc-400 tracking-wider hover:text-zinc-950 transition-colors bg-white px-2 py-1 rounded-md border border-zinc-100 shadow-sm"
                        >
                            Visit Store
                        </Link>
                    </div>
                    <div className={cn("grid gap-3", group.items.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                        {group.items.slice(0, 4).map((item: any) => (
                            <EntityCard key={item.id} type="item" data={item} variant="portrait" className="bg-white" onQuickLook={onQuickLook} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
