'use client';

import React from 'react';
import { useUI } from '@/providers/UIProvider';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { MessageCircle, Phone, Info, ChevronRight, ExternalLink } from 'lucide-react';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

export function SupportSheet() {
    const { isSupportSheetOpen, closeSupportSheet } = useUI();

    const handleAction = () => {
        triggerHaptic(HapticPattern.ACTION);
    };

    return (
        <ResponsiveSurface
            open={isSupportSheetOpen}
            onOpenChange={closeSupportSheet}
            title="Support"
            description="How can we help you today?"
            className="md:max-w-md"
        >
            <div className="px-6 py-4 space-y-4">
                <button
                    onClick={handleAction}
                    className="w-full flex items-center justify-between p-4 rounded-[var(--radius-xl)] bg-[var(--surface-muted)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-[var(--radius-lg)] bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)]">
                            <MessageCircle className="size-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-[var(--text-primary)]">Chat with us</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Response time: ~2 mins</p>
                        </div>
                    </div>
                    <ChevronRight className="size-4 text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={handleAction}
                    className="w-full flex items-center justify-between p-4 rounded-[var(--radius-xl)] bg-[var(--surface-muted)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-[var(--radius-lg)] bg-[var(--info)]/5 flex items-center justify-center text-[var(--info)]">
                            <Phone className="size-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-[var(--text-primary)]">Call for Order Support</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Available 9 AM - 11 PM</p>
                        </div>
                    </div>
                    <ChevronRight className="size-4 text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="pt-4 space-y-2">
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest px-1">Resources</p>
                    <div className="space-y-1">
                        <button className="w-full flex items-center justify-between py-3 px-1 hover:text-[var(--primary)] transition-colors group">
                            <div className="flex items-center gap-3">
                                <Info className="size-4 opacity-50" />
                                <span className="text-sm font-bold">Frequently Asked Questions</span>
                            </div>
                            <ExternalLink className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button className="w-full flex items-center justify-between py-3 px-1 hover:text-[var(--primary)] transition-colors group">
                            <div className="flex items-center gap-3">
                                <Info className="size-4 opacity-50" />
                                <span className="text-sm font-bold">Shipping & Returns Policy</span>
                            </div>
                            <ExternalLink className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>
            </div>
        </ResponsiveSurface>
    );
}
