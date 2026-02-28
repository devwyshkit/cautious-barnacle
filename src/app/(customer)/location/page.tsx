import { Suspense } from "react";
import { LocationSheet } from "@/components/customer/LocationSheet";

/**
 * WYSHKIT 2026: Location Page (Server Component)
 * Route: /location
 * 
 * Swiggy 2026 Pattern: URL-addressable location selection
 * - Full page route for location management
 * - Can be intercepted as modal via intercepting route
 */
export default function LocationPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-zinc-500">Loading location...</div>
        </div>
      }>
        <LocationSheet isRouteContext={true} />
      </Suspense>
    </div>
  );
}
