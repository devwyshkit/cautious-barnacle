'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrepTime } from '@/lib/utils/sla';

interface VendorCardProps {
    data: any;
    className?: string;
}

export function VendorCard({ data, className }: VendorCardProps) {
    const prepTime = data.prep_hours
        ? formatPrepTime(data.prep_hours)
        : data.avg_prep_time_mins
            ? formatPrepTime(data.avg_prep_time_mins / 60)
            : null;

    return (
        <Link href={`/vendor/${data.id}`}>
            <Card className={cn(
                "overflow-hidden border-none shadow-none group flex flex-col gap-2.5 active:scale-[0.98] transition-all duration-200",
                className
            )}>
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100">
                    {data.image_url ? (
                        <Image
                            src={data.image_url}
                            alt={data.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 80vw, 400px"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-zinc-50">
                            <span className="text-xs font-black text-zinc-300 uppercase tracking-[0.2em]">Vendor</span>
                        </div>
                    )}

                    {prepTime && (
                        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm flex items-center gap-1.5 pointer-events-none">
                            <Clock className="size-3 text-zinc-950" />
                            <span className="text-[10px] font-black text-zinc-950 tracking-tight uppercase leading-none">{prepTime}</span>
                        </div>
                    )}
                </div>

                <div className="px-0.5 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-zinc-950 tracking-tight group-hover:text-[#D91B24] transition-colors">{data.name}</h3>
                        {data.rating && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 rounded-md">
                                <Star className="size-2.5 fill-green-600 text-green-600" />
                                <span className="text-[10px] font-black text-green-700 leading-none">{data.rating}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-zinc-500 tracking-tight">{data.city || 'Local Store'}</span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
