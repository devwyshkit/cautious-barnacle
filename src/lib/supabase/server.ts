import { createServerClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getSupabaseEnv } from '@/lib/env'
import { resilientFetch } from './resilience'

/**
 * WYSHKIT 2026: Standard Server Client
 * Uses the God-Level Resilience Fetch for India-region DNS failover.
 */
export async function createClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const { url, key } = getSupabaseEnv()

  return createServerClient<Database>(
    url,
    key,
    {
      global: {
        fetch: (u, o) => resilientFetch(u, { ...o, traceName: 'SERVER_CLIENT' })
      },
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
            // Server Component cookie restriction (expected)
          }
        },
      },
    }
  )
}

import { createClient as createBaseClient } from '@supabase/supabase-js'

/**
 * WYSHKIT 2026: Admin Client
 * Bypasses RLS - Uses same Resilience Layer.
 */
export async function createAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase Admin environment variables')
  }

  return createBaseClient<Database>(
    url,
    serviceRoleKey,
    {
      global: {
        fetch: (u, o) => resilientFetch(u, { ...o, traceName: 'ADMIN_CLIENT', timeoutMs: 12000 })
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

