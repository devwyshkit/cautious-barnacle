'use client';

import React from 'react';
import { FileText, Sparkles, RefreshCw, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface HistoryEvent {
    id: string;
    type: string;
    title: string;
    description: string;
    created_at: string;
    metadata?: any;
}

interface HistoryTrailProps {
    orderItems: any[];
    previews: any[];
    timeline: HistoryEvent[];
}

/**
 * WYSHKIT 2026: The "Creative Journey" History Trail
 * Visualizes the 3-layer trust engine:
 * 1. What You Sent (Brief)
 * 2. What Partner Sent (Preview)
 * 3. What Changed (Revisions)
 */
export function HistoryTrail({ orderItems, previews, timeline }: HistoryTrailProps) {
    const personalizedItems = orderItems.filter(i => i.is_personalized);

    if (personalizedItems.length === 0) return null;

    // Filter timeline for relevant creative events
    const creativeEvents = timeline.filter(e =>
        ['DETAILS_RECEIVED', 'PREVIEW_READY', 'CHANGE_REQUESTED', 'APPROVED', 'IN_PRODUCTION'].includes(e.type)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex items-center gap-2 px-1">
                <Clock className="size-3 text-zinc-400" />
                <span className="text-xs font-black text-zinc-400 tracking-tight">Personalization Trail</span>
            </div>

            <div className="relative space-y-8 pl-6">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-zinc-100" />

                {/* Layer 1: The Briefing */}
                {personalizedItems.map(item => (
                    <div key={item.id} className="relative">
                        <div className="absolute -left-[20px] top-1 size-2.5 rounded-full bg-zinc-900 ring-4 ring-white shadow-sm" />
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-zinc-900 tracking-tight leading-none">Layer 1: The Briefing</h4>
                                <span className="text-[8px] font-bold text-zinc-400 tabular-nums">
                                    {item.details_submitted_at ? format(new Date(item.details_submitted_at), 'h:mm a') : 'Pending'}
                                </span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm space-y-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="size-3.5 text-zinc-400" />
                                    <p className="text-[11px] font-bold text-zinc-900">{item.item_name}</p>
                                </div>
                                {item.personalization_details?.text && (
                                    <p className="text-xs text-zinc-500 italic leading-relaxed">"{item.personalization_details.text}"</p>
                                )}
                                {item.personalization_details?.image_url && (
                                    <div className="aspect-video rounded-xl overflow-hidden border border-zinc-100">
                                        <img src={item.personalization_details.image_url} alt="Brief Reference" className="size-full object-cover" />
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
                            "absolute -left-[20px] top-1 size-2.5 rounded-full ring-4 ring-white shadow-sm",
                            idx === 0 ? "bg-amber-500 animate-pulse" : "bg-zinc-200"
                        )} />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-zinc-900 tracking-tight leading-none">
                                    {idx === 0 ? 'Latest Preview' : `Iteration ${previews.length - idx}`}
                                </h4>
                                <span className="text-[8px] font-bold text-zinc-400 tabular-nums">
                                    {format(new Date(preview.submitted_at), 'h:mm a')}
                                </span>
                            </div>

                            <div className="bg-white p-1 rounded-xl border border-zinc-100 shadow-sm shadow-zinc-200/50 overflow-hidden group">
                                <div className="aspect-[4/3] relative rounded-[2.2rem] overflow-hidden bg-zinc-50">
                                    <img src={preview.preview_url} alt="Design Preview" className="size-full object-cover" />

                                    {preview.status === 'approved' && (
                                        <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-white/90 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
                                                <CheckCircle2 className="size-4 text-emerald-500" />
                                                <span className="text-xs font-black text-emerald-600 tracking-tight">Approved</span>
                                            </div>
                                        </div>
                                    )}

                                    {preview.status === 'change_requested' && (
                                        <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-white/90 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
                                                <RefreshCw className="size-4 text-amber-500" />
                                                <span className="text-xs font-black text-amber-600 tracking-tight">Revision Requested</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {preview.partner_notes && (
                                    <div className="p-4 px-6">
                                        <p className="text-xs font-bold text-zinc-400 tracking-tight mb-1.5 flex items-center gap-1.5">
                                            <Sparkles className="size-3" /> Designer Notes
                                        </p>
                                        <p className="text-xs text-zinc-600 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                                            {preview.partner_notes}
                                        </p>
                                    </div>
                                )}

                                {preview.customer_feedback && (
                                    <div className="p-4 px-6 border-t border-zinc-50 bg-zinc-50/50">
                                        <p className="text-xs font-bold text-zinc-400 tracking-tight mb-1.5 flex items-center gap-1.5">
                                            <RefreshCw className="size-3" /> Your Feedback (Revision)
                                        </p>
                                        <p className="text-xs text-zinc-600 leading-relaxed italic">
                                            "{preview.customer_feedback}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Future layer: Final Fulfillment */}
                {personalizedItems.some(i => i.status === 'in_production') && (
                    <div className="relative opacity-50">
                        <div className="absolute -left-[20px] top-1 size-2.5 rounded-full bg-zinc-100 ring-4 ring-white" />
                        <div className="space-y-2">
                            <h4 className="text-xs font-black text-zinc-300 tracking-tight leading-none">In Production (Locked)</h4>
                            <p className="text-[11px] font-medium text-zinc-400">Design finalized and shared with workshop.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
