'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

import { useUI } from '@/providers/UIProvider';

interface DesktopFooterProps {
    className?: string;
}

/**
 * WYSHKIT 2026: Desktop Footer
 * Premium, high-density discovery anchor for large screens.
 * Zero Redundancy: Consolidates navigation, branding, and compliance.
 */
export function DesktopFooter({ className }: DesktopFooterProps) {
    const { openSearchSheet, openProfileSheet } = useUI();
    return (
        <footer className={cn("bg-[var(--surface)] border-t border-[var(--border)] py-[var(--space-16)] px-[var(--space-8)] hidden md:block", className)}>
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-4 gap-[var(--space-12)]">
                    {/* Brand Section */}
                    <div className="col-span-1 space-y-[var(--space-6)]">
                        <Logo />
                        <p className="text-xs font-medium text-[var(--text-secondary)] leading-relaxed opacity-80 max-w-[240px]">
                            Delivering personalised trust in under 60 minutes.
                            The shadow of Swiggy, the speed of Instamart.
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black px-2 py-0.5 bg-[var(--text-primary)] text-[var(--text-inverse)] rounded-full tracking-widest uppercase">Startup India</span>
                        </div>
                    </div>

                    {/* Discovery Links */}
                    <div className="space-y-[var(--space-4)]">
                        <h4 className="text-[10px] font-black tracking-widest text-[var(--text-tertiary)] uppercase">Discovery</h4>
                        <ul className="flex flex-col gap-[var(--space-2)]">
                            <li><Link href="/" className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors">Home</Link></li>
                            <li>
                                <button
                                    onClick={() => openSearchSheet()}
                                    className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors text-left"
                                >
                                    Search
                                </button>
                            </li>
                            <li><Link href="/orders" className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors">My Orders</Link></li>
                            <li>
                                <button
                                    onClick={() => openProfileSheet()}
                                    className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors text-left"
                                >
                                    My Profile
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links - WYSHKIT 2026: Consolidation */}
                    <div className="space-y-[var(--space-4)]">
                        <h4 className="text-[10px] font-black tracking-widest text-[var(--text-tertiary)] uppercase">Support</h4>
                        <ul className="flex flex-col gap-[var(--space-2)]">
                            <li>
                                <button
                                    onClick={() => openProfileSheet()}
                                    className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors text-left"
                                >
                                    Help & Support
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Compliance Section */}
                    <div className="space-y-[var(--space-4)]">
                        <h4 className="text-[10px] font-black tracking-widest text-[var(--text-tertiary)] uppercase">Compliance</h4>
                        <div className="text-[11px] font-bold text-[var(--text-secondary)] leading-relaxed space-y-1 opacity-70">
                            <p>Velmora Labs Private Limited</p>
                            <p>CIN: U47730DL2025PTC453280</p>
                            <p>GST: 07AALCV3232B1ZM</p>
                            <p className="mt-2 italic">100% advance payment required. No returns on personalized items.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-[var(--space-16)] pt-[var(--space-8)] border-t border-[var(--border)] flex justify-between items-center">
                    <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">
                        © 2026 Velmora Labs. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/legal/privacy" className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
                        <Link href="/legal/terms" className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
