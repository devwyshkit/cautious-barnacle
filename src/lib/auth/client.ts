import { createBrowserClient } from '@supabase/ssr';
import { type UserRole, type UserPermissions, resolveUserPermissions } from './core';



/**
 * Client-side helper: Resolves permissions using the browser-side Supabase client
 */
export async function resolveUserPermissionsClient(userId: string): Promise<UserPermissions> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return resolveUserPermissions(supabase, userId);
}
