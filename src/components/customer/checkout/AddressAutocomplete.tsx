'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: { types?: string[]; componentRestrictions?: { country: string }; fields?: string[] }
          ) => {
            getPlace: () => {
              geometry?: { location: { lat: () => number; lng: () => number } };
              address_components?: Array<{ types: string[]; long_name: string; short_name: string }>;
              formatted_address?: string;
            };
            addListener: (event: string, cb: () => void) => { remove: () => void };
          };
        };
      };
    };
  }
}

export interface PlaceAddress {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  onPlaceSelect: (address: PlaceAddress) => void;
  placeholder?: string;
  className?: string;
}

/**
 * WYSHKIT 2026: Google Places Autocomplete (WYSHKIT 2026 pattern)
 * Pincode-first address search with structured output
 */
export function AddressAutocomplete({
  onPlaceSelect,
  placeholder = 'Search address or enter pincode',
  className,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);
  const hasApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
      process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setReady(true);
      return;
    }

    if (window.google?.maps?.places) {
      setReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google!.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'in' },
      fields: ['address_components', 'geometry', 'formatted_address'],
    });

    autocompleteRef.current = autocomplete;

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location || !place.address_components) return;

      const components = place.address_components;
      const getComp = (type: string) =>
        components.find((c) => c.types.includes(type))?.long_name || '';
      const getShort = (type: string) =>
        components.find((c) => c.types.includes(type))?.short_name || '';

      const pincode = getComp('postal_code');
      const city =
        getComp('locality') ||
        getComp('sublocality_level_1') ||
        getComp('administrative_area_level_2');
      const state = getComp('administrative_area_level_1');

      const streetNumber = getComp('street_number');
      const route = getComp('route');
      const sublocality = getComp('sublocality_level_1');
      const addressParts = [streetNumber, route, sublocality].filter(Boolean);
      const address_line1 =
        addressParts.length > 0
          ? addressParts.join(', ')
          : place.formatted_address?.split(',')[0] || '';

      onPlaceSelect({
        address_line1: address_line1 || place.formatted_address || '',
        city: city || '',
        state: state || '',
        pincode: pincode || '',
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      });
    });

    return () => {
      listener?.remove();
      autocompleteRef.current = null;
    };
  }, [ready, onPlaceSelect]);

  const effectivePlaceholder = hasApiKey ? placeholder : 'Enter area, city or pincode';

  return (
    <div className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)]" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={effectivePlaceholder}
          className="pl-9 bg-[var(--surface-muted)]/50 border-[var(--border)] focus:bg-[var(--surface)] transition-all"
          autoComplete="off"
        />
      </div>
      {!hasApiKey && (
        <p className="text-xs text-[var(--text-tertiary)] mt-1">Or use &quot;Enter manually&quot; below</p>
      )}
    </div>
  );
}
