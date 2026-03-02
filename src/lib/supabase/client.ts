import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getSupabaseEnv } from '@/lib/env'
import { resilientFetch } from './resilience'

/**
 * WYSHKIT 2026: Browser Singleton Client
 * Maintains a single instance to prevent leaking multiple Auth listeners in one session.
 * Uses God-Level Resilience Fetch for India-region DNS failover.
 */
let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (client) return client

  const { url, key } = getSupabaseEnv()

  client = createBrowserClient<Database>(
    url,
    key,
    {
      global: {
        fetch: (u, o) => resilientFetch(u, { ...o, traceName: 'BROWSER_CLIENT' })
      },
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    }
  )

  return client
}
