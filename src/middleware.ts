import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { logger } from '@/lib/logging/logger'

export async function middleware(request: NextRequest) {
  try {
    // 1. Resolve Session and Auth
    const supabaseResponse = await updateSession(request)

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

    // 3. Create path-through response with updated request headers
    const finalResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    // 4. Merge cookies/headers from supabaseResponse (important for auth sessions)
    // Copy all cookies and headers set by updateSession
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie.name, cookie.value, cookie)
    })

    // Copy other important headers (like x-middleware-cache)
    supabaseResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-type') {
        finalResponse.headers.set(key, value)
      }
    })

    return finalResponse
  } catch (error) {
    // CRITICAL: Middleware errors cause 500 for ALL requests
    // Log error but don't crash - allow request to proceed
    logger.error('Error in updateSession middleware', error)

    // Return a basic response to allow the request to proceed
    // This prevents middleware from crashing the entire app
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
    * Match all request paths except for the ones starting with:
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico (favicon file)
    * Feel free to modify this pattern to include more paths.
    */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

