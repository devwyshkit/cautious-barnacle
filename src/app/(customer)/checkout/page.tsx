import { Suspense } from "react";
import { getCheckoutData } from "@/lib/actions/checkout/checkout";
import { CheckoutLayoutClient } from "@/components/customer/checkout/CheckoutLayoutClient";

/**
 * WYSHKIT 2026: Intent-Based Checkout Page
 * Swiggy 2026 Pattern: Server-side data hydration in Page (Zero Reinvention)
 */
export default async function CheckoutPage() {
  const checkoutData = await getCheckoutData();

  return (
    <Suspense fallback={null}>
      <CheckoutLayoutClient data={checkoutData} />
    </Suspense>
  );
}
