import { headers } from 'next/headers';
import type { User } from '@supabase/supabase-js';
import { type UserRole, type UserPermissions, resolveUserPermissions } from './core';
import type { Database } from '@/lib/supabase/database.types';

type Vendor = Database['public']['Tables']['vendors']['Row'] & {
  kyc_status?: string | null;
  onboarding_status?: string | null;
};



/**
 * Server-side helper: Resolves permissions using the server-side Supabase client
 */
export async function resolveUserPermissionsServer(userId: string): Promise<UserPermissions> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  return resolveUserPermissions(supabase, userId);
}

/**
 * Server-side helper: Get the vendor associated with the current session
 * Returns null if user is not logged in or not associated with any vendor
 * 
 * Lookup order:
 * 1. Check vendor_users table (many-to-many relationship)
 * 2. Check users table for role = 'vendor' and find matching vendor
 * 3. Check app_metadata for vendor_id
 */
export async function getVendorFromSession(): Promise<Vendor | null> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // WYSHKIT 2026: Single-Trip Vendor Resolution via RPC
  const { data: vendor, error } = await supabase.rpc('get_vendor_from_session', {
    p_user_id: user.id,
    p_email: user.email || undefined,
    p_app_metadata: user.app_metadata || {}
  });

  if (error || !vendor) {
    return null;
  }

  return vendor as unknown as Vendor;
}

/**
 * WYSHKIT 2026: Zero-Trip Auth Resolution
 * Resolves the current user via injected headers from Middleware (Proxy).
 * This eliminates the standard Supabase `getUser()` round-trip for already-authenticated requests.
 */
export async function getZeroTripUser(): Promise<User | null> {
  const headerList = await headers();
  const injectedUserId = headerList.get('x-wyshkit-user-id');
  const injectedUserEmail = headerList.get('x-wyshkit-user-email');

  if (!injectedUserId || injectedUserId === 'PENDING') return null;

  return {
    id: injectedUserId,
    email: injectedUserEmail
  } as User;
}
