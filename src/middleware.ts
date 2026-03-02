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
    // 1. Resolve Session and Auth context
    const { supabaseResponse, user, roles } = await updateSession(request)

    // 2. Resolve Location Context
    const lat = request.cookies.get('wyshkit_lat')?.value
    const lng = request.cookies.get('wyshkit_lng')?.value
    const name = request.cookies.get('wyshkit_location_name')?.value

    // WYSHKIT 2026: Edge Context Injection (Request Patching)
    const requestHeaders = new Headers(request.headers)
    if (lat && lng) {
      requestHeaders.set('x-wyshkit-location-lat', lat)
      requestHeaders.set('x-wyshkit-location-lng', lng)
      if (name) {
        requestHeaders.set('x-wyshkit-location-name', encodeURIComponent(name))
      }
    }

    // WYSHKIT 2026: Route Context Injection (for Layout-based Conditional Logic)
    requestHeaders.set('x-url', request.nextUrl.pathname)

    // Auth Context Injection (Request Patching for One-Trip)
    if (user) {
      requestHeaders.set('x-wyshkit-user-id', user.id)
      requestHeaders.set('x-wyshkit-user-role', roles?.[0] || 'customer')
      requestHeaders.set('x-wyshkit-user-email', user.email || '')
    }

    // 3. Handle Redirects from updateSession (Auth/Access Control)
    const isRedirect = supabaseResponse.status >= 300 && supabaseResponse.status < 400
    if (isRedirect) {
      return supabaseResponse
    }

    // 4. Create path-through response with updated request headers
    const finalResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    // 4. Merge cookies/headers from supabaseResponse (important for auth sessions)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie.name, cookie.value, cookie)
    })

    supabaseResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-type') {
        finalResponse.headers.set(key, value)
      }
    })

    return finalResponse
  } catch (error) {
    logger.error('Error in middleware runtime', error)
    return NextResponse.next()
  }
}
