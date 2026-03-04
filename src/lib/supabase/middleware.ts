import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { logger } from '@/lib/logging/logger'
import { getSupabaseEnvSafe } from '@/lib/env'
import { resilientFetch } from './resilience'
import type { User } from '@supabase/supabase-js'

/**
 * WYSHKIT 2026: Auth Session & Access Control Layer
 * 
 * Specifically optimized for Edge Runtime. Uses Fast-Failover Supabase client.
 */
export async function updateSession(request: NextRequest): Promise<{
    supabaseResponse: NextResponse,
    user: User | null,
    roles: string[]
}> {
    try {
        const host = request.headers.get('host') || '';
        const rawPathname = request.nextUrl.pathname;
        const pathname = rawPathname.endsWith('/') && rawPathname.length > 1 ? rawPathname.slice(0, -1) : rawPathname;

        // logger.info('Middleware Processing', { pathname, host });

        let supabaseResponse = NextResponse.next({
            request,
        })

        if (pathname.includes('/login')) {
            return { supabaseResponse, user: null, roles: [] }
        }

        const env = getSupabaseEnvSafe()
        if (!env) return { supabaseResponse, user: null, roles: ['customer'] }

        // WYSHKIT 2026: Middleware Resilience
        // Session refresh MUST NOT hang due to ISP DNS blocks.
        const supabase = createServerClient(env.url, env.key, {
            global: {
                fetch: (u, o) => resilientFetch(u, { ...o, traceName: 'MIDDLEWARE', timeoutMs: 5000 })
            },
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set({ name, value, ...options }))
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    } catch {
                        // Silently ignore cookie setting errors in middleware
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

        // WYSHKIT 2026: Precision Routing
        const vendorAdminPaths = ['/vendor/products', '/vendor/orders', '/vendor/financials', '/vendor/insights', '/vendor/personalization', '/vendor/login']
        const isVendorAdminRoute = pathname === '/vendor' || vendorAdminPaths.some(p => pathname.startsWith(p))

        // Auth Routes
        const isVendorLogin = pathname === '/vendor/login' || (isVendorHost && pathname === '/login')
        const isAdminLogin = pathname === '/admin/login' || (isAdminHost && pathname === '/login')
        const isGlobalLogin = ['/login', '/signup', '/auth/login'].includes(pathname)

        // Path-based fallback for local dev
        const isAdminSurface = isAdminHost || pathname === '/admin' || pathname.startsWith('/admin/')
        const isVendorSurface = isVendorHost || isVendorAdminRoute

        // WYSHKIT 2026: Middleware Diet - Session refresh only, no DB queries
        let user = null
        try {
            const { data } = await supabase.auth.getUser()
            user = data?.user || null
        } catch {
        }

        const roles = user?.app_metadata?.roles || [user?.app_metadata?.role || 'customer']
        const isAdmin = roles.includes('admin')
        const isVendor = roles.includes('vendor')

        // --- ACCESS CONTROL ---
        const isAuthRoute = isVendorLogin || isAdminLogin || isGlobalLogin

        // A. Guest Access (Not Logged In)
        if (!user) {
            if (isAdminSurface && !isAdminLogin) {
                return { supabaseResponse: createRedirectResponse('/admin/login'), user: null, roles: ['customer'] }
            }
            if (isVendorSurface && !isVendorLogin) {
                return { supabaseResponse: createRedirectResponse('/vendor/login'), user: null, roles: ['customer'] }
            }

            const isCustomerProtected = ['/profile', '/orders'].some(p => pathname.startsWith(p));
            if (isCustomerProtected) {
                const url = new URL('/auth', request.url)
                url.searchParams.set('intent', 'signin')
                url.searchParams.set('returnUrl', pathname)
                return { supabaseResponse: createRedirectResponse(url.toString()), user: null, roles: ['customer'] }
            }
            return { supabaseResponse, user: null, roles: ['customer'] }
        }

        // B. Authenticated Access (Logged In)
        if (user) {
            if (isAdminSurface && !isAdmin && !isAdminLogin) {
                return { supabaseResponse: createRedirectResponse(isVendor ? '/vendor' : '/'), user, roles }
            }

            if (isAuthRoute) {
                if (isAdminLogin && isAdmin) return { supabaseResponse: createRedirectResponse('/admin'), user, roles }
                if (isVendorLogin && isVendor) return { supabaseResponse: createRedirectResponse('/vendor'), user, roles }

                if (isGlobalLogin) {
                    if (isAdmin) return { supabaseResponse: createRedirectResponse('/admin'), user, roles }
                    if (isVendor) return { supabaseResponse: createRedirectResponse('/vendor'), user, roles }
                    return { supabaseResponse: createRedirectResponse('/'), user, roles }
                }

                if (isVendorLogin && isAdmin && !isVendor) return { supabaseResponse: createRedirectResponse('/admin'), user, roles }
                if (isAdminLogin && isVendor && !isAdmin) return { supabaseResponse: createRedirectResponse('/vendor'), user, roles }
            }
        }

        return { supabaseResponse, user, roles }
    } catch (error) {
        logger.error('Middleware runtime error', error)
        return { supabaseResponse: NextResponse.next(), user: null, roles: ['customer'] }
    }
}
