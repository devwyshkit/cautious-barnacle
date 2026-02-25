import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getHomeSurfaceContext } from "@/lib/actions/discovery/home";
import { getFilteredItems } from "@/lib/actions/discovery/search";
import { getServerLocation } from "@/lib/actions/discovery/location";
import { HomeSkeleton } from "@/components/customer/home/HomeSkeleton";
import { WyshkitItem } from '@/lib/types/product';
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

          {/* SWIGGY 2026: Diagnostic Dump (Temporary) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mx-4 md:mx-8 mb-4 p-2 bg-zinc-900 text-zinc-400 rounded-lg text-[8px] font-mono">
              <summary className="cursor-pointer hover:text-white">Debug: Home Surface Data ({discovery.featuredVendors?.length} vendors, {discovery.trendingProducts?.length} products)</summary>
              <pre className="mt-2 max-h-40 overflow-auto">
                {JSON.stringify({
                  vendors: discovery.featuredVendors?.length,
                  products: discovery.trendingProducts?.length,
                  categories: discovery.categories?.length,
                  hasError: !!(discovery as any).error,
                  location: { lat: location.lat, lng: location.lng, name: location.name }
                }, null, 2)}
              </pre>
            </details>
          )}

          {(discovery as any).error && (
            <div className="mx-4 md:mx-8 mb-8 p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-950 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex items-center gap-3 font-black tracking-tight">
                <div className="size-8 rounded-full bg-rose-500 flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
                Discovery Engine Offline
              </div>
              <p className="text-sm font-medium opacity-80 leading-relaxed max-w-lg">
                We are having trouble connecting to the Supabase API. This is common in certain regions (especially India) due to ISP-level DNS blocks on `.supabase.co` domains.
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-900/40">Technical Details</p>
                <pre className="text-[10px] bg-white/60 p-4 rounded-xl font-mono overflow-auto border border-rose-100/50">
                  {String((discovery as any).error)}
                </pre>
              </div>
              <div className="pt-4 flex flex-col gap-2">
                <p className="text-xs font-bold text-rose-900">Recommended Fixes:</p>
                <ul className="text-xs space-y-1 opacity-70 list-disc ml-4">
                  <li>Use a VPN or set your DNS to 8.8.8.8</li>
                  <li>Verify your <code className="bg-rose-100 px-1 rounded">/etc/hosts</code> mapping for the Supabase URL is correct.</li>
                  <li>Check if <code className="bg-rose-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> in your <code className="bg-rose-100 px-1 rounded">.env</code> matches your host entry.</li>
                </ul>
              </div>
            </div>
          )}

          <div className="max-w-[1440px] mx-auto">
            {!category && discovery.activeOrders?.length > 0 && (
              <div className="px-4 md:px-8">
                <ReorderWidget initialOrders={discovery.metadata?.orders} />
              </div>
            )}

            <div className="mt-2 flex flex-col gap-8">
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
      <div className="p-10 text-red-600 bg-red-50 min-h-screen font-mono">
        <h1 className="text-xl font-bold mb-4">Server Error (Debug)</h1>
        <pre className="whitespace-pre-wrap text-xs bg-white p-4 rounded border border-red-100 shadow-sm">
          {err.stack || err.message || String(err)}
        </pre>
      </div>
    );
  }
}




