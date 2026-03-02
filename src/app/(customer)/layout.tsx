import { Suspense } from "react";
import { FloatingCartBar } from "@/components/customer/FloatingCartBar";
import { OrderTrackingBar } from "@/components/customer/OrderTrackingBar";
import { CartProvider } from "@/components/customer/CartProvider";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { CartErrorBoundary } from "@/components/error/CartErrorBoundary";
import { getCart } from "@/lib/actions/cart/get-cart";
import { getServerLocation } from "@/lib/actions/discovery/location";
import { getGlobalInitSurface } from "@/lib/actions/discovery/init";
import { NavShell } from "@/components/layout/NavShell";
import { logger } from "@/lib/logging/logger";
import { DraftTransaction } from "@/lib/types/personalization";
import { LocationData } from "@/lib/actions/discovery/location";
import { EMPTY_CART } from "@/lib/constants/cart";
import { headers, cookies } from "next/headers";
import { User } from "@supabase/supabase-js";
import * as AuthCoreLib from "@/lib/auth/core";
import { createClient } from "@/lib/supabase/server";
import { resolveUserPermissionsWithTimeout } from "@/lib/auth/core";

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
  let cartResult: { cart?: DraftTransaction, cartSessionId?: string, guestSessionId?: string | null } = {
    cart: EMPTY_CART,
    cartSessionId: 'empty',
    guestSessionId: null
  };
  let location: LocationData = { name: 'Select location', address: '', pincode: '' };
  let user: User | null = null;
  let permissions: AuthCoreLib.UserPermissions | null = null;
  let activeOrders: any[] = [];

  try {
    // Stage 1: Resolve Auth (Zero-Trip Strategy)
    // WYSHKIT 2026: Consume middleware-injected headers to avoid redundant DB trip.
    const headerList = await headers();
    const cookieStore = await cookies();
    const injectedUserId = headerList.get('x-wyshkit-user-id');
    const injectedUserEmail = headerList.get('x-wyshkit-user-email');

    // WYSHKIT 2026: Zero-Trip Guest Detection
    // If no injected header AND no auth cookie, we are 100% guest. Skip DB.
    // Cookie name pattern: sb-[project-id]-auth-token
    const supabaseProjectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').match(/https:\/\/([^.]+)\./)?.[1] || '';
    const hasAuthCookie = supabaseProjectRef ? (await cookieStore).has(`sb-${supabaseProjectRef}-auth-token`) : false;

    const supabase = await createClient();

    if (injectedUserId) {
      user = { id: injectedUserId, email: injectedUserEmail } as User;
    } else if (!hasAuthCookie) {
      // Zero-Trip Guest Path: No cookie = No user.
      user = null;
    } else {
      // Fallback Path: Standard resolution (only if cookie exists but header missing)
      const { data: { user: fetchedUser } } = await supabase.auth.getUser();
      user = fetchedUser;
    }

    // Stage 2: Parallel fetch: No waterfall, shared user context
    // WYSHKIT 2026: One-Trip Promise - Home + Cart + Location resolution in parallel
    // Location resolution is Zero-Trip if headers exist.
    const [locRes, globalInit, permsRes] = await Promise.all([
      getServerLocation(user).catch(err => {
        logger.error('getServerLocation failed:', err);
        return { name: 'Select location', address: '', pincode: '' };
      }),
      // CONSOLIDATED TRIP: getGlobalInitSurface fetches both home and cart data.
      getGlobalInitSurface(undefined, undefined, user?.id).catch(err => {
        logger.error('getGlobalInitSurface failed:', err);
        return { home: null, cart: { cart: EMPTY_CART, cartSessionId: 'error' } };
      }),
      user ? resolveUserPermissionsWithTimeout(supabase, user.id).catch(err => {
        logger.error('resolveUserPermissions failed:', err);
        return null;
      }) : Promise.resolve(null)
    ]);

    location = locRes;
    const { cart: mappedCartResult, home } = globalInit;
    cartResult = {
      cart: mappedCartResult.cart,
      cartSessionId: mappedCartResult.cartSessionId,
      guestSessionId: null // Handled by RPC internally
    };
    permissions = permsRes;
    activeOrders = home?.activeOrders || [];
  } catch (error) {
    logger.error('AsyncLayoutContent Error:', error);
  }

  // Stage 3: Hydrate Client State
  const initialCart = cartResult.cart || EMPTY_CART;
  const guestSessionId = cartResult.guestSessionId ?? null;

  return (
    <CartProvider initialCart={initialCart} guestSessionId={guestSessionId}>
      <NavShell initialLocation={location}>
        {children}
        {modal}
      </NavShell>
      <CartErrorBoundary>
        <FloatingCartBar key={cartResult.cartSessionId} />
        <CartDrawer />
      </CartErrorBoundary>
      <OrderTrackingBar initialOrders={activeOrders} />
    </CartProvider>
  );
}

function LayoutSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-[var(--background)]">
      <div className="fixed top-0 left-0 right-0 h-16 bg-[var(--surface)] border-b border-[var(--border)] z-[var(--z-nav)] flex items-center px-[var(--space-4)] md:px-[var(--space-8)]">
        <div className="w-32 h-6 bg-[var(--surface-muted)] rounded-[var(--radius-md)] animate-pulse" />
      </div>
      <div className="pt-16 px-[var(--space-4)] py-[var(--space-8)] md:px-[var(--space-8)] space-y-[var(--space-6)]">
        <div className="w-48 h-6 bg-[var(--surface-muted)] rounded-[var(--radius-sm)] animate-pulse" />
        <div className="flex gap-[var(--space-4)] overflow-hidden">
          <div className="w-32 h-40 bg-[var(--surface-muted)] rounded-[var(--radius-xl)] animate-pulse" />
          <div className="w-32 h-40 bg-[var(--surface-muted)] rounded-[var(--radius-xl)] animate-pulse" />
          <div className="w-32 h-40 bg-[var(--surface-muted)] rounded-[var(--radius-xl)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
