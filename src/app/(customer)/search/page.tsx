import { Suspense } from "react";
import { SearchPageClient } from "@/components/customer/search/SearchPageClient";
import { searchFiltered } from "@/lib/actions/discovery/search";
import { SearchSkeleton } from "@/components/customer/search/SearchSkeleton";
import { SurfaceErrorBoundaryWithRouter } from "@/components/error/SurfaceErrorBoundary";

/**
 * WYSHKIT 2026: Intent-Based Search Page (Server Component)
 * Route: /search?q=query&category=slug
 * 
 * Swiggy 2026 Pattern: "Data Should Come to User, Not User Go to Data"
 * - Server Component fetches data server-side
 * - Data streams to client progressively
 * - Zero client-side data fetching waterfalls
 * 
 * Swiggy 2026 Pattern: Progressive Disclosure with Suspense
 * - Suspense boundary ensures progressive streaming
 * - Skeleton matches exact layout dimensions (zero CLS)
 */
// export const experimental_ppr = true;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen">
      <SurfaceErrorBoundaryWithRouter surfaceName="Search" showHomeButton>
        <Suspense fallback={<SearchSkeleton />}>
          <AsyncSearchContent params={params} />
        </Suspense>
      </SurfaceErrorBoundaryWithRouter>
    </div>
  );
}

async function AsyncSearchContent({ params }: { params: { q?: string; category?: string } }) {
  const { q, category } = params;

  const initialResults = (q && q.length >= 2) || category
    ? await searchFiltered({ q, category, limit: 20 })
    : { items: [], partners: [], total: 0 };

  return (
    <SearchPageClient
      searchParams={Promise.resolve(params)}
      initialResults={initialResults}
    />
  );
}
