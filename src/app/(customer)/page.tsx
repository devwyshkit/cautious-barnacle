import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getHomeSurfaceContext } from "@/lib/actions/discovery/home";
import { getFilteredItems } from "@/lib/actions/discovery/search";
import { getServerLocation } from "@/lib/actions/discovery/location";
import { HomeSkeleton } from "@/components/customer/home/HomeSkeleton";
import { WyshkitItem } from '@/lib/types/item';
import { HeroCarousel } from "@/components/customer/home/HeroCarousel";
import { BlocksEngine } from "@/components/ui/BlocksEngine";
import { Masthead } from "@/components/customer/home/Masthead";
import { ReorderWidget } from "@/components/customer/home/ReorderWidget";
import { SurfaceErrorBoundaryWithRouter } from "@/components/error/SurfaceErrorBoundary";


interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

// export const experimental_ppr = true; // Enable when confirmed on Next.js 15 with PPR flag
export const dynamic = 'force-dynamic'; // Ensure location-based content is always fresh

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category = null } = await searchParams;
  const location = await getServerLocation();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const hour = new Date().getHours();
  const systemStatus = (hour >= 22 || hour < 6) ? 'delayed' : (hour >= 18 && hour < 21) ? 'capacity' : 'normal';

  // WYSHKIT 2026: Elite Surface Aggregator (One Trip)
  // Consolidates Categories, Trending Items, Featured Partners, and Active Orders.
  const discovery = await getHomeSurfaceContext(
    location.lat || undefined,
    location.lng || undefined,
    user?.id
  );

  const bannerItems = (discovery.sections?.find((s: any) => s.id === 'trending')?.data || []).slice(0, 3);
  const discoveryItems = (discovery.sections?.find((s: any) => s.id === 'trending')?.data || []).slice(0, 12);

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto animate-in font-sans selection:bg-[#D91B24]/10 bg-white">
      <main className="pb-24">
        <h1 className="sr-only">Wyshkit Salt Bae - Premium Gifting and Stores</h1>
        {!category && (
          <Masthead
            locationName={location?.name || 'Bangalore'}
            status={systemStatus}
          />
        )}

        {/* WYSHKIT 2026: Discovery Sections (Server Driven) */}
        {discovery.sections && discovery.sections.map((section: any) => (
          <SurfaceErrorBoundaryWithRouter key={section.id} surfaceName={section.title}>
            <BlocksEngine blocks={[section]} />
          </SurfaceErrorBoundaryWithRouter>
        ))}

        <div className="mt-4">
          <SurfaceErrorBoundaryWithRouter surfaceName="Discover" fallback={<DiscoveryErrorFallback />}>
            <Suspense fallback={<HomeSkeleton />}>
              <AsyncDiscoveryGrid
                category={category}
                categories={discovery.categories}
                preloadedItems={discoveryItems}
              />
            </Suspense>
          </SurfaceErrorBoundaryWithRouter>
        </div>
      </main>
    </div>
  );
}

/**
 * WYSHKIT 2026: Surface Components
 * These handle rendering slices of the pre-fetched "Surface Context".
 */

async function AsyncDiscoveryGrid({
  category,
  categories,
  preloadedItems
}: {
  category: string | null;
  categories: any[];
  preloadedItems: WyshkitItem[];
}) {

  const selectedCategoryName = category
    ? (categories.find((c: any) => c.slug === category) as any)?.name
    : null;

  // If filtering by category, fetch explicitly. Otherwise use preloaded slice.
  let initialItems: WyshkitItem[] = preloadedItems;

  let totalCount: number | undefined;
  if (category) {
    const itemsRes = await getFilteredItems({ limit: 24, category });
    initialItems = itemsRes.data?.items || [];
    totalCount = itemsRes.data?.total;
  } else if (initialItems.length === 0) {
    const itemsRes = await getFilteredItems({ limit: 12 });
    initialItems = itemsRes.data?.items || [];
    totalCount = itemsRes.data?.total;
  } else {
    // preloadedItems came from getHomeDiscovery RPC — no exact total known
    // Set totalCount to preloadedItems.length to prevent over-fetch attempts
    // (RPC only returns limited results; genuine total would require separate count query)
    totalCount = preloadedItems.length;
  }

  if (initialItems.length === 0) {
    return (
      <section className="px-4 py-24 md:px-8">
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-zinc-50 rounded-[40px] border border-dashed border-zinc-200">
          <div className="size-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
            <span className="text-3xl">🧺</span>
          </div>
          <p className="text-lg font-black text-zinc-950 uppercase tracking-tighter">No items found</p>
          <p className="text-sm text-zinc-500 mt-2 font-medium">Try another category or check back later.</p>
        </div>
      </section>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8">
      <BlocksEngine
        blocks={[
          {
            id: 'discovery_grid',
            type: 'PARTNER_GROUPED_GRID',
            title: selectedCategoryName ? `${selectedCategoryName} for you` : 'Discover Items',
            subtitle: selectedCategoryName ? 'Curated stores' : 'Popular in your area',
            data: initialItems
          },
          {
            id: 'infinite_discovery',
            type: 'INFINITE_GRID',
            data: [], // Starts empty, InfiniteFlow handles it
            metadata: {
              category: category,
              totalCount: totalCount
            }
          }
        ]}
      />
    </div>
  );
}
/**
 * WYSHKIT 2026: Discovery Failure Fallback
 */
function DiscoveryErrorFallback() {
  return (
    <section className="px-4 py-12 md:px-8">
      <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-amber-50 rounded-[40px] border border-amber-100">
        <div className="size-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
          <span className="text-2xl text-amber-600">⚠️</span>
        </div>
        <p className="text-sm font-black text-amber-900 uppercase tracking-tighter">Connection Interrupted</p>
        <p className="text-[11px] text-amber-800/70 mt-2 font-medium max-w-[200px]">
          We're having trouble reaching our catalogs. Please refresh or try again later.
        </p>
      </div>
    </section>
  );
}



