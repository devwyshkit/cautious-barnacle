import { createServerClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getSupabaseEnv } from '@/lib/env'

export async function createClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const { url, key } = getSupabaseEnv()

  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
export async function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase Admin environment variables')
  }

  return createServerClient<Database>(
    url,
    serviceRoleKey,
    {
      cookies: {
        getAll: () => [],
        setAll: () => { },
      },
    }
  )
}

/**
 * WYSHKIT 2026: createAnonClient
 * Suitable for use inside unstable_cache as it does not access cookies().
 */
export async function createAnonClient() {
  const { url, key } = getSupabaseEnv()
  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll: () => [],
        setAll: () => { },
      },
    }
  )
}

