'use client';

import React from 'react';
import { CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { HyperlocalTimer } from '@/components/ui/HyperlocalTimer';

interface IdentityFormHeaderProps {
    orderId: string;
    designDeadline?: string | null;
}

export function IdentityFormHeader({ orderId, designDeadline }: IdentityFormHeaderProps) {
    return (
        <div className="bg-zinc-950 rounded-[2.5rem] p-7 text-white shadow-sm shadow-zinc-950/20 border border-white/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="flex items-start justify-between relative z-10 mb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 className="size-6 text-white" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight">Mission Started</h3>
                    </div>
                    <p className="text-xs font-bold text-zinc-500 tracking-wider mt-1">
                        Design Hub • Order {orderId.slice(0, 8).toUpperCase()}
                    </p>
                </div>
                <div className="size-12 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                    <Sparkles className="size-6 text-amber-500 animate-pulse" />
                </div>
            </div>

            <p className="text-sm font-medium text-zinc-400 leading-relaxed max-w-[280px] mb-6 relative z-10">
                Your payment is confirmed. To start the bespoke crafting process, please share your vision below.
            </p>

            {designDeadline && (
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 flex items-center justify-between relative z-10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                            <Clock className="size-4 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black tracking-wider text-white/40 mb-0.5">Approval SLA Baseline</p>
                            <HyperlocalTimer
                                deadline={designDeadline}
                                variant="minimal"
                                className="text-[13px] font-black text-rose-500 p-0 shadow-none bg-transparent"
                            />
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10">
                        <span className="text-[11px] font-black text-white/60 tracking-wider">Priority</span>
                    </div>
                </div>
            )}
        </div>
    );
}
