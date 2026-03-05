'use client';

import React from 'react';
import { FileText, Sparkles, RefreshCw, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { getOrderStatusColor, getOrderStatusDisplay } from '@/lib/types/order-status';

interface HistoryEvent {
    id: string;
    type: string;
    title: string;
    description: string;
    created_at: string;
    metadata?: any;
}

interface HistoryTrailProps {
    orderProducts: any[];
    previews: any[];
    timeline: HistoryEvent[];
}

/**
 * WYSHKIT 2026: The "Creative Journey" History Trail
 * Visualizes the 3-layer trust engine:
 * 1. Your Request (Personalization)
 * 2. What Vendor Sent (Preview)
 * 3. What Changed (Revisions)
 */
export function HistoryTrail({ orderProducts, previews, timeline }: HistoryTrailProps) {
    const personalizedProducts = orderProducts.filter(i => i.is_personalized);

    if (personalizedProducts.length === 0) return null;

    // Filter timeline for relevant creative events
    const creativeEvents = timeline.filter(e =>
        ['DETAILS_RECEIVED', 'PREVIEW_READY', 'CHANGE_REQUESTED', 'APPROVED', 'IN_PRODUCTION'].includes(e.type)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex items-center gap-2 px-1">
                <Clock className="size-3 text-[var(--text-tertiary)]" />
                <span className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight">Personalization Trail</span>
            </div>

            <div className="relative space-y-8 pl-6">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--surface-muted)]" />

                {/* Layer 1: Your Request */}
                {personalizedProducts.map(product => (
                    <div key={product.id} className="relative">
                        <div className="absolute -left-[20px] top-1 size-2.5 rounded-full bg-[var(--text-primary)] ring-4 ring-[var(--surface)] shadow-sm" />
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-[var(--text-primary)] tracking-tight leading-none">Layer 1: Your Request</h4>
                                <span className="text-[var(--text-xxs)] font-bold text-[var(--text-tertiary)] tabular-nums">
                                    {product.details_submitted_at ? format(new Date(product.details_submitted_at), 'h:mm a') : 'Pending'}
                                </span>
                            </div>
                            <div className="bg-[var(--surface)] p-4 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="size-3.5 text-[var(--text-tertiary)]" />
                                    <p className="text-xs font-bold text-[var(--text-primary)]">{product.product_name}</p>
                                </div>
                                {product.personalization_details?.text && (
                                    <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">&quot;{product.personalization_details.text}&quot;</p>
                                )}
                                {product.personalization_details?.image_url && (
                                    <div className="aspect-video rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border)]">
                                        <img src={product.personalization_details.image_url} alt="Design Reference" className="size-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Layer 2 & 3: Previews and Revisions */}
                {previews.map((preview, idx) => (
                    <div key={preview.id} className="relative">
                        <div className={cn(
                            "absolute -left-[20px] top-1 size-2.5 rounded-full ring-4 ring-[var(--surface)] shadow-sm",
                            idx === 0 ? "bg-[var(--warning)] animate-pulse" : "bg-[var(--border)]"
                        )} />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-[var(--text-primary)] tracking-tight leading-none">
                                    {idx === 0 ? 'Latest Preview' : `Iteration ${previews.length - idx}`}
                                </h4>
                                <span className="text-[var(--text-xxs)] font-bold text-[var(--text-tertiary)] tabular-nums">
                                    {format(new Date(preview.submitted_at), 'h:mm a')}
                                </span>
                            </div>

                            <div className="bg-[var(--surface)] p-1 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] overflow-hidden group">
                                <div className="aspect-[4/3] relative rounded-[var(--radius-xl)] overflow-hidden bg-[var(--surface-muted)]">
                                    <img src={preview.preview_url} alt="Design Preview" className="size-full object-cover" />

                                    {preview.status === 'approved' && (
                                        <div className="absolute inset-0 bg-[var(--success)]/10 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className={cn(
                                                "px-4 py-2 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] flex items-center gap-2",
                                                getOrderStatusColor('approved')
                                            )}>
                                                <CheckCircle2 className="size-4" />
                                                <span className="text-xs font-bold tracking-tight">Approved</span>
                                            </div>
                                        </div>
                                    )}

                                    {preview.status === 'change_requested' && (
                                        <div className="absolute inset-0 bg-[var(--warning)]/10 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className={cn(
                                                "px-4 py-2 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] flex items-center gap-2",
                                                getOrderStatusColor('change_requested')
                                            )}>
                                                <RefreshCw className="size-4" />
                                                <span className="text-xs font-bold tracking-tight">Revision Requested</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {preview.vendor_notes && (
                                    <div className="p-4 px-6">
                                        <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight mb-1.5 flex items-center gap-1.5">
                                            <Sparkles className="size-3" /> Vendor Notes
                                        </p>
                                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--well-warning)] p-3 rounded-[var(--radius-lg)] border border-[var(--warning)]/20">
                                            {preview.vendor_notes}
                                        </p>
                                    </div>
                                )}

                                {preview.customer_feedback && (
                                    <div className="p-4 px-6 border-t border-[var(--surface-muted)] bg-[var(--surface-muted)]/50">
                                        <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight mb-1.5 flex items-center gap-1.5">
                                            <RefreshCw className="size-3" /> Your Feedback (Revision)
                                        </p>
                                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                                            &quot;{preview.customer_feedback}&quot;
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Future layer: Final Fulfillment */}
                {personalizedProducts.some(i => i.status === 'in_production') && (
                    <div className="relative opacity-50">
                        <div className="absolute -left-[20px] top-1 size-2.5 rounded-full bg-[var(--surface-muted)] ring-4 ring-[var(--surface)]" />
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight leading-none">In Production (Locked)</h4>
                            <p className="text-xs font-medium text-[var(--text-tertiary)]">Design finalized and shared with workshop.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
