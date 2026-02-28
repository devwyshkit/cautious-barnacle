import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { VendorStorePage } from '@/components/customer/VendorStorePage';
import { getVendorStoreData } from '@/lib/actions/discovery/vendors';
import { VendorSkeleton } from '@/components/customer/VendorSkeleton';
import { MappedVendor } from '@/lib/types/vendor';


/**
 * WYSHKIT 2026: Vendor Store Page
 * Route: /vendor/[id]
 * Section 3 Pattern 1: Intercepting Routes - Base route for vendor store
 * 
 * When user navigates to /vendor/[id], this renders the vendor store.
 * Products within this store use intercepting routes to show as modals.
 * 
 * WYSHKIT 2026: Server-First Data Fetching - Fetch vendor + products in parallel
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

export default async function VendorPage({
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
      <Suspense fallback={<VendorSkeleton />}>
        <AsyncVendorContent id={id} category={category} />
      </Suspense>
    </div>
  );
}

async function AsyncVendorContent({ id, category }: { id: string; category?: string }) {
  const { vendor, products, productsGroupedByCategory, categories, error } = await getVendorStoreData(id, category);

  if (!vendor || error) {
    notFound();
  }

  return (
    <VendorStorePage
      vendorId={id}
      initialData={(vendor as unknown) as MappedVendor}
      products={products}
      productsGroupedByCategory={productsGroupedByCategory}
      categories={categories}
    />
  );
}
