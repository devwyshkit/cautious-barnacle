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
import { LocationSheet } from '@/components/customer/LocationSheet';


interface TopHeaderProps {
  initialLocation?: LocationData;
}

/**
 * WYSHKIT 2026: TopHeader - Zero Hydration Hook
 * 
 * WYSHKIT 2026 Pattern: Location state management
 * - Pre-hydrated from Server Component (CustomerLayout)
 * - Zero useEffect for initial load
 * - No localStorage reliance
 */
export function TopHeader({ initialLocation }: TopHeaderProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Default fallback if initialLocation is missing (should not happen in 2026)
  const [location, setLocation] = useState<LocationData>(
    initialLocation || { name: 'Select location', address: '', pincode: '' }
  );

  useEffect(() => {
    // Listen for custom event from LocationSheet
    const handleLocationUpdate = () => {
      if (typeof window !== 'undefined') {
        router.refresh();
      }
    };
    window.addEventListener('locationUpdate', handleLocationUpdate);
    return () => window.removeEventListener('locationUpdate', handleLocationUpdate);
  }, []);

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
              onClick={() => setIsLocationOpen(true)}
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
              onClick={() => router.push('/search')}
              className="w-full flex items-center gap-[var(--space-3)] h-11 px-[var(--space-4)] bg-[var(--surface-muted)] rounded-[var(--radius-md)] hover:bg-[var(--input)] transition-all group"
            >
              <Search className="size-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text-tertiary)] font-medium">Search for products, stores...</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <HeaderCart />
            <Button
              onClick={() => user ? router.push('/profile') : router.push('/auth')}
              className="h-10 px-[var(--space-4)] rounded-[var(--radius-md)] hover:bg-[var(--surface-muted)] gap-[var(--space-2)] font-bold text-sm text-[var(--text-primary)] active:scale-95 transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-[var(--space-25)]">
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
        <div className="md:hidden flex flex-col gap-2.5 px-4 pt-3 pb-2.5">
          <div className="flex items-center justify-between gap-4">
            <button
              id="location-trigger-mobile"
              onClick={() => setIsLocationOpen(true)}
              className="flex items-center gap-[var(--space-2)] group overflow-hidden"
            >
              <MapPin className="size-5 text-[var(--primary)] shrink-0" />
              <div className="flex flex-col items-start min-w-0">
                <div className="flex items-center gap-1 w-full">
                  <span className="text-sm font-bold text-[var(--text-primary)] truncate tracking-tight">{location.name}</span>
                  <ChevronDown className="size-3.5 text-[var(--text-tertiary)] group-active:text-[var(--text-primary)] transition-colors" />
                </div>
                <span className="text-xs font-semibold text-[var(--text-tertiary)] truncate w-full tracking-tight">{location.address}</span>
              </div>
            </button>
            <Link
              href="/profile"
              className="size-9 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center shrink-0"
            >
              <User className="size-4.5 text-[var(--text-secondary)]" />
            </Link>
          </div>

          <button
            onClick={() => router.push('/search')}
            className="flex items-center gap-[var(--space-3)] h-12 px-[var(--space-4)] bg-[var(--surface-muted)] rounded-[var(--radius-lg)] border border-[var(--border)] active:scale-[0.98] transition-all"
          >
            <Search className="size-4.5 text-[var(--primary)]" />
            <span className="text-sm font-bold text-[var(--text-tertiary)]">Search &quot;Best Birthday Cakes&quot;</span>
          </button>
        </div>
      </header>

      <LocationSheet
        isOpen={isLocationOpen}
        onOpenChange={setIsLocationOpen}
      />
    </>
  );
}
