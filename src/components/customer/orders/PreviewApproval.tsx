'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { XCircle, FileText, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ActionSlider } from '@/components/ui/ActionSlider';
import { PreviewSubmission } from '@/lib/types/order';
import { SubmittedIdentity } from './tracking/SubmittedIdentity';

interface PreviewOrderItemContext {
    personalization_details: Record<string, unknown>;
    item_name: string;
}

interface PreviewApprovalProps {
    preview: PreviewSubmission;
    changeCount?: number;
    maxChanges?: number;
    onApprove: () => void;
    onRequestChange: (feedback: string) => void;
    onReject?: () => void;
    isApproving: boolean;
    isRejecting?: boolean;
    orderItem?: PreviewOrderItemContext;
}

export function PreviewApproval({
    preview,
    changeCount = 0,
    maxChanges = 2,
    onApprove,
    onRequestChange,
    onReject,
    isApproving,
    isRejecting = false,
    orderItem
}: PreviewApprovalProps) {
    const [showFeedback, setShowFeedback] = useState(false);
    const [showContext, setShowContext] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [confirmReject, setConfirmReject] = useState(false);
    const changesRemaining = Math.max(0, maxChanges - changeCount);

    return (
        <section className="bg-white space-y-4">
            {/* WYSHKIT 2026: Customer-centric header */}
            <div className="flex items-center justify-between px-1 pb-2">
                <div>
                    <h3 className="text-lg font-black text-zinc-900 tracking-tight leading-none">Your Preview</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1">Does this look exactly right?</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 rounded-full shadow-sm">
                    <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-white font-bold tracking-wider">Review</span>
                </div>
            </div>

            {/* WYSHKIT 2026: Requirement Context (Cross-Verification) */}
            {orderItem?.personalization_details && (
                <div className="bg-zinc-50 rounded-2xl border border-zinc-100 overflow-hidden">
                    <button
                        onClick={() => setShowContext(!showContext)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-zinc-100/50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <FileText className="size-3.5 text-zinc-400" />
                            <span className="text-xs font-black text-zinc-500 tracking-wider">Your Requirements</span>
                        </div>
                        {showContext ? <ChevronUp className="size-3.5 text-zinc-400" /> : <ChevronDown className="size-3.5 text-zinc-400" />}
                    </button>
                    {showContext && (
                        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                            <SubmittedIdentity
                                details={orderItem.personalization_details as any}
                                itemName={orderItem.item_name}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* WYSHKIT 2026: Immersive Preview Card */}
            <div className="relative aspect-[4/5] bg-zinc-100 rounded-[32px] overflow-hidden shadow-sm border border-zinc-100 group">
                <Image
                    src={preview.preview_url}
                    alt="Preview"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {preview.partner_notes && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-white/20">
                        <div className="flex items-start gap-3">
                            <div className="size-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                                <span className="text-xs">🧑‍🎨</span>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-xs font-black tracking-wider text-zinc-400">Partner Note</span>
                                <p className="text-sm font-medium text-zinc-900 leading-snug">
                                    "{preview.partner_notes}"
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-3 pt-2">
                {showFeedback ? (
                    <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-200/50">
                            <span className="text-xs font-bold text-zinc-900">Request Changes</span>
                            <button
                                onClick={() => setShowFeedback(false)}
                                className="p-1 -mr-1 text-zinc-400 hover:text-zinc-600"
                                aria-label="Close feedback"
                            >
                                <XCircle className="size-5" />
                            </button>
                        </div>
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="e.g. Please make the font bigger..."
                            className="w-full min-h-[100px] bg-white border border-zinc-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-zinc-900 transition-all outline-none resize-none"
                            autoFocus
                        />
                        <button
                            onClick={() => onRequestChange(feedback)}
                            disabled={isApproving || !feedback.trim()}
                            className="w-full h-12 bg-zinc-900 text-white rounded-xl font-bold text-xs tracking-wider disabled:opacity-50"
                        >
                            {isApproving ? 'Sending Request...' : 'Send Feedback'}
                        </button>
                        <p className="text-xs text-zinc-400 text-center">
                            {changesRemaining} free revision{changesRemaining !== 1 ? 's' : ''} remaining
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Pre-approval disclaimer — sets expectation, prevents regret */}
                        <p className="text-xs text-zinc-400 text-center px-6 leading-relaxed">
                            This is a digital preview. Minor variations in rendering or surface reflection may occur.
                            Once approved, personalisation starts immediately and <strong>cannot be undone.</strong>
                        </p>
                        <ActionSlider
                            onConfirm={onApprove}
                            isLoading={isApproving}
                            label="Slide to approve preview"
                            successLabel="Approved!"
                        />
                        <button
                            onClick={() => setShowFeedback(true)}
                            disabled={isApproving || isRejecting || changesRemaining <= 0}
                            className="w-full py-3 text-xs font-black text-zinc-500 hover:text-zinc-800 underline decoration-zinc-200 tracking-wider transition-colors disabled:no-underline disabled:opacity-30"
                        >
                            Request a change ({changesRemaining} left)
                        </button>
                        {onReject && (
                            // Inline double-confirm — no browser modal (dark pattern)
                            confirmReject ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setConfirmReject(false)}
                                        className="flex-1 py-3 text-xs font-black text-zinc-500 border border-zinc-200 rounded-xl tracking-wider"
                                    >
                                        Keep preview
                                    </button>
                                    <button
                                        onClick={() => { setConfirmReject(false); onReject(); }}
                                        disabled={isApproving || isRejecting}
                                        className="flex-1 py-3 text-xs font-black text-white bg-rose-500 hover:bg-rose-600 rounded-xl tracking-wider disabled:opacity-50 flex items-center justify-center gap-1.5"
                                    >
                                        <AlertTriangle className="size-3" />
                                        {isRejecting ? 'Processing...' : 'Confirm & Refund'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmReject(true)}
                                    disabled={isApproving || isRejecting}
                                    className="w-full py-3 mt-1 text-xs font-black text-rose-500 hover:text-rose-700 underline decoration-rose-200 tracking-wider transition-colors disabled:no-underline disabled:opacity-30"
                                >
                                    Reject & get instant refund
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
