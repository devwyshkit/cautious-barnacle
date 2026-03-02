'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Locate,
  Loader2,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { getAddresses, setDefaultAddress, deleteAddress } from '@/lib/actions/user/addresses';
import { setLocationFromCoords, setLocationCookies, searchPlaces, setLocationFromPlaceId } from '@/lib/actions/discovery/location';
import type { Address } from '@/lib/types/address';
import { LocationSearch } from './location/LocationSearch';
import { SavedAddresses } from './location/SavedAddresses';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';

export function LocationContent({ onSelect }: { onSelect?: () => void }) {
  const router = useRouter();
  const { user } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [settingDefault, setSettingDefault] = useState<string | null>(null);
  const [usingGeolocation, setUsingGeolocation] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search State
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      const results = await searchPlaces(query);
      setSearchResults(results || []);
      setSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const goBack = () => {
    if (onSelect) onSelect();
    else if (window.history.length > 1) router.back();
    else router.push('/');
  };

  const handleSelectPlace = async (placeId: string) => {
    setSearching(true);
    const result = await setLocationFromPlaceId(placeId);
    if (result.success) {
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('locationUpdate'));
      toast.success(`Location set: ${result.name}`);
      goBack();
    } else {
      toast.error(result.error || 'Failed to set location');
    }
    setSearching(false);
  };

  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        setLoadingAddresses(true);
        try {
          const result = await getAddresses();
          if (result?.addresses) {
            setAddresses(result.addresses);
            const defaultAddr = result.addresses.find((a: Address) => a.is_default);
            if (defaultAddr) setSelectedAddressId(defaultAddr.id);
          }
        } catch { } finally {
          setLoadingAddresses(false);
        }
      };
      fetchAddresses();
    }
  }, [user]);

  const handleSelectAddress = async (id: string, addr: Address) => {
    if (settingDefault) return;
    setSettingDefault(id);
    try {
      const result = await setDefaultAddress(id);
      if (result.success) {
        if (addr?.latitude != null && addr?.longitude != null) {
          await setLocationCookies(addr.latitude, addr.longitude, addr.name || addr.city || 'Saved address');
          if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('locationUpdate'));
        }
        toast.success("Delivery location updated");
        goBack();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSettingDefault(null);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported');
      return;
    }
    setUsingGeolocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await setLocationFromCoords(latitude, longitude);
        if (result.success) {
          if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('locationUpdate'));
          toast.success(`Location set: ${result.name}`);
          goBack();
        } else {
          toast.error(result.error || 'Could not set location');
        }
        setUsingGeolocation(false);
      },
      () => {
        toast.error('Location access denied');
        setUsingGeolocation(false);
      }
    );
  };

  if (query.length >= 3) {
    return (
      <LocationSearch
        query={query}
        onQueryChange={setQuery}
        results={searchResults}
        searching={searching}
        onSelectPlace={handleSelectPlace}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <LocationSearch
        query={query}
        onQueryChange={setQuery}
        results={[]}
        searching={searching}
        onSelectPlace={handleSelectPlace}
      />

      <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar">
        <div className="px-5 py-2 sm:py-4 space-y-6 animate-in fade-in duration-500">
          <button
            onClick={handleUseCurrentLocation}
            disabled={usingGeolocation}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-muted)] hover:border-[var(--border)] transition-all text-left group"
          >
            <div className="size-10 rounded-xl bg-[var(--primary)]/5 flex items-center justify-center shrink-0 border border-[var(--primary)]/10 group-hover:bg-[var(--primary)]/10 transition-colors">
              {usingGeolocation ? <Loader2 className="size-4 animate-spin text-[var(--primary)]" /> : <Locate className="size-4 text-[var(--primary)]" />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[var(--text-primary)]">{usingGeolocation ? 'Pinpointing location…' : 'Use current location'}</span>
              <span className="text-xs font-bold text-[var(--primary)] tracking-tight mt-0.5 leading-none">Using GPS</span>
            </div>
          </button>

          {user && addresses.length > 0 && (
            <SavedAddresses
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              settingDefault={settingDefault}
              deletingId={deletingId}
              onSelect={handleSelectAddress}
              onDelete={async (id) => {
                setDeletingId(id);
                await deleteAddress(id);
                setAddresses(prev => prev.filter(a => a.id !== id));
                setDeletingId(null);
                toast.success('Address removed');
              }}
              onEdit={(id) => router.push(`/profile?tab=addresses&action=edit&id=${id}`)}
              onAdd={() => router.push('/profile?tab=addresses&action=add')}
            />
          )}

          {(!user || addresses.length === 0) && (
            <div className="py-8 px-6 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)] text-center space-y-4">
              <div className="size-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto">
                <Navigation className="size-5 text-[var(--primary)]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">{user ? 'No saved addresses' : 'Sign in to save addresses'}</p>
                <p className="text-xs text-[var(--text-secondary)] max-w-[200px] mx-auto leading-relaxed">
                  {user ? 'Add your delivery addresses for a faster checkout.' : 'Log in to access your saved home and work addresses.'}
                </p>
              </div>
              <button onClick={() => user ? router.push('/profile?tab=addresses&action=add') : router.push('/auth')} className="mt-2 px-6 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--text-inverse)] text-xs font-bold active:scale-95 transition-all">
                {user ? 'Add Address' : 'Sign In'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LocationSheet({ isOpen, onOpenChange, onSelect, isRouteContext }: { isOpen?: boolean; onOpenChange?: (open: boolean) => void; onSelect?: () => void; isRouteContext?: boolean }) {
  if (isRouteContext) {
    return (
      <div className="flex flex-col h-[100dvh] bg-[var(--surface)]">
        <div className="flex-1 min-h-0">
          <LocationContent onSelect={onSelect} />
        </div>
      </div>
    );
  }

  return (
    <ResponsiveSurface
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Delivery Location"
      description="Where should we send your Wysh?"
      className="md:max-w-lg"
    >
      <div className="">
        <LocationContent onSelect={() => {
          if (onSelect) onSelect();
          if (onOpenChange) onOpenChange(false);
        }} />
      </div>
    </ResponsiveSurface>
  );
}
