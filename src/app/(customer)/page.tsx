import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getHomeSurfaceContext } from "@/lib/actions/discovery/home";
import { getFilteredItems } from "@/lib/actions/discovery/search";
import { getServerLocation } from "@/lib/actions/discovery/location";
import { HomeSkeleton } from "@/components/customer/home/HomeSkeleton";
import { WyshkitItem } from '@/lib/types/item';
import { BlocksEngine } from "@/components/ui/BlocksEngine";
import { Masthead } from "@/components/customer/home/Masthead";
import { ReorderWidget } from "@/components/customer/home/ReorderWidget";
import { cn } from "@/lib/utils";
import { SurfaceErrorBoundaryWithRouter } from "@/components/error/SurfaceErrorBoundary";


import { CircleRail } from "@/components/ui/blocks/discovery/CircleRail";
import { CardRail } from "@/components/ui/blocks/discovery/CardRail";
import { Grid } from "@/components/ui/blocks/discovery/Grid";
import { BannerBento } from "@/components/ui/blocks/discovery/BannerBento";

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category = null } = await searchParams;
  const location = await getServerLocation();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const discovery = await getHomeSurfaceContext(
    location.lat || undefined,
    location.lng || undefined,
    user?.id
  );

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto animate-in font-sans selection:bg-[#D91B24]/10 bg-white">
      <main className="pb-24">
        <h1 className="sr-only">Wyshkit Salt Bae - Premium Gifting and Stores</h1>

        <Masthead
          status={discovery.metadata?.system_status as 'normal' | 'delayed' | 'capacity'}
          locationName={location.name || 'Your Area'}
        />

        {!category && discovery.activeOrders?.length > 0 && (
          <ReorderWidget initialOrders={discovery.metadata?.orders} />
        )}

        <div className="mt-2 flex flex-col gap-8">
          {/* Categories */}
          <section className="px-4 md:px-8">
            <CircleRail data={discovery.categories} context={{ selected_category: category }} />
          </section>

          {/* Trending Items */}
          {discovery.trendingItems?.length > 0 && (
            <section className="px-4 md:px-8">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-black text-zinc-950 tracking-tighter">Trending Around You</h2>
                <CardRail data={discovery.trendingItems} />
              </div>
            </section>
          )}

          {/* Featured Stores */}
          {discovery.featuredPartners?.length > 0 && (
            <section className="px-4 md:px-8">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-black text-zinc-950 tracking-tighter">Top Stores Near You</h2>
                <Grid data={discovery.featuredPartners} />
              </div>
            </section>
          )}
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
  metadata
}: {
  category: string | null;
  categories: any[];
  metadata?: any;
}) {
  const selectedCategoryName = category
    ? (categories.find((c: any) => c.slug === category) as any)?.name
    : null;

  const itemsRes = await getFilteredItems({ limit: 24, category: category || undefined });
  const initialItems = itemsRes.data?.items || [];
  const totalCount = itemsRes.data?.total;

  const blocks = [
    {
      id: 'categories_rail',
      type: 'CIRCLE_RAIL' as const,
      title: "What's on your mind?",
      data: categories,
      metadata: { selected_category: category }
    },
    ...(initialItems.length > 0 ? [{
      id: 'discovery_grid',
      type: 'PARTNER_GROUPED_GRID' as const,
      title: selectedCategoryName || 'Discover',
      data: initialItems
    }] : []),
    {
      id: 'infinite_discovery',
      type: 'INFINITE_GRID' as const,
      data: [],
      metadata: {
        category: category,
        totalCount: totalCount
      }
    }
  ];

  if (initialItems.length === 0 && category) {
    return (
      <div className="flex flex-col gap-6">
        <BlocksEngine blocks={[blocks[0]]} context={metadata} />
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-zinc-50 rounded-[32px] border border-dashed border-zinc-200 mx-4">
          <span className="text-3xl mb-4 grayscale">🧺</span>
          <p className="text-sm font-black text-zinc-950 uppercase tracking-widest">No items found</p>
          <p className="text-[11px] text-zinc-400 mt-1 font-bold uppercase tracking-tighter">Try another category</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto pb-24">
      <BlocksEngine
        blocks={blocks}
        context={{ ...metadata, selected_category: category }}
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
        <p className="text-sm font-black text-amber-900 tracking-tighter">Connection Interrupted</p>
        <p className="text-[11px] text-amber-800/70 mt-2 font-medium max-w-[200px]">
          We're having trouble reaching our catalogs. Please refresh or try again later.
        </p>
      </div>
    </section>
  );
}



