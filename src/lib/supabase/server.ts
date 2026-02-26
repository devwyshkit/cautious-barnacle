import { createServerClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getSupabaseEnv } from '@/lib/env'

export async function createClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const { url, key } = getSupabaseEnv()

  // WYSHKIT 2026: Network Resilience Wrapper
  // Specifically designed to combat "fetch failed" in unstable local environments.
  const resilientFetch = async (url: string, options: any = {}) => {
    let lastError;
    for (let i = 0; i < 3; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            ...options.headers,
            'x-wyshkit-client-resilience': 'true',
            'x-wyshkit-retry-count': i.toString(),
          }
        });
        clearTimeout(timeoutId);
        return response;
      } catch (err: any) {
        lastError = err;
        if (err.name === 'AbortError') {
          console.warn(`[SUPABASE_RESILIENCE] Timeout on attempt ${i + 1} for ${url}`);
        } else {
          console.warn(`[SUPABASE_RESILIENCE] Fetch failed on attempt ${i + 1}: ${err.message}`);
        }
        await new Promise(res => setTimeout(res, 500 * (i + 1))); // Exponential backoff
      }
    }
    throw lastError;
  };

  return createServerClient<Database>(
    url,
    key,
    {
      global: {
        fetch: resilientFetch as any
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
import { createClient as createBaseClient } from '@supabase/supabase-js'

export async function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase Admin environment variables')
  }

  // SWIGGY 2026: Admin client requires the pure JS client, not SSR cookie client
  return createBaseClient<Database>(
    url,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

