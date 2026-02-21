"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface HomeClientProps {
  children: ReactNode;
  initialLat?: number;
  initialLng?: number;
}

export function HomeClient({ children, initialLat, initialLng }: HomeClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  useEffect(() => {
    // WYSHKIT 2026: Intent-Based Navigation - URL represents intent
    // Check for auth_required trigger and redirect to auth route
    const authRequired = searchParams.get('auth_required');
    if (authRequired === 'true') {
      const returnUrl = searchParams.get('returnUrl') || pathname;
      const intent = searchParams.get('intent') || 'signin';

      // Redirect to auth route with intent
      router.push(`/auth?intent=${intent}&returnUrl=${encodeURIComponent(returnUrl)}`);

      // Clean up the URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete('auth_required');
      params.delete('returnUrl');
      params.delete('intent');
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl);
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    // WYSHKIT 2026: Zero URL Pollution
    // If location is already resolved on server, don't trigger client-side geolocation
    if (initialLat && initialLng) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // WYSHKIT 2026: Cookie-Only Source of Truth
          // Set location via Server Action (sets cookies + revalidates page)
          // Avoids injecting lat/lng into the URL.
          const { setLocationFromCoords } = await import("@/lib/actions/discovery/location");
          await setLocationFromCoords(latitude, longitude);

          // Trigger a silent refresh to pick up new location data from cookies
          router.refresh();
        },
        () => {
          // Geolocation denied or unavailable - silent fail
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 300000 }
      );
    }
  }, [initialLat, initialLng, router]);

  return (
    <div className="relative">
      {children}
    </div>
  );
}
