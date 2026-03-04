'use client';

import React, { useState } from 'react';
import { Sparkles, Camera, Image as ImageIcon, FileText, Share2, History, ChevronRight, Eye, Timer, Loader2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { toast } from 'sonner';
import { SubmittedPersonalization } from './SubmittedPersonalization';
import Image from 'next/image';
import { HistoryTrail } from './HistoryTrail';

import { ORDER_STATUS } from '@/lib/types/order-status';
import { HyperlocalTimer } from '@/components/ui/HyperlocalTimer';
import { OrderDetail, PreviewSubmission, OrderProductDetail } from '@/lib/types/order';

interface CreativeBriefProps {
    order: OrderDetail;
    previews: PreviewSubmission[];
    timeline: any[];
    onOpenPersonalization?: () => void;
    isOptimisticSubmitted?: boolean;
    onOpenPreview?: (product: OrderProductDetail) => void;
}

/**
 * WYSHKIT 2026: Design Command Center (REFINED)
 * 
 * WYSHKIT 2026 Pattern: Absolute Transparency & Zero Friction
 * - Move "Skip" logic to the main dashboard for minimal clicks.
 * - Add "Approval SLA" countdown (15m) when preview is ready.
 * - Momentum UI: Micro-animations for high-intent states.
 */
export function CreativeBrief({ order, previews, timeline, onOpenPersonalization, isOptimisticSubmitted, onOpenPreview }: CreativeBriefProps) {
    const latestPreview = previews[0];
    const personalizedProducts = order.order_products?.filter(i => i.is_personalized) || [];

    // WYSHKIT 2026: Align with single status truth
    const hasSubmittedBrief = isOptimisticSubmitted ||
        personalizedProducts.some(product =>
            ['submitted', 'preview_ready', 'revision_requested', 'approved'].includes(product.personalization_status || order.personalization_status || '') ||
            product.personalization_details
        );

    // Calculate Approval SLA (15 mins from preview ready)
    const approvalDeadline = React.useMemo(() => {
        if (order.personalization_status !== 'preview_ready' || !latestPreview?.submitted_at) return null;
        return new Date(new Date(latestPreview.submitted_at).getTime() + 15 * 60000).toISOString();
    }, [order.personalization_status, latestPreview?.submitted_at]);

    if (personalizedProducts.length === 0) return null;

    return (
        <section className="flex flex-col gap-8 animate-in fade-in duration-700">
            {/* Design Previews Milestone (High Impact) */}
            <div className="space-y-4">
                {previews.length > 0 ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <div className="size-5 rounded-[var(--radius-md)] bg-[var(--text-primary)] flex items-center justify-center">
                                    <Sparkles className="size-3 text-[var(--warning)]" />
                                </div>
                                <span className="text-xs font-bold text-[var(--text-primary)] tracking-tight">
                                    Status: {order.personalization_status === 'preview_ready' ? 'Preview Awaiting Action' : 'In Progress'}
                                </span>
                            </div>
                            {approvalDeadline && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full border border-rose-100 animate-pulse">
                                    <Timer className="size-3 text-rose-600" />
                                    <HyperlocalTimer
                                        deadline={approvalDeadline}
                                        variant="minimal"
                                        className="text-xs font-bold text-rose-600 p-0 shadow-none bg-transparent"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Quick View Carousel */}
                        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 pb-2">
                            {previews.map((preview, idx) => (
                                <div key={preview.id} className="relative aspect-[4/3] w-[85%] shrink-0 snap-center rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] shadow-sm shadow-[var(--shadow-sm)]/50 bg-[var(--surface-muted)] group">
                                    <Image
                                        src={preview.preview_url}
                                        alt={`Design iteration ${previews.length - idx}`}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Iteration Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-[var(--foreground)]/40 backdrop-blur-md rounded-full border border-[var(--text-inverse)]/20 flex items-center gap-1.5">
                                        <div className={cn("size-1.5 rounded-full", idx === 0 ? "bg-[var(--warning)] animate-pulse" : "bg-[var(--text-tertiary)]")} />
                                        <p className="text-xs font-bold text-[var(--text-inverse)] tracking-tight">
                                            {idx === 0 ? 'Latest' : `Ver. ${previews.length - idx}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* WYSHKIT 2026: 1-Tap Actionability */}
                        {order.personalization_status === 'preview_ready' && onOpenPreview && (
                            <button
                                onClick={() => {
                                    triggerHaptic(HapticPattern.ACTION);
                                    const previewProduct = personalizedProducts.find(p => p.status === 'MOCKUP_READY' || p.personalization_status === 'preview_ready');
                                    if (previewProduct) {
                                        onOpenPreview(previewProduct as OrderProductDetail);
                                    }
                                }}
                                className="w-full h-12 mt-2 bg-[var(--text-primary)] text-[var(--text-inverse)] rounded-[var(--radius-md)] flex items-center justify-center gap-2 text-sm font-bold tracking-tight active:scale-95 transition-all shadow-sm shadow-[var(--text-primary)]/10 group"
                            >
                                <Eye className="size-4" />
                                Review & Approve
                                <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center gap-4 bg-[var(--surface-muted)]/50 rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden relative">
                        {/* WYSHKIT 2026: Animated Pulse Background for high-impact action */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)] to-transparent opacity-50" />
                        <div className="size-16 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-sm relative z-10">
                            {hasSubmittedBrief ? (
                                <div className="relative">
                                    <Clock className="size-8 text-[var(--text-tertiary)]" />
                                    <div className="absolute inset-0 size-8 border-2 border-[var(--border)] border-t-[var(--text-tertiary)] rounded-full animate-spin opacity-20" />
                                </div>
                            ) : (
                                <Sparkles className="size-8 text-[var(--border)]" />
                            )}
                        </div>
                        <div className="space-y-3 px-6 relative z-10">
                            <div>
                                {hasSubmittedBrief ? (
                                    <>
                                        <p className="text-xs font-bold text-[var(--text-primary)] tracking-tight leading-none">Brief Received</p>
                                        <p className="text-xs font-bold text-[var(--text-tertiary)] mt-2 max-w-[220px] mx-auto leading-relaxed">
                                            Your vendor is reviewing your vision. First preview expected shortly.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs font-bold text-[var(--text-primary)] tracking-tight leading-none">Creative Process Pending</p>
                                        <p className="text-xs font-bold text-[var(--text-tertiary)] mt-2 max-w-[220px] mx-auto leading-relaxed">
                                            Share your vision to start the bespoke crafting process.
                                        </p>
                                    </>
                                )}
                            </div>

                            {onOpenPersonalization && personalizedProducts.some(product => {
                                const s = (product.status || ORDER_STATUS.PLACED).toUpperCase();
                                const activeStates: string[] = [ORDER_STATUS.PLACED, ORDER_STATUS.CONFIRMED];
                                return activeStates.includes(s) && !product.personalization_details && !isOptimisticSubmitted;
                            }) && (
                                    <button
                                        onClick={() => {
                                            triggerHaptic(HapticPattern.ACTION);
                                            onOpenPersonalization();
                                        }}
                                        className="px-8 py-3 bg-[var(--text-primary)] text-[var(--text-inverse)] rounded-[var(--radius-md)] text-xs font-bold tracking-tight hover:bg-[var(--foreground)] active:scale-95 transition-all shadow-sm shadow-[var(--text-primary)]/10"
                                    >
                                        Complete Brief
                                    </button>
                                )}
                        </div>
                    </div>
                )}
            </div>

            {/* The 3-Layer History Trail */}
            <HistoryTrail
                orderProducts={order.order_products || []}
                previews={previews}
                timeline={timeline}
            />
        </section>
    );
}


