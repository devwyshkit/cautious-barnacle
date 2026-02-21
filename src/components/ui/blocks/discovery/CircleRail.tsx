'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { cn } from '@/lib/utils';

interface CircleRailProps {
    data: any[];
}

export function CircleRail({ data }: CircleRailProps) {
    const searchParams = useSearchParams();
    const selectedCategory = searchParams?.get('category') || null;
    const isAllSelected = selectedCategory === null;

    if (!data || data.length === 0) return null;

    return (
        <div className="flex gap-8 md:gap-10 overflow-x-auto no-scrollbar py-4 pb-2 px-1">
            {/* "All" Category Button */}
            <Link
                href="/"
                onClick={() => triggerHaptic(HapticPattern.ACTION)}
                className="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-all duration-200"
                scroll={false}
                prefetch={false}
            >
                <div className={cn(
                    "size-[68px] md:size-[84px] rounded-full overflow-hidden bg-zinc-100/50 relative transition-all duration-300 flex items-center justify-center group-hover:bg-zinc-100",
                    isAllSelected
                        ? "ring-2 ring-zinc-900 ring-offset-2"
                        : "border border-zinc-100/30"
                )}>
                    <LayoutGrid className={cn(
                        "size-6 transition-colors",
                        isAllSelected ? "text-zinc-900" : "text-zinc-400"
                    )} />
                </div>
                <span className={cn(
                    "text-[10px] md:text-[11px] font-bold tracking-tight text-center leading-tight transition-colors",
                    isAllSelected ? "text-zinc-900" : "text-zinc-600"
                )}>
                    All
                </span>
            </Link>

            {/* Dynamic Categories */}
            {data.map((item) => {
                const isSelected = selectedCategory === item.slug;

                return (
                    <Link
                        key={item.id}
                        href={item.slug?.startsWith('/') ? item.slug : `/?category=${item.slug}`}
                        onClick={() => triggerHaptic(HapticPattern.ACTION)}
                        className="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-all duration-200"
                        scroll={false}
                        prefetch={false}
                    >
                        <div className={cn(
                            "size-[68px] md:size-[84px] rounded-full overflow-hidden bg-zinc-50 relative transition-all duration-300 group-hover:shadow-lg group-hover:shadow-zinc-200/50",
                            isSelected
                                ? "ring-2 ring-zinc-900 ring-offset-2"
                                : "border border-zinc-100/30"
                        )}>
                            {item.image_url ? (
                                <Image
                                    src={item.image_url}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    sizes="(max-width: 768px) 64px, 80px"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-zinc-100">
                                    <LayoutGrid className="size-6 text-zinc-300" />
                                </div>
                            )}
                        </div>
                        <span className={cn(
                            "text-[10px] md:text-[11px] font-bold tracking-tight text-center leading-tight max-w-[64px] md:max-w-[80px] line-clamp-1 transition-colors",
                            isSelected ? "text-zinc-900" : "text-zinc-600"
                        )}>
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
