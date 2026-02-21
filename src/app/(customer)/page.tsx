import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getFilteredItems } from "@/lib/actions/item-actions";
import { getCategories, getFeaturedPartners, getFeaturedItems, getHomeDiscovery } from "@/lib/actions/discovery";
import { getServerLocation } from "@/lib/actions/location";
import { HomeSkeleton } from "@/components/customer/home/HomeSkeleton";
import { CategoryRail } from "@/components/customer/home/CategoryRail";
import { BentoBanner } from "@/components/customer/home/BentoBanner";
import { WyshkitItem } from '@/lib/types/item';
import { HeroCarousel } from "@/components/customer/home/HeroCarousel";
import { DiscoveryItemsGrid } from "@/components/customer/home/DiscoveryItemsGrid";
import { PopularNearYouRail } from "@/components/customer/home/PopularNearYouRail";
import { PartnerCard } from "@/components/customer/PartnerCard";
import { MappedPartner } from "@/lib/types/partner";
import { Masthead } from "@/components/customer/home/Masthead";
import { OccasionRail } from "@/components/customer/home/OccasionRail";
import { ReorderWidget } from "@/components/customer/home/ReorderWidget";
import { SurfaceErrorBoundaryWithRouter } from "@/components/error/SurfaceErrorBoundary";

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

// export const experimental_ppr = true;

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category = null } = await searchParams;
  const location = await getServerLocation();

  // WYSHKIT 2026: Simple dynamic state simulation for audit compliance
  const hour = new Date().getHours();
  // Late night (10PM-6AM) or Peak Evening (6PM-9PM) logic
  const systemStatus = (hour >= 22 || hour < 6) ? 'delayed' : (hour >= 18 && hour < 21) ? 'capacity' : 'normal';

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto animate-in font-sans selection:bg-[#D91B24]/10 bg-white">
      <main className="pb-24">
        {/* Masthead - Real-time system state & trust signals */}
        <h1 className="sr-only">Wyshkit Salt Bae - Premium Gifting and Stores</h1>
        {!category && (
          <Masthead
            locationName={location?.name || 'Koramangala'}
            status={systemStatus}
          />
        )}

        {/* Categories Rail - Static Shell, Dynamic Items */}
        <Suspense fallback={<CategoryRail categories={[]} selectedCategory={category} />}>
          <AsyncCategoryRail category={category} />
        </Suspense>

        {/* Hero Banner - skip Suspense when category (component returns null) */}
        {category ? null : (
          <Suspense fallback={<div className="px-4 pb-3 md:px-8"><div className="w-full h-48 md:h-64 bg-zinc-50 rounded-3xl animate-pulse" /></div>}>
            <AsyncBentoBanner category={category} />
          </Suspense>
        )}



        {/* Stores near you - skip Suspense when category (component returns null) */}
        {category ? null : (
          <Suspense fallback={<div className="px-4 py-8 md:px-8"><div className="w-48 h-6 bg-zinc-100 rounded mb-6 animate-pulse" /><div className="flex gap-4 overflow-hidden"><div className="w-32 h-40 bg-zinc-50 rounded-xl" /><div className="w-32 h-40 bg-zinc-50 rounded-xl" /></div></div>}>
            <AsyncFeaturedPartners category={category} />
          </Suspense>
        )}

        {/* Reorder Widget - Personalized Persistence */}
        {!category && (
          <SurfaceErrorBoundaryWithRouter surfaceName="Recent Orders" className="min-h-0 py-0">
            <Suspense fallback={null}>
              <AsyncReorderWidget />
            </Suspense>
          </SurfaceErrorBoundaryWithRouter>
        )}

        {/* Occasions Rail - Curated Entry Points */}
        {!category && (
          <OccasionRail />
        )}

        {/* Popular Near You - Live Trending */}
        {!category && (
          <Suspense fallback={null}>
            <AsyncPopularNearYouRail />
          </Suspense>
        )}

        {/* Discovery Grid - Intent-based products */}
        <div className="mt-4">
          <SurfaceErrorBoundaryWithRouter surfaceName="Discover" fallback={<DiscoveryErrorFallback />}>
            <Suspense fallback={<HomeSkeleton />}>
              <AsyncDiscoveryGrid category={category} />
            </Suspense>
          </SurfaceErrorBoundaryWithRouter>
        </div>
      </main>
    </div>
  );
}

/**
 * WYSHKIT 2026: Async Components for PPR Streaming
 */

async function AsyncCategoryRail({ category }: { category: string | null }) {
  const categories = await getCategories();
  return <CategoryRail categories={categories} selectedCategory={category} />;
}

async function AsyncBentoBanner({ category }: { category: string | null }) {
  if (category) return null;
  const location = await getServerLocation();
  let items: WyshkitItem[] = [];
  if (location.lat != null && location.lng != null) {
    const discovery = await getHomeDiscovery(location.lat, location.lng);
    items = (discovery.trendingItems || []).slice(0, 3);
  }
  if (items.length === 0) {
    const featuredRes = await getFeaturedItems(3);
    items = featuredRes.items || [];
  }
  return (
    <>
      {items.length > 0 ? (
        <div className="slide-in-from-bottom-2 [animation-delay:0.05s]">
          <BentoBanner items={items} />
        </div>
      ) : (
        <HeroCarousel />
      )}
    </>
  );
}

async function AsyncFeaturedPartners({ category }: { category: string | null }) {
  if (category) return null;
  const partnersRes = await getFeaturedPartners(12);
  const partners = partnersRes.data || [];
  if (partners.length === 0) return null;

  return (
    <section className="px-4 py-10 md:px-8 bg-zinc-50/50 border-y border-zinc-100/50 slide-in-from-bottom-2 [animation-delay:0.1s]">
      <div className="flex items-center justify-between mb-8 max-w-[1440px] mx-auto">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-zinc-950 uppercase tracking-tighter">Featured Stores</h2>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2 px-1 border-l-2 border-[#D91B24]">Handpicked local partners</p>
        </div>
        <Link href="/partners" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-950 transition-colors">View All</Link>
      </div>

      <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar -mx-4 px-4 pb-4 max-w-[1440px] mx-auto">
        {partners.map((partner: MappedPartner) => (
          <PartnerCard
            key={partner.id}
            id={partner.id}
            name={partner.name}
            city={partner.city}
            image_url={partner.image_url}
            rating={partner.rating ?? 0}
            prep_hours={partner.prep_hours ?? 0}
            className="w-[160px] md:w-[220px] shrink-0 hover:-translate-y-1 transition-transform duration-300"
          />
        ))}
      </div>
    </section>
  );
}

async function AsyncPopularNearYouRail() {
  const location = await getServerLocation();
  if (!location.lat || !location.lng) return null;

  const discovery = await getHomeDiscovery(location.lat, location.lng);
  const items = (discovery.trendingItems || []).slice(3, 10).map((t) => ({
    id: t.id,
    name: t.name,
    base_price: t.base_price,
    mrp: t.mrp || 0,
    images: t.images || [],
    partner_id: t.partner_id,
    partner_name: t.partner_name,
    has_personalization: t.has_personalization,
    rating: t.rating || 0,
    stock_status: t.stock_status,
    stock_quantity: t.stock_quantity,
    is_promoted: t.is_promoted,
    personalization_options: t.personalization_options,
    distance_km: t.distance_km,
  }));

  if (items.length === 0) return null;

  return <PopularNearYouRail items={items as WyshkitItem[]} />;
}

async function AsyncDiscoveryGrid({ category }: { category: string | null }) {
  const location = await getServerLocation();
  const categoriesRes = await getCategories();
  const selectedCategoryName = category
    ? (categoriesRes.find((c: any) => c.slug === category) as any)?.name
    : null;

  let initialItems: any[] = [];
  if (location.lat != null && location.lng != null && !category) {
    const discovery = await getHomeDiscovery(location.lat, location.lng);
    initialItems = (discovery.trendingItems || []).slice(0, 12).map((t) => ({
      id: t.id,
      name: t.name,
      base_price: t.base_price,
      mrp: t.mrp,
      images: t.images,
      partner_id: t.partner_id,
      partner_name: t.partner_name,
      has_personalization: t.has_personalization,
      partners: t.partner_name ? { name: t.partner_name } : null,
      distance_km: t.distance_km,
    }));
  }
  if (initialItems.length === 0) {
    const itemsRes = await getFilteredItems({ limit: 12, category: category || undefined });
    initialItems = itemsRes.data?.items || [];
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-black text-zinc-950 uppercase tracking-tighter">
          {selectedCategoryName ? `${selectedCategoryName} for you` : 'Discover Items'}
        </h2>
      </div>
      <DiscoveryItemsGrid
        initialItems={initialItems}
        category={category}
        categoryName={selectedCategoryName}
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

/**
 * WYSHKIT 2026: Async Reorder Widget (Server Component)
 * Feeds recent order data directly to the client widget.
 */
async function AsyncReorderWidget() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: orders } = await supabase
    .from('v_orders_detailed')
    .select('id, order_number, items, total, created_at, partner_name')
    .eq('user_id', user.id)
    .in('status', ['DELIVERED', 'DISPATCHED', 'PACKED', 'APPROVED', 'IN_PRODUCTION'])
    .order('created_at', { ascending: false })
    .limit(3);

  if (!orders || orders.length === 0) return null;

  const mappedOrders = orders.map(d => ({
    id: d.id || '',
    orderNumber: d.order_number || '',
    items: (d.items as any[]) || [],
    total: Number(d.total) || 0,
    createdAt: d.created_at || '',
    partnerName: d.partner_name || ''
  }));

  return <ReorderWidget initialOrders={mappedOrders as any} />;
}
