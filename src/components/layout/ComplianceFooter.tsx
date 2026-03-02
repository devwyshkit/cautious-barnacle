'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ComplianceFooterProps {
    className?: string;
}

/**
 * WYSHKIT 2026: Compliance Footer
 * Includes CIN, PAN, GST and Legal Entity details for Indian compliance.
 * Mobile-first: Usually hidden or minimized on small screens, full on desktop.
 */
export function ComplianceFooter({ className }: ComplianceFooterProps) {
    return (
        <footer className={cn("bg-[var(--surface-muted)] border-t border-[var(--border)] py-12 px-6", className)}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tighter text-[var(--text-primary)]">WYSHKIT</span>
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-[var(--text-primary)] text-white rounded tracking-tight">Startup India</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
                            Last-minute personalised gifts delivered fast from local vendors near you.
                            Built for speed, trust, and commitment.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold tracking-tight text-[var(--text-tertiary)]">Legal Entity</h4>
                            Operating as Wyshkit • CIN: U47730DL2025PTC453280<br />
                            PAN: AALCV3232B • GST: 07AALCV3232B1ZM<br />
                            © 2026 Velmora Labs Private Limited. All rights reserved.
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold tracking-tight text-[var(--text-tertiary)]">Compliance & Returns</h4>
                            <p className="text-xs text-[var(--text-secondary)] leading-normal italic">
                                100% advance payment required for order confirmation. No returns on personalized products unless received damaged or incorrect.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-xs font-bold tracking-tight text-[var(--text-tertiary)]">Headquarters</h4>
                        <p className="text-xs text-[var(--text-secondary)]">Bangalore, Karnataka, India</p>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <Link href="/legal/privacy" className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight hover:text-[var(--text-secondary)] transition-colors">Privacy Policy</Link>
                        <Link href="/legal/terms" className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight hover:text-[var(--text-secondary)] transition-colors">Terms of Service</Link>
                        <Link href="/legal/returns" className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight hover:text-[var(--text-secondary)] transition-colors">Return Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
