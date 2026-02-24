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
 * 1. Check partner_users table (many-to-many relationship)
 * 2. Check users table for role = 'vendor' and find matching vendor
 * 3. Check app_metadata for vendor_id
 */
export async function getPartnerFromSession(): Promise<Vendor | null> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) return null;
  const user = session.user;

  // WYSHKIT 2026: Single-Trip Vendor Resolution via RPC
  const { data: vendor, error } = await (supabase as any).rpc('get_partner_from_session', {
    p_user_id: user.id,
    p_email: user.email || null,
    p_app_metadata: user.app_metadata || {}
  });

  if (error || !vendor) {
    return null;
  }

  return vendor as unknown as Vendor;
}
