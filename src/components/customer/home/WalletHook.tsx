'use client';

import React from 'react';
import { Wallet, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/pricing';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

interface WalletHookProps {
    balance: number;
}

/**
 * WYSHKIT 2026: The "Hook" Component
 * 
 * Surfaces wallet balance to drive the Zeigarnik effect (user wants to spend 
 * the 'free money' they already have).
 */
export function WalletHook({ balance }: WalletHookProps) {
    if (balance <= 0) return null;

    const handleClick = () => {
        triggerHaptic(HapticPattern.ACTION);
        // Navigate to wallet or just show a toast for now as per Swiggy Food patterns
        // which often just surface information to drive intent.
    };

    return (
        <div
            onClick={handleClick}
            className="group flex items-center justify-between p-4 bg-[var(--text-primary)] text-[var(--text-inverse)] rounded-[var(--radius-2xl)] border border-[var(--surface)]/20 shadow-[var(--shadow-glow-primary)] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden relative"
        >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="flex items-center gap-4 relative z-10">
                <div className="size-10 rounded-xl bg-[var(--surface)]/10 flex items-center justify-center shadow-inner">
                    <Wallet className="size-5 text-[var(--text-inverse)]" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Your Wyshkit Balance</p>
                    <p className="text-xl font-black tracking-tighter">
                        {formatCurrency(balance)}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Use now</span>
                <div className="size-6 rounded-full bg-[var(--surface)]/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="size-3.5" />
                </div>
            </div>
        </div>
    );
}
