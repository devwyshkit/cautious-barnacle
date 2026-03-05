'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ShareButton } from '@/components/ui/ShareButton';
import { formatPrepTime } from '@/lib/utils/sla';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { AppHeading, AppText } from '@/components/ui/Typography';

const FALLBACK_IMAGE = '/images/logo.png';

interface StoreHeaderProps {
    data: {
        id: string;
        name: string;
        slug: string;
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
        <div className="relative w-full bg-[var(--surface)] pb-[var(--space-4)]">
            {/* Minimal Background Banner */}
            <div className="relative aspect-[4/1] md:aspect-[5/1] w-full bg-[var(--surface-muted)] overflow-hidden">
                <Image
                    src={data.image_url || FALLBACK_IMAGE}
                    alt={data.name}
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-transparent" />

                {/* Back Button */}
                <button
                    onClick={() => {
                        triggerHaptic(HapticPattern.ACTION);
                        router.back();
                    }}
                    className="absolute top-[var(--space-4)] left-[var(--space-4)] z-20 size-11 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border)] shadow-[var(--shadow-md)] active:scale-95 transition-all"
                >
                    <ArrowLeft className="size-5" />
                </button>
            </div>

            {/* Content Layer - Extreme Density */}
            <div className="-mt-[var(--space-12)] relative z-10 px-[var(--space-4)] max-w-7xl mx-auto">
                <div className="flex items-end justify-between gap-[var(--space-4)]">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-1)]">
                            <div className="size-16 rounded-[var(--radius-2xl)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-xl)] overflow-hidden shrink-0 relative">
                                <Image
                                    src={data.image_url || FALLBACK_IMAGE}
                                    alt={data.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <AppHeading level={1} className="text-xl md:text-2xl mb-[var(--space-1)]">
                                    {data.name}
                                </AppHeading>
                                <div className="flex items-center gap-[var(--space-1-5)] text-[var(--text-tertiary)]">
                                    <MapPin className="size-2.5 text-[var(--primary)]" />
                                    <AppText variant="caption" weight="medium">{data.city || 'Local Store'}</AppText>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-[var(--space-2)] pb-[var(--space-1)]">
                        <ShareButton
                            title={data.name}
                            url={`/vendor/${(data as any).slug || data.id}`}
                            className="bg-[var(--surface-muted)] size-9 rounded-[var(--radius-xl)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all"
                        />
                        {data.rating && (
                            <div className="bg-[var(--foreground)] px-[var(--space-2-5)] py-[var(--space-1-5)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] flex flex-col items-center min-w-[44px]">
                                <div className="flex items-center gap-[var(--space-0-5)]">
                                    <AppText weight="bold" className="text-sm text-[var(--text-inverse)] leading-none">{data.rating.toFixed(1)}</AppText>
                                    <Star className="size-2.5 fill-[var(--text-inverse)] text-[var(--text-inverse)]" />
                                </div>
                                <AppText variant="metadata" className="text-[var(--text-inverse)]/70 mt-[var(--space-0-5)] whitespace-nowrap">Rating</AppText>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-[var(--space-3)] mt-[var(--space-4)]">
                    <div className="flex items-center gap-[var(--space-1-5)] px-[var(--space-2-5)] py-[var(--space-1-5)] rounded-[var(--radius-md)] bg-[var(--well-success)] border border-[var(--success)]/10">
                        <Clock className="size-3 text-[var(--success)]" />
                        <AppText variant="caption" weight="medium">{etaText}</AppText>
                    </div>

                </div>
            </div>

            <div className="h-px bg-[var(--surface-muted)] mt-[var(--space-6)] mx-[var(--space-4)] md:mx-0" />
        </div>
    );
}
