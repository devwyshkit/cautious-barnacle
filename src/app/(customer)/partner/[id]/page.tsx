import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PartnerStorePage } from '@/components/customer/PartnerStorePage';
import { getPartnerStoreData } from '@/lib/actions/discovery';
import { PartnerSkeleton } from '@/components/customer/PartnerSkeleton';

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
export const experimental_ppr = true;

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      <Suspense fallback={<PartnerSkeleton />}>
        <AsyncPartnerContent id={id} />
      </Suspense>
    </div>
  );
}

async function AsyncPartnerContent({ id }: { id: string }) {
  const includeInactive = process.env.NODE_ENV === 'development';
  const { partner, items, error } = await getPartnerStoreData(id, includeInactive);

  if (!partner || error) {
    notFound();
  }

  return (
    <PartnerStorePage
      partnerId={id}
      initialData={(partner as any) || undefined}
      initialItems={items}
    />
  );
}
