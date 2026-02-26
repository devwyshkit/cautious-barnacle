import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getHomeSurfaceContext } from "@/lib/actions/discovery/home";
import { getServerLocation } from "@/lib/actions/discovery/location";
import { HomeSkeleton } from "@/components/customer/home/HomeSkeleton";
import { Masthead } from "@/components/customer/home/Masthead";
import { ReorderRail } from "@/components/customer/home/ReorderRail";
import { ActiveOrdersBanner } from '@/components/customer/home/ActiveOrdersBanner';
import { cn } from "@/lib/utils";


import { CircleRail } from "@/components/ui/blocks/discovery/CircleRail";
import { CardRail } from "@/components/ui/blocks/discovery/CardRail";
import { Grid } from "@/components/ui/blocks/discovery/Grid";
import { BannerBento } from "@/components/ui/blocks/discovery/BannerBento";

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: HomePageProps) {
  try {
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
      <div className="min-h-screen animate-in font-sans selection:bg-[#D91B24]/10 bg-white">
        <main className="pb-24">
          <h1 className="sr-only">Wyshkit Salt Bae - Premium Gifting and Stores</h1>

          <Masthead
            status={discovery.metadata?.system_status as 'normal' | 'delayed' | 'capacity'}
            locationName={location.name || 'Your Area'}
          />

          <div className="max-w-[1440px] mx-auto">
            {!category && (
              <div className="px-4 md:px-8 space-y-8">
                {/* SWIGGY 2026: Zeigarnik Banner (High Priority) */}
                {discovery.activeOrders?.length > 0 && (
                  <ActiveOrdersBanner orders={discovery.activeOrders} />
                )}

                {/* SWIGGY 2026: BannerBento (The Hook) */}
                <BannerBento data={discovery.trendingProducts} />

                {/* SWIGGY 2026: Reorder Rail (Low Priority / Discovery) */}
                {discovery.recentOrders?.length > 0 && (
                  <ReorderRail initialOrders={discovery.recentOrders} />
                )}
              </div>
            )}

            {/* Error Handling (Hardened for Production) */}
            {(discovery as any).error && (
              <div className="mx-4 md:mx-8 mb-8 p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-950 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center gap-3 font-black tracking-tight">
                  <div className="size-8 rounded-full bg-rose-500 flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                  Unable to reach Discovery Engine
                </div>
                <p className="text-sm font-medium opacity-80 leading-relaxed max-w-lg">
                  We&apos;re having trouble connecting to our services. Please try refreshing the page or checking your internet connection.
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-rose-900/40">Technical Details (Dev Only)</p>
                    <pre className="text-[10px] bg-white/60 p-4 rounded-xl font-mono overflow-auto border border-rose-100/50">
                      {String((discovery as any).error)}
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
                    <h2 className="text-xl font-black text-zinc-950 tracking-tighter">Trending Around You</h2>
                    <CardRail data={discovery.trendingProducts} />
                  </div>
                </section>
              )}

              {/* Featured Stores */}
              {discovery.featuredVendors?.length > 0 ? (
                <section className="px-4 md:px-8">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-black text-zinc-950 tracking-tighter">Top Stores Near You</h2>
                    <Grid data={discovery.featuredVendors} />
                  </div>
                </section>
              ) : !(discovery as any).error && (
                <section className="px-4 md:px-8 py-20 text-center border-2 border-dashed border-zinc-100 rounded-3xl mx-4">
                  <div className="max-w-xs mx-auto flex flex-col gap-2">
                    <p className="font-bold text-zinc-900">No stores found nearby</p>
                    <p className="text-sm text-zinc-500 italic">&quot;Coming soon to {location.name}...&quot;</p>
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
      <div className="px-4 py-20 text-center min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">Something went wrong</h1>
        <p className="text-sm text-zinc-500 max-w-sm">We encountered an error while loading the home feed. Please refresh the page.</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-8 p-4 bg-zinc-50 rounded-xl text-[10px] font-mono text-zinc-400 max-w-lg overflow-auto border border-zinc-100">
            {err.stack || err.message}
          </pre>
        )}
      </div>
    );
  }
}
