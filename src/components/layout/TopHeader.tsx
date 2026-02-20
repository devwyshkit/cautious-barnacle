'use client';

import { Search, MapPin, ChevronDown, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { HeaderCart } from './HeaderCart';
import { LocationData } from '@/lib/actions/location';


interface TopHeaderProps {
  initialLocation?: LocationData;
}

/**
 * WYSHKIT 2026: TopHeader - Zero Hydration Hook
 * 
 * Swiggy 2026 Pattern: Location state management
 * - Pre-hydrated from Server Component (CustomerLayout)
 * - Zero useEffect for initial load
 * - No localStorage reliance
 */
export function TopHeader({ initialLocation }: TopHeaderProps) {
  const router = useRouter();
  // WYSHKIT 2026: Removed openSurface - all navigation now uses routes
  const { user, loading } = useAuth();

  // Default fallback if initialLocation is missing (should not happen in 2026)
  const [location, setLocation] = useState<LocationData>(
    initialLocation || { name: 'Select location', address: '', pincode: '' }
  );

  useEffect(() => {
    // Listen for custom event from LocationSheet
    const handleLocationUpdate = () => {
      // In 2026, we prefer to reload the page to trigger a fresh server render
      // with the new location context (stateless resilience)
      if (typeof window !== 'undefined') {
        router.refresh();
      }
    };
    window.addEventListener('locationUpdate', handleLocationUpdate);
    return () => window.removeEventListener('locationUpdate', handleLocationUpdate);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-zinc-50 md:border-none">
      {/* Desktop Header */}
      <div className="hidden md:flex h-16 items-center justify-between px-8 max-w-[1440px] mx-auto gap-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <button
            id="location-trigger"
            aria-label="Delivery Location"
            onClick={() => router.push('/location')}
            className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 rounded-2xl transition-all group"
          >
            <div className="size-8 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-white transition-all">
              <MapPin className="size-4 text-zinc-900" />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-bold text-zinc-900 leading-none">{location.name}</span>
                <ChevronDown className="size-3 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
              </div>
            </div>
          </button>
        </div>

        <div className="flex-1 max-w-xl">
          <button
            onClick={() => router.push('/search')}
            className="w-full flex items-center gap-3 h-11 px-4 bg-zinc-100/50 rounded-2xl hover:bg-zinc-100 transition-all group"
          >
            <Search className="size-4 text-zinc-400 group-hover:text-zinc-600" />
            <span className="text-[14px] text-zinc-500 font-medium">Search for items, stores...</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <HeaderCart />
          <Button
            onClick={() => user ? router.push('/profile') : router.push('/auth')}
            className="h-10 px-4 rounded-2xl hover:bg-zinc-50 gap-2.5 font-bold text-[14px] text-zinc-900 active:scale-95 transition-all"
          >
            {loading ? (
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-zinc-100 animate-pulse" />
                <div className="w-12 h-4 bg-zinc-100 rounded animate-pulse" />
              </div>
            ) : user ? (
              <>
                <div className="size-8 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="size-4 text-zinc-900" />
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

      {/* Mobile Header */}
      <div className="md:hidden flex flex-col px-4 pt-2 pb-1.5">
        <div className="flex items-center justify-between">
          <button
            id="location-trigger-mobile"
            aria-label="Delivery Location"
            onClick={() => router.push('/location')}
            className="flex items-center gap-2"
          >
            <div className="size-9 rounded-2xl bg-zinc-50 flex items-center justify-center">
              <MapPin className="size-4.5 text-zinc-900" />
            </div>
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-bold text-zinc-950 leading-none">{location.name}</span>
                <ChevronDown className="size-3 text-zinc-400" />
              </div>
              <span className="text-[11px] font-medium text-zinc-500 mt-0.5 truncate max-w-[180px]">{location.address}</span>
            </div>
          </button>
        </div>

        {/* WYSHKIT 2026: Search is moved to BottomNav on mobile (Swiggy 2026 Pattern) */}
        {/* Only show search in TopHeader on Desktop */}
      </div>

    </header>
  );
}
