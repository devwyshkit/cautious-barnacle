'use client';

import React, { useState } from 'react';
import { Sparkles, Camera, Image as ImageIcon, FileText, Share2, History, ChevronRight, Eye, Timer, Loader2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { toast } from 'sonner';
import { SubmittedIdentity } from './SubmittedIdentity';
import { PreviewSubmission } from '@/lib/types/order';
import Image from 'next/image';

import { ORDER_STATUS } from '@/lib/types/order-status';
import { HyperlocalTimer } from '@/components/ui/HyperlocalTimer';
import { OrderDetail } from '@/lib/types/order';

interface CreativeBriefProps {
    order: OrderDetail;
    previews: PreviewSubmission[];
    onOpenPersonalization?: () => void;
    isOptimisticSubmitted?: boolean;
}

/**
 * WYSHKIT 2026: Design Command Center (REFINED)
 * 
 * Swiggy 2026 Pattern: Absolute Transparency & Zero Friction
 * - Move "Skip" logic to the main dashboard for minimal clicks.
 * - Add "Approval SLA" countdown (15m) when preview is ready.
 * - Momentum UI: Micro-animations for high-intent states.
 */
export function CreativeBrief({ order, previews, onOpenPersonalization, isOptimisticSubmitted }: CreativeBriefProps) {
    const latestPreview = previews[0];
    const personalizedItems = order.order_items?.filter(i => i.is_personalized) || [];

    // WYSHKIT 2026: Align with single status truth
    const hasSubmittedBrief = isOptimisticSubmitted ||
        personalizedItems.some(i =>
            i.status === ORDER_STATUS.DETAILS_RECEIVED ||
            i.personalization_details
        );

    // Calculate Approval SLA (15 mins from preview ready)
    const approvalDeadline = React.useMemo(() => {
        if (order.status !== ORDER_STATUS.PREVIEW_READY || !latestPreview?.submitted_at) return null;
        return new Date(new Date(latestPreview.submitted_at).getTime() + 15 * 60000).toISOString();
    }, [order.status, latestPreview?.submitted_at]);

    if (personalizedItems.length === 0) return null;

    return (
        <section className="flex flex-col gap-6 animate-in fade-in duration-700">
            {/* Design Previews Milestone */}
            <div className="space-y-4">
                {previews.length > 0 ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <div className="size-5 rounded-md bg-zinc-900 flex items-center justify-center">
                                    <Sparkles className="size-3 text-amber-500" />
                                </div>
                                <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">
                                    {previews.length > 1 ? `Latest Design Iterations (${previews.length})` : 'Design Hub • Preview'}
                                </span>
                            </div>
                            {approvalDeadline && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full border border-rose-100 animate-pulse">
                                    <Timer className="size-3 text-rose-600" />
                                    <HyperlocalTimer
                                        deadline={approvalDeadline}
                                        variant="minimal"
                                        className="text-[9px] font-black text-rose-600 p-0 shadow-none bg-transparent"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 pb-2">
                            {previews.map((preview, idx) => (
                                <div key={preview.id} className="relative aspect-[4/3] w-[85%] shrink-0 snap-center rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-xl shadow-zinc-200/50 bg-zinc-50 group">
                                    <Image
                                        src={preview.preview_url}
                                        alt={`Design iteration ${previews.length - idx}`}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Iteration Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                                        <p className="text-[9px] font-black text-white uppercase tracking-widest">
                                            {idx === 0 ? 'Latest' : `Ver. ${previews.length - idx}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center gap-4 bg-zinc-50/50 rounded-[2.5rem] border border-zinc-100 overflow-hidden relative">
                        {/* Swiggy 2026: Animated Pulse Background for high-impact action */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-50" />
                        <div className="size-16 rounded-3xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm relative z-10">
                            {hasSubmittedBrief ? (
                                <div className="relative">
                                    <Clock className="size-8 text-zinc-400" />
                                    <div className="absolute inset-0 size-8 border-2 border-zinc-100 border-t-zinc-400 rounded-full animate-spin opacity-20" />
                                </div>
                            ) : (
                                <Sparkles className="size-8 text-zinc-200" />
                            )}
                        </div>
                        <div className="space-y-3 px-6 relative z-10">
                            <div>
                                {hasSubmittedBrief ? (
                                    <>
                                        <p className="text-[11px] font-black text-zinc-950 uppercase tracking-widest leading-none">Brief Received</p>
                                        <p className="text-[10px] font-bold text-zinc-400 mt-2 max-w-[220px] mx-auto leading-relaxed">
                                            Partner is reviewing your vision. First preview expected shortly.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[11px] font-black text-zinc-950 uppercase tracking-widest leading-none">Creative Process Pending</p>
                                        <p className="text-[10px] font-bold text-zinc-400 mt-2 max-w-[220px] mx-auto leading-relaxed">
                                            Share your vision to start the bespoke crafting process.
                                        </p>
                                    </>
                                )}
                            </div>

                            {onOpenPersonalization && personalizedItems.some(i => {
                                const s = (i.status || ORDER_STATUS.PLACED).toUpperCase();
                                const activeStates: string[] = [ORDER_STATUS.PLACED, ORDER_STATUS.CONFIRMED];
                                return activeStates.includes(s) && !i.personalization_details && !isOptimisticSubmitted;
                            }) && (
                                    <button
                                        onClick={() => {
                                            triggerHaptic(HapticPattern.ACTION);
                                            onOpenPersonalization();
                                        }}
                                        className="px-8 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-xl shadow-zinc-950/10"
                                    >
                                        Complete Brief
                                    </button>
                                )}
                        </div>
                    </div>
                )}
            </div>

            {/* Brief Data Milestone */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <FileText className="size-3 text-zinc-400" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Design Hub • Brief Details</span>
                </div>
                <div className="grid gap-2">
                    {personalizedItems.map(item => (
                        <SubmittedIdentity
                            key={item.id}
                            details={item.personalization_details || {}}
                            itemName={item.item_name}
                            isOptimisticSubmitted={isOptimisticSubmitted}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
