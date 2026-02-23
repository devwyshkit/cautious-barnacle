import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PartnerStorePage } from '@/components/customer/PartnerStorePage';
import { getPartnerStoreData } from '@/lib/actions/discovery/partners';
import { PartnerSkeleton } from '@/components/customer/PartnerSkeleton';
import { MappedPartner } from '@/lib/types/partner';


/**
 * WYSHKIT 2026: Partner Store Page
 * Route: /partner/[id]
 * Section 3 Pattern 1: Intercepting Routes - Base route for partner store
 * 
 * When user navigates to /partner/[id], this renders the partner store.
 * Items within this store use intercepting routes to show as modals.
 * 
 * WYSHKIT 2026: Server-First Data Fetching - Fetch partner + items in parallel
 * 
 * Swiggy 2026 Pattern: Server-First Architecture
 * - Data fetched server-side in parallel before render
 * - Client Component receives props immediately (no Suspense needed for Client Components)
 * - No client-side data fetching waterfalls
 * 
 * Note: Suspense boundaries are for Server Components that stream data.
 * Client Components that receive props synchronously don't need Suspense boundaries.
 */
// export const experimental_ppr = true;

export default async function PartnerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { id } = await params;
  const { category } = await searchParams;

  return (
    <div className="min-h-screen">
      <Suspense fallback={<PartnerSkeleton />}>
        <AsyncPartnerContent id={id} category={category} />
      </Suspense>
    </div>
  );
}

async function AsyncPartnerContent({ id, category }: { id: string; category?: string }) {
  const { partner, blocks, error } = await getPartnerStoreData(id, category);

  if (!partner || error) {
    notFound();
  }

  return (
    <PartnerStorePage
      partnerId={id}
      initialData={(partner as unknown) as MappedPartner}
      blocks={blocks}
    />
  );
}
