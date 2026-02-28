import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { logger } from '@/lib/logging/logger'
import { getSupabaseEnvSafe } from '@/lib/env'
import { getVendorFromSession } from '@/lib/auth/server';

export async function updateSession(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname
    const host = request.headers.get('host') || ''

    let supabaseResponse = NextResponse.next({ request })

    const env = getSupabaseEnvSafe()
    if (!env) return supabaseResponse

    const supabase = createServerClient(env.url, env.key, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          } catch {
          }
        },
      },
    })

    const createRedirectResponse = (url: string) => {
      const response = NextResponse.redirect(new URL(url, request.url))
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, cookie)
      })
      return response
    }

    // --- SUBDOMAIN & SURFACE DETECTION ---
    const isVendorHost = host.startsWith('vendor.')
    const isAdminHost = host.startsWith('admin.')

    // WYSHKIT 2026: Strict Prefix Routing
    // All vendor admin routes now exclusively own the /vendor prefix.
    // Customer facing stores have been moved to /vendor/[id].
    const isVendorAdminRoute = pathname.startsWith('/vendor');

    // Path-based fallback for local dev
    const isAdminSurface = isAdminHost || pathname.startsWith('/admin')
    // Only treat as vendor surface if it's a vendor admin route (not customer-facing routes)
    const isVendorSurface = isVendorHost || isVendorAdminRoute

    // Auth Routes
    const isVendorLogin = pathname === '/vendor/login' || (isVendorHost && pathname === '/login')
    const isAdminLogin = pathname === '/admin/login' || (isAdminHost && pathname === '/login')
    const isGlobalLogin = pathname === '/login' || pathname === '/signup' || pathname === '/auth/login'

    // WYSHKIT 2026: Middleware Diet - Session refresh only, no DB queries
    // Role/KYC checks delegated to
    const vendor = await getVendorFromSession();
    let user = null
    try {
      const { data } = await supabase.auth.getSession()
      user = data?.session?.user || null
    } catch {
    }

    const roles = user?.app_metadata?.roles || [user?.app_metadata?.role || 'customer']
    const isAdmin = roles.includes('admin')
    const isVendor = roles.includes('vendor')

    // --- ACCESS CONTROL ---

    const isAuthRoute = isVendorLogin || isAdminLogin || isGlobalLogin

    // A. Guest Access (Not Logged In)
    if (!user) {
      if (isAdminSurface && !isAdminLogin) return createRedirectResponse('/admin/login')
      if (isVendorSurface && !isVendorLogin) return createRedirectResponse('/vendor/login')

      // WYSHKIT 2026: Progressive Authentication - Guests can access checkout
      // Auth required only at payment step (handled in PaymentIntentBlock)
      // Protect only truly sensitive paths
      const isCustomerProtected = ['/profile', '/orders'].some(p => pathname.startsWith(p))
      if (isCustomerProtected) {
        const url = new URL('/auth', request.url)
        url.searchParams.set('intent', 'signin')
        url.searchParams.set('returnUrl', pathname)
        return createRedirectResponse(url.toString())
      }
      return supabaseResponse
    }

    // B. Authenticated Access (Logged In)
    // Role enforcement: admin surface requires app_metadata admin; vendor surface deferred to layout
    if (user) {
      if (isAdminSurface && !isAdmin && !isAdminLogin) {
        return createRedirectResponse(isVendor ? '/vendor' : '/')
      }
      // Vendor surface: let through; (vendor)/layout.tsx does DB-backed vendor+KYC check

      // 2. Login Page Logic (Already logged in)
      if (isAuthRoute) {
        if (isAdminLogin && isAdmin) return createRedirectResponse('/admin')
        if (isVendorLogin && isVendor) return createRedirectResponse('/vendor')

        if (isGlobalLogin) {
          if (isAdmin) return createRedirectResponse('/admin')
          if (isVendor) return createRedirectResponse('/vendor')
          return createRedirectResponse('/')
        }

        // If logged in but on the "wrong" login page, redirect to correct dashboard
        if (isVendorLogin && isAdmin && !isVendor) return createRedirectResponse('/admin')
        if (isAdminLogin && isVendor && !isAdmin) return createRedirectResponse('/vendor')
      }
    }

    // C. Entry Redirects
    if (pathname === '/dashboard') {
      if (isAdmin) return createRedirectResponse('/admin')
      if (isVendor) return createRedirectResponse('/vendor')
      return createRedirectResponse('/profile')
    }


    return supabaseResponse
  } catch (error) {
    logger.error('Middleware runtime error', error)
    return NextResponse.next()
  }
}
