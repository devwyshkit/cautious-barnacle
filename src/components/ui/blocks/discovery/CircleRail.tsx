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
    context?: any;
}

export function CircleRail({ data, context }: CircleRailProps) {
    const searchParams = useSearchParams();
    const selectedCategory = context?.selected_category || searchParams?.get('category') || null;

    // Robustness: If no data, show Recommended.
    const categories = data && data.length > 0 ? data : [
        { id: 'all', name: 'Recommended', slug: 'Recommended', image_url: null }
    ];

    return (
        <div className="flex gap-3 md:gap-5 overflow-x-auto no-scrollbar py-2 px-0.5">
            {/* Dynamic Categories */}
            {categories.map((item: any) => {
                const isSelected = selectedCategory === item.slug;

                return (
                    <Link
                        key={item.id}
                        href={item.slug?.startsWith('/') ? item.slug : `/?category=${item.slug}`}
                        onClick={() => triggerHaptic(HapticPattern.ACTION)}
                        scroll={false}
                        className="outline-none"
                    >
                        <div className="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-all duration-300">
                            <div className={cn(
                                "size-14 md:size-16 rounded-full overflow-hidden relative transition-all duration-500 border-2",
                                isSelected
                                    ? "border-zinc-900 bg-white"
                                    : "border-transparent bg-zinc-50"
                            )}>
                                {item.image_url ? (
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        fill
                                        className={cn(
                                            "object-cover transition-all duration-700 ease-in-out group-hover:scale-110",
                                            isSelected ? "scale-90" : "scale-100"
                                        )}
                                        sizes="(max-width: 768px) 56px, 64px"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <LayoutGrid className="size-5 text-zinc-300" />
                                    </div>
                                )}
                            </div>
                            <span className={cn(
                                "text-[10px] font-black tracking-tight text-center leading-tight max-w-[64px] md:max-w-[80px] line-clamp-1 transition-colors",
                                isSelected ? "text-zinc-950" : "text-zinc-400"
                            )}>
                                {item.name === 'ALL' ? (
                                    <span className="text-[10px] font-black tracking-widest text-[#D91B24]">All</span>
                                ) : (
                                    item.name
                                )}
                            </span>
                        </div>
                    </Link>
                );
            })}

            {/* Empty State Fallback if totally empty */}
            {categories.length === 0 && (
                <div className="flex gap-4 animate-pulse">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                            <div className="size-[68px] md:size-[80px] rounded-full bg-zinc-50" />
                            <div className="h-2 w-10 bg-zinc-50 rounded" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
