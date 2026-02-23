import { Suspense } from "react";
import { FloatingCartBar } from "@/components/customer/FloatingCartBar";
import { OrderTrackingBar } from "@/components/customer/OrderTrackingBar";
import { CartProvider } from "@/components/customer/CartProvider";
import { CartErrorBoundary } from "@/components/error/CartErrorBoundary";
import { getCart } from "@/lib/actions/cart/get-cart";
import { getServerLocation } from "@/lib/actions/discovery/location";
import { NavShell } from "@/components/layout/NavShell";
import { logger } from "@/lib/logging/logger";
import { DraftTransaction } from "@/lib/types/personalization";
import { LocationData } from "@/lib/actions/discovery/location";
import { EMPTY_CART } from "@/lib/constants/cart";

/**
 * WYSHKIT 2026: Customer Layout - Singleton State & Route-Based Navigation
 */

export default function CustomerLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <AsyncLayoutContent modal={modal}>
        {children}
      </AsyncLayoutContent>
    </Suspense>
  );
}

/**
 * WYSHKIT 2026: Parallel Hydration
 * This component fetches dynamic user data (Cart, Location) 
 * without blocking the static shell render.
 */
async function AsyncLayoutContent({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  let cartResult: { cart?: DraftTransaction, cartIdentity?: string, guestSessionId?: string | null } = {
    cart: EMPTY_CART,
    cartIdentity: 'empty',
    guestSessionId: null
  };
  let location: LocationData = { name: 'Select location', address: '', pincode: '' };

  try {
    // Parallel fetch: No waterfall
    const results = await Promise.all([
      getCart().catch(err => {
        logger.error('getCart failed:', err);
        return {
          cart: EMPTY_CART,
          cartIdentity: 'error',
          guestSessionId: null
        };
      }),
      getServerLocation().catch(err => {
        logger.error('getServerLocation failed:', err);
        return { name: 'Select location', address: '', pincode: '' };
      })
    ]);
    cartResult = results[0];
    location = results[1];
  } catch (error) {
    logger.error('AsyncLayoutContent Error:', error);
  }

  const initialCart = cartResult.cart || EMPTY_CART;
  const guestSessionId = cartResult.guestSessionId ?? null;

  return (
    <CartProvider initialCart={initialCart} guestSessionId={guestSessionId}>
      <NavShell initialLocation={location}>
        {children}
        {modal}
      </NavShell>
      <CartErrorBoundary>
        <FloatingCartBar key={cartResult.cartIdentity} />
      </CartErrorBoundary>
      <OrderTrackingBar />
    </CartProvider>
  );
}

function LayoutSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-50 z-30 flex items-center px-4 md:px-8">
        <div className="w-32 h-6 bg-zinc-100 rounded-lg animate-pulse" />
      </div>
      <div className="pt-16 px-4 py-8 md:px-8 space-y-6">
        <div className="w-48 h-6 bg-zinc-100 rounded animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          <div className="w-32 h-40 bg-zinc-50 rounded-xl animate-pulse" />
          <div className="w-32 h-40 bg-zinc-50 rounded-xl animate-pulse" />
          <div className="w-32 h-40 bg-zinc-50 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
