import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { logger } from '@/lib/logging/logger'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|vendor/login|admin/login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export async function middleware(request: NextRequest) {
  try {
    // 1. Resolve Session and Auth context (WYSHKIT 2026: Low-Latency Mode)
    // We only perform a full getUser() if we are on a PROTECTED route or AUTH route.
    // For the general home/search feed, we rely on cookie presence for x-header injection.
    const supabaseProjectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').match(/https:\/\/([^.]+)\./)?.[1] || '';
    const authCookieName = `sb-${supabaseProjectRef}-auth-token`;
    const hasAuthCookie = request.cookies.has(authCookieName);

    let user = null;
    let roles: string[] = ['customer'];
    let supabaseResponse = NextResponse.next({ request });

    // WYSHKIT 2026: Fast-Path Auth (Zero-Trip)
    // If we're on a public surface (Home) and have a cookie, we just assume "User" 
    // and let the Layout's One-Trip fetch do the heavy lifting.
    const isPublicSurface = ['/', '/search', '/vendor/'].includes(request.nextUrl.pathname) ||
      request.nextUrl.pathname.startsWith('/vendor/') ||
      request.nextUrl.pathname.startsWith('/product/');

    if (!isPublicSurface || request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/checkout')) {
      // Full session update only for protected/internal routes
      const sessionResult = await updateSession(request);
      supabaseResponse = sessionResult.supabaseResponse;
      user = sessionResult.user;
      roles = sessionResult.roles;
    }

    // 2. Resolve Location Context (Zero-Trip)
    const lat = request.cookies.get('wyshkit_lat')?.value
    const lng = request.cookies.get('wyshkit_lng')?.value
    const name = request.cookies.get('wyshkit_location_name')?.value

    const requestHeaders = new Headers(request.headers)
    if (lat && lng) {
      requestHeaders.set('x-wyshkit-location-lat', lat)
      requestHeaders.set('x-wyshkit-location-lng', lng)
      if (name) {
        requestHeaders.set('x-wyshkit-location-name', encodeURIComponent(name))
      }
    }

    requestHeaders.set('x-url', request.nextUrl.pathname)

    // WYSHKIT 2026: Zero-Trip Header Injection
    // If we have an auth cookie but skipped the DB check, we inject a 'USER_PENDING' state
    // This allows the Layout to know it MUST fetch the user in its One-Trip.
    if (user) {
      requestHeaders.set('x-wyshkit-user-id', user.id)
      requestHeaders.set('x-wyshkit-user-role', roles?.[0] || 'customer')
      requestHeaders.set('x-wyshkit-user-email', user.email || '')
    } else if (hasAuthCookie) {
      requestHeaders.set('x-wyshkit-user-id', 'PENDING')
    }

    const isRedirect = supabaseResponse.status >= 300 && supabaseResponse.status < 400
    if (isRedirect) return supabaseResponse

    const finalResponse = NextResponse.next({
      request: { headers: requestHeaders },
    })

    // Sync cookies back to client
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie.name, cookie.value, cookie)
    })

    return finalResponse
  } catch (error) {
    logger.error('Error in middleware runtime', error)
    return NextResponse.next()
  }
}
