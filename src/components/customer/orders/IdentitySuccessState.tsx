'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

interface IdentitySuccessStateProps {
    onClose: () => void;
}

export function IdentitySuccessState({ onClose }: IdentitySuccessStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center animate-in fade-in zoom-in duration-500 min-h-[400px]">
            <div className="relative">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                    <Check className="size-10 text-emerald-500" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 size-6 text-amber-500 animate-pulse" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Mission Started!</h2>
                <p className="text-zinc-500 text-sm max-w-[280px] font-medium leading-relaxed">
                    Your vision is being transmitted to our vendor. We&apos;ll alert you as soon as the preview is ready.
                </p>
            </div>
            <div className="pt-8">
                <button
                    onClick={onClose}
                    className="h-14 px-8 bg-zinc-900 text-white rounded-xl font-black tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shadow-zinc-950/20"
                >
                    Great, thanks
                </button>
            </div>
        </div>
    );
}
