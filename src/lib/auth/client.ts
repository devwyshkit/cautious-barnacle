import { createClient } from '@/lib/supabase/client';
import { type UserPermissions, resolveUserPermissions } from './core';

/**
 * Client-side helper: Resolves permissions using the singleton browser-side Supabase client
 * WYSHKIT 2026: Always use singleton to avoid redundant Auth verify calls.
 */
export async function resolveUserPermissionsClient(userId: string): Promise<UserPermissions> {
  const supabase = createClient();
  return resolveUserPermissions(supabase, userId);
}
