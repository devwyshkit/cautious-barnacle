'use client';

import { Search, MapPin, ChevronDown, User, ArrowLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { HeaderCart } from './HeaderCart';
import { LocationData } from '@/lib/actions/discovery/location';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { Masthead } from '@/components/customer/home/Masthead';
import { useUI } from '@/providers/UIProvider';
import { cn } from '@/lib/utils';

export type AppBarMode = 'main' | 'transactional' | 'tracking' | 'immersive';

interface AppBarProps {
    mode?: AppBarMode;
    title?: string;
    location?: LocationData;
    status?: 'normal' | 'delayed' | 'capacity';
    etaMinutes?: number;
    locationName?: string;
    hasMasthead?: boolean;
    className?: string;
}

/**
 * WYSHKIT 2026: The "One Header" (AppBar)
 * 
 * Centralized layout controller replacing fragmented headers in:
 * - TopHeader (Main)
 * - CheckoutClient (Transactional)
 * - OrderTracker (Tracking)
 * 
 * Modes:
 * - main: Full browse header (Location, Search, Cart, Profile)
 * - transactional: Focused back button + Title
 * - tracking: Back button + Home + Order Title + Live Pulse
 * - immersive: Completely hidden (Manual override)
 */
export function AppBar({
    mode = 'main',
    title,
    location,
    status,
    etaMinutes,
    locationName,
    hasMasthead = false,
    className
}: AppBarProps) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { openLocationSheet, openProfileSheet, openSearchSheet, openOTPSheet } = useUI();

    if (mode === 'immersive') return null;

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-[var(--z-nav)] bg-[var(--surface)] border-b border-[var(--border)] transition-all duration-300",
            className
        )}>
            <div className="max-w-[1440px] mx-auto w-full">
                {mode === 'main' ? (
                    <>
                        {/* Desktop Main Header */}
                        <div className="hidden md:flex h-16 items-center justify-between px-8 gap-8">
                            <div className="flex items-center gap-10">
                                <Link href="/" className="shrink-0 group active:scale-95 transition-transform">
                                    <Logo />
                                </Link>

                                {location && (
                                    <button
                                        id="location-trigger"
                                        aria-label="Delivery Location"
                                        onClick={() => {
                                            triggerHaptic(HapticPattern.ACTION);
                                            openLocationSheet();
                                        }}
                                        className="flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)] hover:bg-[var(--surface-muted)] rounded-[var(--radius-md)] transition-all group"
                                    >
                                        <div className="size-8 rounded-[var(--radius-md)] bg-[var(--surface-muted)] flex items-center justify-center group-hover:bg-[var(--surface)] transition-all">
                                            <MapPin className="size-4 text-[var(--primary)]" />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-bold text-[var(--text-primary)] leading-none">{location.name}</span>
                                                <ChevronDown className="size-3 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 max-w-xl">
                                <button
                                    onClick={() => {
                                        triggerHaptic(HapticPattern.ACTION);
                                        openSearchSheet();
                                    }}
                                    className="w-full flex items-center gap-[var(--space-3)] h-11 px-[var(--space-4)] bg-[var(--surface-muted)] rounded-[var(--radius-md)] hover:bg-[var(--input)] transition-all group"
                                >
                                    <Search className="size-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]" />
                                    <span className="text-sm text-[var(--text-tertiary)] font-medium">Search for products, stores...</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <HeaderCart />
                                <Button
                                    onClick={() => {
                                        triggerHaptic(HapticPattern.ACTION);
                                        user ? openProfileSheet() : openOTPSheet();
                                    }}
                                    className="h-10 px-[var(--space-4)] rounded-[var(--radius-md)] hover:bg-[var(--surface-muted)] gap-[var(--space-2)] font-bold text-sm text-[var(--text-primary)] active:scale-95 transition-all"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-[var(--space-2-5)]">
                                            <div className="size-8 rounded-full bg-[var(--surface-muted)] animate-pulse" />
                                            <div className="w-12 h-4 bg-[var(--surface-muted)] rounded-[var(--radius-sm)] animate-pulse" />
                                        </div>
                                    ) : user ? (
                                        <>
                                            <div className="size-8 rounded-full bg-[var(--surface-muted)] flex items-center justify-center overflow-hidden border border-[var(--border)]">
                                                {user.user_metadata?.avatar_url ? (
                                                    <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="size-4 text-[var(--text-primary)]" />
                                                )}
                                            </div>
                                            <span>{user.user_metadata?.full_name || 'Account'}</span>
                                        </>
                                    ) : (
                                        <span>Sign in</span>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Main Header */}
                        <div className="md:hidden flex flex-col gap-[var(--space-2)] px-[var(--space-4)] pt-[var(--space-3)] pb-[var(--space-2)] h-[var(--top-header-base-mobile)]">
                            <div className="flex items-center justify-between gap-[var(--space-4)]">
                                {location && (
                                    <button
                                        id="location-trigger-mobile"
                                        onClick={() => {
                                            triggerHaptic(HapticPattern.ACTION);
                                            openLocationSheet();
                                        }}
                                        className="flex items-center gap-[var(--space-1)] group overflow-hidden"
                                    >
                                        <span className="text-[var(--primary)] text-base shrink-0">📍</span>
                                        <div className="flex items-center gap-[var(--space-1)]">
                                            <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight truncate max-w-[120px]">
                                                {location.name.split(',')[0]}
                                            </span>
                                            <span className="text-[var(--text-tertiary)] font-bold">·</span>
                                            <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight shrink-0">
                                                ~{etaMinutes || 45} min
                                            </span>
                                            <ChevronDown className="size-3.5 text-[var(--text-tertiary)] group-active:text-[var(--text-primary)] transition-colors ml-0.5" />
                                        </div>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        triggerHaptic(HapticPattern.ACTION);
                                        user ? openProfileSheet() : openOTPSheet();
                                    }}
                                    className="size-9 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                                >
                                    <User className="size-4.5 text-[var(--text-secondary)]" />
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    triggerHaptic(HapticPattern.ACTION);
                                    openSearchSheet();
                                }}
                                className="w-full flex items-center gap-[var(--space-3)] h-11 px-[var(--space-4)] bg-[var(--surface-muted)] border border-[var(--border)] rounded-[var(--radius-md)] active:bg-[var(--input)] transition-all group"
                            >
                                <Search className="size-4 text-[var(--primary)]" />
                                <span className="text-sm font-medium text-[var(--text-tertiary)]">Search products, trophies, keepsakes...</span>
                            </button>
                        </div>
                    </>
                ) : (
                    /* Transactional / Tracking Mode */
                    <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    triggerHaptic(HapticPattern.ACTION);
                                    if (mode === 'tracking') router.push('/');
                                    else router.back();
                                }}
                                className="size-9 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface)] transition-all active:scale-90"
                            >
                                <ArrowLeft className="size-4 text-[var(--text-primary)]" />
                            </button>
                            <h1 className="text-base md:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                                {title || (mode === 'tracking' ? 'Track Order' : 'Checkout')}
                            </h1>
                        </div>

                        {mode === 'tracking' && (
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider hidden sm:block">Live Updates</span>
                                <div className="size-2 bg-[var(--success)] rounded-full animate-pulse shadow-[0_0_8px_var(--success)]" />
                            </div>
                        )}

                        {mode === 'transactional' && (
                            <div className="flex items-center gap-3">
                                <HeaderCart className="hidden sm:flex" />
                            </div>
                        )}
                    </div>
                )}

                {/* Masthead Extension (Mobile Only, Main Mode) */}
                {mode === 'main' && hasMasthead && (
                    <div className="md:hidden">
                        <Masthead
                            status={status}
                            etaMinutes={etaMinutes}
                            locationName={locationName}
                            className="py-1 px-4 border-none bg-transparent h-[var(--top-masthead-height)] flex items-center"
                        />
                    </div>
                )}
            </div>
        </header>
    );
}
