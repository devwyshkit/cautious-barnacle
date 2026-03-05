import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";
import { SurfaceErrorBoundaryWithRouter as ErrorBoundary } from "@/components/error/SurfaceErrorBoundary";
import { OrderTracker } from "@/components/customer/orders/OrderTracker";
import { OrderTrackerSkeleton } from "@/components/customer/orders/OrderTrackerSkeleton";
import { createClient } from "@/lib/supabase/server";

/**
 * WYSHKIT 2026: Order Details Page
 * Route: /orders/[id]
 * 
 * WYSHKIT 2026 Pattern: URL-addressable order details
 * - Slug-First Architecture (KERNEL Law 7)
 * - Resolves human-readable slugs (WK-XXXX) to IDs server-side
 */
export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const headerList = await headers();
  const userId = headerList.get('x-wyshkit-user-id');
  const { id } = await params;

  if (!userId) {
    redirect(`/?auth=true&returnUrl=/orders/${id}`);
  }

  // WYSHKIT 2026: Slug Resolver
  // If the ID is NOT a UUID (e.g. WK-260305-XXXX), we resolve it to the UUID first.
  let resolvedId = id;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (!isUuid) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .eq('order_number', id)
      .single();

    if (error || !data) {
      return notFound();
    }
    resolvedId = data.id;
  }

  return (
    <div className="min-h-[100dvh]">
      <ErrorBoundary surfaceName="Order Details">
        <Suspense fallback={<OrderTrackerSkeleton />}>
          <OrderTracker orderId={resolvedId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
