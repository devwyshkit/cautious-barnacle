import { SurfaceErrorBoundaryWithRouter } from "@/components/error/SurfaceErrorBoundary";
import Script from "next/script";

export const experimental_ppr = true;

/**
 * WYSHKIT 2026: Checkout Layout Shell
 * Swiggy 2026 Pattern: Zero Overengineering. Layout acts strictly as a UI Shell.
 */
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SurfaceErrorBoundaryWithRouter surfaceName="Checkout" showHomeButton>
      <div className="min-h-screen bg-white">
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        {children}
      </div>
    </SurfaceErrorBoundaryWithRouter>
  );
}
