import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { logger } from '@/lib/logging/logger'
import { getSupabaseEnvSafe } from '@/lib/env'

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
    const isPartnerHost = host.startsWith('partner.')
    const isAdminHost = host.startsWith('admin.')

    // WYSHKIT 2026: Strict Prefix Routing
    // All partner admin routes now exclusively own the /partner prefix.
    // Customer facing stores have been moved to /store/[id].
    const isPartnerAdminRoute = pathname.startsWith('/partner');

    // Path-based fallback for local dev
    const isAdminSurface = isAdminHost || pathname.startsWith('/admin')
    // Only treat as partner surface if it's a partner admin route (not customer-facing routes)
    const isPartnerSurface = isPartnerHost || isPartnerAdminRoute

    // Auth Routes
    const isPartnerLogin = pathname === '/partner/login' || (isPartnerHost && pathname === '/login')
    const isAdminLogin = pathname === '/admin/login' || (isAdminHost && pathname === '/login')
    const isGlobalLogin = pathname === '/login' || pathname === '/signup' || pathname === '/auth/login'

    // WYSHKIT 2026: Middleware Diet - Session refresh only, no DB queries
    // Role/KYC checks delegated to layouts (getAdminSession, getPartnerFromSession)
    let user = null
    try {
      const { data } = await supabase.auth.getSession()
      user = data?.session?.user || null
    } catch {
    }

    const roles = user?.app_metadata?.roles || [user?.app_metadata?.role || 'customer']
    const isAdmin = roles.includes('admin')
    const isPartner = roles.includes('partner')

    // --- ACCESS CONTROL ---

    const isAuthRoute = isPartnerLogin || isAdminLogin || isGlobalLogin

    // A. Guest Access (Not Logged In)
    if (!user) {
      if (isAdminSurface && !isAdminLogin) return createRedirectResponse('/admin/login')
      if (isPartnerSurface && !isPartnerLogin) return createRedirectResponse('/partner/login')

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
    // Role enforcement: admin surface requires app_metadata admin; partner surface deferred to layout
    if (user) {
      if (isAdminSurface && !isAdmin && !isAdminLogin) {
        return createRedirectResponse(isPartner ? '/partner' : '/')
      }
      // Partner surface: let through; (partner)/layout.tsx does DB-backed partner+KYC check

      // 2. Login Page Logic (Already logged in)
      if (isAuthRoute) {
        if (isAdminLogin && isAdmin) return createRedirectResponse('/admin')
        if (isPartnerLogin && isPartner) return createRedirectResponse('/partner')

        if (isGlobalLogin) {
          if (isAdmin) return createRedirectResponse('/admin')
          if (isPartner) return createRedirectResponse('/partner')
          return createRedirectResponse('/')
        }

        // If logged in but on the "wrong" login page, redirect to correct dashboard
        if (isPartnerLogin && isAdmin && !isPartner) return createRedirectResponse('/admin')
        if (isAdminLogin && isPartner && !isAdmin) return createRedirectResponse('/partner')
      }
    }

    // C. Entry Redirects
    if (pathname === '/dashboard') {
      if (isAdmin) return createRedirectResponse('/admin')
      if (isPartner) return createRedirectResponse('/partner')
      return createRedirectResponse('/profile')
    }


    return supabaseResponse
  } catch (error) {
    logger.error('Middleware runtime error', error)
    return NextResponse.next()
  }
}
