import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getGlobalInitSurface } from "@/lib/actions/discovery/init";
import { getServerLocation } from "@/lib/actions/discovery/location";
import { HomeSkeleton } from "@/components/customer/home/HomeSkeleton";
import { ReorderRail } from "@/components/customer/home/ReorderRail";
import { ActiveOrdersBanner } from '@/components/customer/home/ActiveOrdersBanner';
import { cn } from "@/lib/utils";


import { CircleRail } from "@/components/ui/blocks/discovery/CircleRail";
import { CardRail } from "@/components/ui/blocks/discovery/CardRail";
import { Grid } from "@/components/ui/blocks/discovery/Grid";
import { BannerBento } from "@/components/ui/blocks/discovery/BannerBento";

import { getZeroTripUser } from '@/lib/auth/server';
import { cookies } from 'next/headers';

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: HomePageProps) {
  try {
    const { category = null } = await searchParams;

    // WYSHKIT 2026: Zero-Trip Auth Resolution
    const user = await getZeroTripUser();

    // WYSHKIT 2026: One-Trip Promise - Home data is fetched in Layout.
    // React.cache handles deduplication for concurrent RSC execution.
    const [location, globalInit] = await Promise.all([
      getServerLocation(user),
      getGlobalInitSurface(undefined, undefined, user?.id)
    ]);

    const discovery = globalInit.home;
    const error = (globalInit as any).error;
    const displayLocationName = location.name || 'Your Area';

    return (
      <div className="min-h-[100dvh] animate-in font-sans selection:bg-[#D91B24]/10 bg-[var(--background)]">
        <main className="pb-24">
          <h1 className="sr-only">Wyshkit Salt Bae - Premium Gifting and Stores</h1>

          <div className="max-w-[1440px] mx-auto">
            {!category && (
              <div className="px-4 md:px-8 space-y-8">
                {/* WYSHKIT 2026: Zeigarnik Banner (High Priority) */}
                {discovery.activeOrders?.length > 0 && (
                  <ActiveOrdersBanner orders={discovery.activeOrders} />
                )}

                {/* WYSHKIT 2026: BannerBento (The Hook) */}
                <BannerBento data={discovery.trendingProducts} />

                {/* WYSHKIT 2026: Reorder Rail (Low Priority / Discovery) */}
                {discovery.recentOrders?.length > 0 && (
                  <ReorderRail initialOrders={discovery.recentOrders} />
                )}
              </div>
            )}

            {/* Error Handling (Hardened for Production) */}
            {error && (
              <div id="discovery-error-well" className="mx-[var(--space-4)] md:mx-[var(--space-8)] mb-[var(--space-8)] p-[var(--space-6)] bg-[var(--primary-muted)] border border-[var(--primary-ring)] rounded-[var(--radius-3xl)] text-[var(--text-primary)] flex flex-col gap-[var(--space-3)] animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center gap-3 font-black tracking-tight">
                  <div className="size-8 rounded-full bg-[var(--destructive)] flex items-center justify-center">
                    <span className="w-2 h-2 bg-[var(--surface)] rounded-full animate-pulse" />
                  </div>
                  Discovery Engine: {String(error)}
                </div>
                <p className="text-sm font-medium opacity-80 leading-relaxed max-w-lg">
                  We're having trouble reaching our stores. Please try refreshing or checking your location settings.
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--destructive)] opacity-40">Technical Details (Dev Only)</p>
                    <pre className="text-xs bg-[var(--surface)]/60 p-4 rounded-[var(--radius-md)] font-mono overflow-auto border border-[var(--destructive)]/10">
                      {String(error)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-8">
              {/* Categories */}
              <section className="px-4 md:px-8">
                <CircleRail data={discovery.categories} context={{ selected_category: category }} />
              </section>

              {/* Trending Products */}
              {discovery.trendingProducts?.length > 0 && (
                <section className="px-4 md:px-8">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tighter">Trending Around You</h2>
                    <CardRail data={discovery.trendingProducts} />
                  </div>
                </section>
              )}

              {/* Featured Stores */}
              {discovery.featuredVendors?.length > 0 ? (
                <section className="px-4 md:px-8">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tighter">Top Stores Near You</h2>
                    <Grid data={discovery.featuredVendors} />
                  </div>
                </section>
              ) : !error && (
                <section className="px-[var(--space-4)] md:px-[var(--space-8)] py-[var(--space-20)] text-center border-2 border-dashed border-[var(--border)] rounded-[var(--radius-3xl)] mx-[var(--space-4)]">
                  <div className="max-w-xs mx-auto flex flex-col gap-2">
                    <p className="font-bold text-[var(--text-primary)]">No stores found nearby</p>
                    <p className="text-sm text-[var(--text-secondary)] italic">&quot;Coming soon to {location.name}...&quot;</p>
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="px-4 py-20 text-center min-h-[100dvh] bg-[var(--background)] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Something went wrong</h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm">We encountered an error while loading the home feed. Please refresh the page.</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-8 p-4 bg-[var(--surface-muted)] rounded-[var(--radius-md)] text-xs font-mono text-[var(--text-tertiary)] max-w-lg overflow-auto border border-[var(--border)]">
            {err.stack || err.message}
          </pre>
        )}
      </div>
    );
  }
}
