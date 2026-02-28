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
        <footer className={cn("bg-zinc-50 border-t border-zinc-100 py-12 px-6", className)}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black tracking-tighter text-zinc-900">WYSHKIT</span>
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-zinc-900 text-white rounded tracking-tight">Startup India</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
                            Hyperlocal product marketplace providing products with optional personalization.
                            Built for speed, trust, and commitment.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="text-xs font-black tracking-tight text-zinc-400">Legal Entity</h4>
                            Operating as Wyshkit • CIN: U47730DL2025PTC453280<br />
                            PAN: AALCV3232B • GST: 07AALCV3232B1ZM<br />
                            © 2026 Velmora Labs Private Limited. All rights reserved.
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-black tracking-tight text-zinc-400">Compliance & Returns</h4>
                            <p className="text-xs text-zinc-500 leading-normal italic">
                                100% advance payment required for order confirmation. No returns on personalized products unless received damaged or incorrect.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-xs font-black tracking-tight text-zinc-400">Headquarters</h4>
                        <p className="text-xs text-zinc-600">Bangalore, Karnataka, India</p>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <Link href="/legal/privacy" className="text-xs font-bold text-zinc-400 tracking-tight hover:text-zinc-600 transition-colors">Privacy Policy</Link>
                        <Link href="/legal/terms" className="text-xs font-bold text-zinc-400 tracking-tight hover:text-zinc-600 transition-colors">Terms of Service</Link>
                        <Link href="/legal/returns" className="text-xs font-bold text-zinc-400 tracking-tight hover:text-zinc-600 transition-colors">Return Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
