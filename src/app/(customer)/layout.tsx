import { Suspense } from "react";
import { FloatingStack } from "@/components/customer/FloatingStack";
import { CartProvider } from "@/components/customer/CartProvider";
import { CartErrorBoundary } from "@/components/error/CartErrorBoundary";
import { getCart } from "@/lib/actions/cart/get-cart";
import { getServerLocation } from "@/lib/actions/discovery/location";
import { getGlobalInitSurface } from "@/lib/actions/discovery/init";
import { NavShell } from "@/components/layout/NavShell";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { LocationSheet } from "@/components/customer/LocationSheet";
import { ProfileSheet } from "@/components/customer/ProfileSheet";
import { SearchSheet } from "@/components/customer/SearchSheet";
import { ProductSheet } from "@/components/customer/ProductSheet";
import { OTPSheet } from "@/components/auth/OTPSheet";
import { AuthAutoTrigger } from "@/components/auth/AuthAutoTrigger";
import { CartSwitchSheet } from "@/components/customer/CartSwitchSheet";
import { logger } from "@/lib/logging/logger";
import { DraftTransaction } from "@/lib/types/personalization";
import { LocationData } from "@/lib/actions/discovery/location";
import { EMPTY_CART } from "@/lib/constants/cart";
import { headers, cookies } from "next/headers";
import { User } from "@supabase/supabase-js";
import { resolveUserPermissionsWithTimeout, UserPermissions } from "@/lib/auth/core";
import { getZeroTripUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

/**
 * WYSHKIT 2026: Customer Layout - Singleton State & Route-Based Navigation
 */
export const dynamic = 'force-dynamic';


export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <AsyncLayoutContent>
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
}: {
  children: React.ReactNode;
}) {
  let cartResult: { cart?: DraftTransaction, cartSessionId?: string, guestSessionId?: string | null } = {
    cart: EMPTY_CART,
    cartSessionId: 'empty',
    guestSessionId: null
  };
  let location: LocationData = { name: 'Select location', address: '', pincode: '' };
  let user: User | null = null;
  let permissions: UserPermissions | null = null;
  let home: any = null;
  let activeOrders: any[] = []; // Default fallback

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

    // WYSHKIT 2026: Zero-Trip Auth Resolution
    // If middleware injected a real ID, use it. If 'PENDING', we resolve in Stage 2.
    if (injectedUserId && injectedUserId !== 'PENDING') {
      user = await getZeroTripUser();
    }

    // Fallback Path: Standard resolution (only if cookie exists but header is PENDING/missing)
    if (!user && (hasAuthCookie || injectedUserId === 'PENDING')) {
      // NOTE: We don't block here anymore. We will resolve this inside the Parallel Stage 
      // to avoid delaying the start of the layout render.
    }

    // Stage 2: Parallel fetch: No waterfall, shared user context
    // WYSHKIT 2026: One-Trip Promise - Home + Cart + Location resolution in parallel
    // Location resolution is Zero-Trip if headers exist.
    const locRes = await getServerLocation(user).catch(err => {
      logger.error('getServerLocation failed:', err);
      return { name: 'Select location', address: '', pincode: '', lat: undefined, lng: undefined };
    });

    const [globalInit, permsRes] = await Promise.all([
      // CONSOLIDATED TRIP: getGlobalInitSurface fetches both home and cart data.
      // It also now handles user resolution if it was 'PENDING'.
      getGlobalInitSurface(
        locRes.lat,
        locRes.lng,
        user?.id || (injectedUserId === 'PENDING' ? 'RESOLVE' : undefined),
        (await (await import('@/lib/session')).getGuestSessionIdReadOnly()) ?? undefined
      ).catch(err => {
        logger.error('getGlobalInitSurface failed:', err);
        return { home: null, cart: { cart: EMPTY_CART, cartSessionId: 'error' } };
      }),
      user ? resolveUserPermissionsWithTimeout(supabase, user.id).catch(err => {
        logger.error('resolveUserPermissions failed:', err);
        return null;
      }) : (injectedUserId === 'PENDING' ? Promise.resolve('DEFERRED') : Promise.resolve(null))
    ]);

    location = locRes;
    const { cart: mappedCartResult, home: homeData } = globalInit;
    home = homeData;
    cartResult = {
      cart: mappedCartResult.cart,
      cartSessionId: mappedCartResult.cartSessionId,
      guestSessionId: null // Handled by RPC internally
    };
    permissions = typeof permsRes === 'object' ? permsRes : null;
    activeOrders = home?.activeOrders || [];
  } catch (error) {
    logger.error('AsyncLayoutContent Error:', error);
  }

  // Stage 3: Hydrate Client State
  const initialCart = cartResult.cart || EMPTY_CART;
  const guestSessionId = cartResult.guestSessionId ?? null;

  // WYSHKIT 2026: Global UI Sheets
  // These are handled by UIProvider state, but mounted here for layout context.
  return (
    <CartProvider initialCart={initialCart} guestSessionId={guestSessionId}>
      <NavShell
        initialLocation={location}
        mastheadProps={{
          status: (home as any)?.metadata?.system_status ?? undefined,
          etaMinutes: (home as any)?.metadata?.eta_minutes ?? undefined,
          locationName: location.name
        }}
      >
        {children}
      </NavShell>
      <CartErrorBoundary>
        <FloatingStack activeOrders={activeOrders} key={cartResult.cartSessionId} />
      </CartErrorBoundary>

      {/* Global Intent-Based Sheets (The 7 Sheets Mandate) */}
      <CartDrawer />
      <LocationSheet />
      <ProfileSheet />
      <SearchSheet />
      <OTPSheet />
      <ProductSheet />
      <CartSwitchSheet />

      <Suspense fallback={null}>
        <AuthAutoTrigger />
      </Suspense>
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
