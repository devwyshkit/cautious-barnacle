'use client';

import { Search, MapPin, ChevronDown, User } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { useSearchParams } from 'next/navigation';


interface TopHeaderProps {
  location: LocationData;
  status?: 'normal' | 'delayed' | 'capacity';
  etaMinutes?: number;
  locationName?: string;
  hasMasthead?: boolean;
}

/**
 * WYSHKIT 2026: TopHeader - Zero Hydration Hook
 * 
 * WYSHKIT 2026 Pattern: Location state management
 * - Pre-hydrated from Server Component (CustomerLayout)
 * - Zero useEffect for initial load
 * - No localStorage reliance
 */
export function TopHeader({ location, status, etaMinutes, locationName, hasMasthead: hasMastheadProp }: TopHeaderProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { openLocationSheet, openProfileSheet, openSearchSheet, openOTPSheet } = useUI();
  const hasMasthead = hasMastheadProp ?? !!(status || etaMinutes || locationName);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[var(--z-nav)] bg-[var(--surface)] border-b border-[var(--border)] md:border-none">
        {/* Desktop Header */}
        <div className="hidden md:flex h-16 items-center justify-between px-8 max-w-[1440px] mx-auto gap-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="shrink-0">
              <Logo />
            </Link>

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

        {/* Mobile Header: High Density WYSHKIT 2026 Style */}
        <div className="md:hidden flex flex-col gap-[var(--space-1-5)] px-[var(--space-4)] pt-[var(--space-2)] pb-[var(--space-1-5)] h-[var(--top-header-base-mobile)]">
          <div className="flex items-center justify-between gap-[var(--space-4)]">
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
            className="w-full flex items-center gap-[var(--space-3)] h-9 px-[var(--space-4)] bg-[var(--surface-muted)] border border-[var(--border)] rounded-[var(--radius-md)] active:bg-[var(--input)] transition-all group"
          >
            <Search className="size-3.5 text-[var(--primary)]" />
            <span className="text-xs font-medium text-[var(--text-tertiary)]">Search products, trophies, keepsakes...</span>
          </button>
        </div>

        {/* Masthead Extension */}
        <div className="md:hidden">
          {hasMasthead && (
            <Masthead
              status={status}
              etaMinutes={etaMinutes}
              locationName={locationName}
              className="py-1 px-4 border-none bg-transparent h-[var(--top-masthead-height)] flex items-center"
            />
          )}
        </div>
      </header >

    </>
  );
}
