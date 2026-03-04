import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SurfaceErrorBoundaryWithRouter as ErrorBoundary } from "@/components/error/SurfaceErrorBoundary";
import { OrderTracker } from "@/components/customer/orders/OrderTracker";
import { OrderTrackerSkeleton } from "@/components/customer/orders/OrderTrackerSkeleton";


/**
 * WYSHKIT 2026: Order Details Page
 * Route: /orders/[id]
 * 
 * WYSHKIT 2026 Pattern: URL-addressable order details
 * - Shareable order links
 * - Browser back/forward works
 * - Intent-based navigation
 */
export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const headerList = await headers();
  const userId = headerList.get('x-wyshkit-user-id');

  if (!userId) {
    const { id } = await params;
    redirect(`/?auth=true&returnUrl=/orders/${id}`);
  }

  const { id } = await params;

  return (
    <div className="min-h-[100dvh]">
      <ErrorBoundary surfaceName="Order Details">
        <Suspense fallback={<OrderTrackerSkeleton />}>
          <OrderTracker orderId={id} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
