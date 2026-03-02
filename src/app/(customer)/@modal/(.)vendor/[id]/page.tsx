import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { VendorStorePage } from '@/components/customer/VendorStorePage';
import { getVendorStoreData } from '@/lib/actions/discovery/vendors';
import { VendorSkeleton } from '@/components/customer/VendorSkeleton';
import { MappedVendor } from '@/lib/types/vendor';

/**
 * WYSHKIT 2026: Vendor storefront = Page (destination, not Sheet)
 * 
 * When user navigates to /vendor/[id], Next.js activates this intercepting route.
 * We MUST render the actual store content here to prevent a blank screen.
 * WYSHKIT 2026 Pattern: The store is a focus destination.
 */
export default async function InterceptedVendorPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ category?: string }>;
}) {
    const { id } = await params;
    const { category } = await searchParams;

    return (
        <div className="min-h-[100dvh]">
            <Suspense fallback={<VendorSkeleton />}>
                <AsyncVendorContent id={id} category={category} />
            </Suspense>
        </div>
    );
}

async function AsyncVendorContent({ id, category }: { id: string; category?: string }) {
    const { vendor, products, productsGroupedByCategory, categories, error } = await getVendorStoreData(id, category);

    if (!vendor || error) {
        // If it's a parallel route integrity check (initial load), this might trigger.
        // We fall through to notFound which is handled by the root.
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
