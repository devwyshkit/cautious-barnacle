import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getSupabaseEnv } from '@/lib/env'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (client) return client

  const { url, key } = getSupabaseEnv()

  client = createBrowserClient<Database>(
    url,
    key,
    {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    }
  )

  return client
}
