'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ShareButton } from '@/components/ui/ShareButton';
import { formatPrepTime } from '@/lib/utils/sla';

const FALLBACK_IMAGE = '/images/logo.png';

interface StoreHeaderProps {
    data: {
        id: string;
        name: string;
        image_url?: string;
        rating?: number;
        city?: string;
        prep_hours?: number;
    };
}

export function StoreHeader({ data }: StoreHeaderProps) {
    const router = useRouter();
    const prepTimeText = formatPrepTime(data.prep_hours || 0.75);

    return (
        <div className="relative w-full bg-white pb-4">
            {/* Minimal Background Banner */}
            <div className="relative aspect-[4/1] md:aspect-[5/1] w-full bg-zinc-100 overflow-hidden">
                <Image
                    src={data.image_url || FALLBACK_IMAGE}
                    alt={data.name}
                    fill
                    className="object-cover opacity-60 grayscale blur-sm"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 z-20 size-8 rounded-full bg-white flex items-center justify-center text-zinc-900 border border-zinc-100 shadow-sm active:scale-95 transition-all"
                >
                    <ArrowLeft className="size-4" />
                </button>
            </div>

            {/* Content Layer - Extreme Density */}
            <div className="-mt-12 relative z-10 px-4 max-w-[1200px] mx-auto">
                <div className="flex items-end justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="size-16 rounded-2xl bg-white border border-zinc-100 shadow-xl overflow-hidden shrink-0 relative">
                                <Image
                                    src={data.image_url || FALLBACK_IMAGE}
                                    alt={data.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-2xl font-black text-zinc-950 tracking-tighter leading-none mb-1">
                                    {data.name}
                                </h1>
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                    <MapPin className="size-3 text-zinc-300" />
                                    <span>{data.city || 'Local Store'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 pb-1">
                        <ShareButton
                            title={data.name}
                            url={`/store/${data.id}`}
                            className="bg-zinc-50 size-9 rounded-xl flex items-center justify-center text-zinc-900 border border-zinc-100 hover:bg-zinc-100 transition-all"
                        />
                        {data.rating && (
                            <div className="bg-zinc-950 px-2.5 py-1.5 rounded-xl shadow-lg flex flex-col items-center min-w-[44px]">
                                <div className="flex items-center gap-0.5">
                                    <span className="text-[13px] font-black text-white leading-none">{data.rating.toFixed(1)}</span>
                                    <Star className="size-2.5 fill-white text-white" />
                                </div>
                                <span className="text-[7px] font-black text-zinc-500 uppercase tracking-tighter mt-0.5 whitespace-nowrap">Rating</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-100">
                        <Clock className="size-3 text-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-900 uppercase tracking-tight">{prepTimeText} prep</span>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-zinc-50 border border-zinc-100">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tight">Standard Delivery</span>
                    </div>
                </div>
            </div>

            <div className="h-px bg-zinc-100 mt-6 mx-4 md:mx-0" />
        </div>
    );
}
