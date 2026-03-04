'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

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
        <footer className={cn("bg-[var(--surface-glass)] backdrop-blur-3xl border-t border-[var(--border)] py-[var(--space-16)] px-[var(--space-8)] hidden md:block", className)}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <div className="flex flex-col gap-4">
                            <Image
                                src="/images/logo-horizontal.png"
                                alt="Wyshkit Logo"
                                width={140}
                                height={40}
                                className="opacity-90 hover:opacity-100 transition-opacity"
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black px-2 py-0.5 bg-[var(--text-primary)] text-[var(--text-inverse)] rounded-full tracking-widest uppercase">Startup India</span>
                            </div>
                        </div>
                        <p className="text-xs font-medium text-[var(--text-secondary)] leading-relaxed opacity-70">
                            The shadow of Swiggy. The speed of Instamart.
                            Zero reinvention. Delivering personalised trust
                            in under 60 minutes.
                        </p>
                    </div>

                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8 pt-2">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black tracking-widest text-[var(--text-tertiary)] uppercase">Legal Entity</h4>
                            <div className="text-[11px] font-bold text-[var(--text-secondary)] leading-loose space-y-1">
                                <p>Operating as <span className="text-[var(--text-primary)]">Wyshkit</span></p>
                                <p className="opacity-60 font-medium">CIN: U47730DL2025PTC453280</p>
                                <p className="opacity-60 font-medium">PAN: AALCV3232B</p>
                                <p className="opacity-60 font-medium">GST: 07AALCV3232B1ZM</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black tracking-widest text-[var(--text-tertiary)] uppercase">Compliance</h4>
                            <p className="text-[11px] font-medium text-[var(--text-secondary)] leading-relaxed italic opacity-80">
                                100% advance payment required for order confirmation.
                                No returns on personalized products unless received damaged or incorrect.
                            </p>
                        </div>
                    </div>

                    <div className="col-span-1 space-y-4 pt-2">
                        <h4 className="text-[10px] font-black tracking-widest text-[var(--text-tertiary)] uppercase leading-none">Headquarters</h4>
                        <div className="flex flex-col gap-1">
                            <p className="text-[11px] font-bold text-[var(--text-primary)] leading-none">Velmora Labs Private Limited</p>
                            <span className="text-[10px] font-bold text-[var(--text-tertiary)] tracking-tight">Bangalore, Karnataka, India</span>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-[var(--border)]/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-tight">
                        © 2026 Velmora Labs. All rights reserved.
                    </p>
                    <div className="flex flex-wrap gap-x-8 gap-y-2">
                        <Link href="/legal/privacy" className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest hover:text-[var(--primary)] transition-colors">Privacy Policy</Link>
                        <Link href="/legal/terms" className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest hover:text-[var(--primary)] transition-colors">Terms of Service</Link>
                        <Link href="/legal/returns" className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest hover:text-[var(--primary)] transition-colors">Return Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
