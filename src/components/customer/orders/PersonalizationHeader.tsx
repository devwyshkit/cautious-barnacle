'use client';

import React from 'react';
import { CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { HyperlocalTimer } from '@/components/ui/HyperlocalTimer';

interface PersonalizationHeaderProps {
    orderId: string;
    designDeadline?: string | null;
}

export function PersonalizationHeader({ orderId, designDeadline }: PersonalizationHeaderProps) {
    return (
        <div className="bg-[var(--foreground)] rounded-[var(--radius-md)] p-7 text-[var(--text-inverse)] shadow-sm shadow-[var(--text-primary)]/20 border border-[var(--text-inverse)]/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="flex items-start justify-between relative z-10 mb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-[var(--radius-md)] bg-[var(--success)] flex items-center justify-center shadow-lg shadow-[var(--success)]/20">
                            <CheckCircle2 className="size-6 text-[var(--text-inverse)]" />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight">Mission Started</h3>
                    </div>
                    <p className="text-xs font-bold text-[var(--text-secondary)] tracking-tight mt-1">
                        Personalisation • Order {orderId.slice(0, 8).toUpperCase()}
                    </p>
                </div>
                <div className="size-12 rounded-[var(--radius-md)] bg-[var(--surface-muted)]/30 backdrop-blur-md border border-[var(--border)] flex items-center justify-center">
                    <Sparkles className="size-6 text-[var(--warning)] animate-pulse" />
                </div>
            </div>

            <p className="text-sm font-medium text-[var(--text-tertiary)] leading-relaxed max-w-[280px] mb-6 relative z-10">
                Your payment is confirmed. To start the bespoke crafting process, please share your preferences below.
            </p>

            {designDeadline && (
                <div className="bg-[var(--surface-muted)]/20 border border-[var(--border)] rounded-[var(--radius-md)] p-5 flex items-center justify-between relative z-10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                            <Clock className="size-4 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-tight text-[var(--text-inverse)]/40 mb-0.5">Approval SLA Baseline</p>
                            <HyperlocalTimer
                                deadline={designDeadline}
                                variant="minimal"
                                className="text-sm font-bold text-rose-500 p-0 shadow-none bg-transparent"
                            />
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-[var(--surface-muted)]/40 rounded-full border border-[var(--border)]/20">
                        <span className="text-xs font-bold text-[var(--text-inverse)]/60 tracking-tight">Priority</span>
                    </div>
                </div>
            )}
        </div>
    );
}
