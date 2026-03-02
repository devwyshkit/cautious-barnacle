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
        prep_mins?: number;
        eta_minutes?: number;
    };
}

export function StoreHeader({ data }: StoreHeaderProps) {
    const router = useRouter();
    const etaText = data.eta_minutes ? `~${data.eta_minutes} MIN` : data.prep_mins ? formatPrepTime(data.prep_mins) : null;

    return (
        <div className="relative w-full bg-[var(--surface)] pb-4">
            {/* Minimal Background Banner */}
            <div className="relative aspect-[4/1] md:aspect-[5/1] w-full bg-[var(--surface-muted)] overflow-hidden">
                <Image
                    src={data.image_url || FALLBACK_IMAGE}
                    alt={data.name}
                    fill
                    className="object-cover opacity-60 grayscale blur-sm"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-transparent" />

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 z-20 size-8 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border)] shadow-sm active:scale-95 transition-all"
                >
                    <ArrowLeft className="size-4" />
                </button>
            </div>

            {/* Content Layer - Extreme Density */}
            <div className="-mt-12 relative z-10 px-4 max-w-[1200px] mx-auto">
                <div className="flex items-end justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="size-16 rounded-[var(--radius-2xl)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-xl)] overflow-hidden shrink-0 relative">
                                <Image
                                    src={data.image_url || FALLBACK_IMAGE}
                                    alt={data.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tighter leading-none mb-1">
                                    {data.name}
                                </h1>
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">
                                    <MapPin className="size-2.5 text-[var(--primary)]" />
                                    <span>{data.city || 'Local Store'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 pb-1">
                        <ShareButton
                            title={data.name}
                            url={`/vendor/${data.id}`}
                            className="bg-[var(--surface-muted)] size-9 rounded-[var(--radius-xl)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all"
                        />
                        {data.rating && (
                            <div className="bg-[var(--foreground)] px-2.5 py-1.5 rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] flex flex-col items-center min-w-[44px]">
                                <div className="flex items-center gap-0.5">
                                    <span className="text-sm font-black text-[var(--text-inverse)] leading-none">{data.rating.toFixed(1)}</span>
                                    <Star className="size-2.5 fill-[var(--text-inverse)] text-[var(--text-inverse)]" />
                                </div>
                                <span className="text-[var(--text-tiny)] font-black text-[var(--text-inverse)]/60 uppercase tracking-tighter mt-0.5 whitespace-nowrap">Rating</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--well-success)] border border-[var(--success)]/10">
                        <Clock className="size-3 text-[var(--success)]" />
                        <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">{etaText}</span>
                    </div>

                </div>
            </div>

            <div className="h-px bg-[var(--surface-muted)] mt-6 mx-4 md:mx-0" />
        </div>
    );
}
