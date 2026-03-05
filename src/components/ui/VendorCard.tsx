'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Star, Clock } from 'lucide-react';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { cn } from '@/lib/utils';
import { formatPrepTime } from '@/lib/utils/sla';
import type { Tables } from '@/lib/supabase/database.types';

interface VendorCardProps {
    data: Tables<'vendors'>;
    className?: string;
}

export function VendorCard({ data, className }: VendorCardProps) {
    const prepTime = data.avg_prep_time_mins
        ? formatPrepTime(data.avg_prep_time_mins)
        : null;

    return (
        <Link
            href={`/vendor/${data.slug}`}
            onClick={() => triggerHaptic(HapticPattern.ACTION)}
        >
            <Card className={cn(
                "overflow-hidden border border-[var(--border)] shadow-[var(--shadow-sm)] group flex flex-col gap-0 active:scale-[0.98] transition-all duration-300 rounded-[var(--radius-xl)] bg-[var(--surface)] hover:shadow-[var(--shadow-md)] hover:border-[var(--primary-ring)]",
                className
            )}>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--surface-muted)] rounded-t-[var(--radius-xl)]">
                    {data.image_url ? (
                        <Image
                            src={data.image_url}
                            alt={data.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 80vw, 400px"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-[var(--surface-muted)]">
                            <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Vendor</span>
                        </div>
                    )}

                    {prepTime && (
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-[var(--surface)]/90 backdrop-blur-md rounded-[var(--radius-sm)] shadow-[var(--shadow-xs)] flex items-center gap-1 pointer-events-none">
                            <Clock className="size-2.5 text-[var(--text-primary)]" />
                            <span className="text-[10px] font-bold text-[var(--text-primary)] tracking-tight uppercase leading-none">{prepTime}</span>
                        </div>
                    )}
                </div>

                <div className="px-2.5 pb-2.5 pt-2 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[13px] font-bold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--primary)] transition-colors truncate">{data.name}</h3>
                        {data.rating && (
                            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-[var(--success-foreground)] rounded-[var(--radius-xs)] shrink-0">
                                <Star className="size-2 fill-[var(--success)] text-[var(--success)]" />
                                <span className="text-[9px] font-black text-[var(--success)] leading-none">{data.rating}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-tight">{data.city || 'Local Store'}</span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
