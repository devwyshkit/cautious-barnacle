'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

export function PersonalizationSuccess({ onClose }: { onClose: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center animate-in fade-in zoom-in duration-500 min-h-[400px]">
            <div className="relative">
                <div className="w-20 h-20 bg-[var(--success)]/10 rounded-full flex items-center justify-center border border-[var(--success)]/20">
                    <Check className="size-10 text-[var(--success)]" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 size-6 text-[var(--warning)] animate-pulse" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Mission Started!</h2>
                <p className="text-[var(--text-secondary)] text-sm max-w-[280px] font-medium leading-relaxed">
                    Your vision is being transmitted to our vendor. We&apos;ll alert you as soon as the preview is ready.
                </p>
            </div>
            <div className="pt-8">
                <button
                    onClick={onClose}
                    className="h-14 px-8 bg-[var(--text-primary)] text-[var(--text-inverse)] rounded-xl font-bold tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shadow-[var(--text-primary)]/20"
                >
                    Great, thanks
                </button>
            </div>
        </div>
    );
}
