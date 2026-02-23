import type { User } from '@supabase/supabase-js';
import { type UserRole, type UserPermissions, resolveUserPermissions } from './core';
import type { Database } from '@/lib/supabase/database.types';

type Partner = Database['public']['Tables']['partners']['Row'];



/**
 * Server-side helper: Resolves permissions using the server-side Supabase client
 */
export async function resolveUserPermissionsServer(userId: string): Promise<UserPermissions> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  return resolveUserPermissions(supabase, userId);
}

/**
 * Server-side helper: Get the partner associated with the current session
 * Returns null if user is not logged in or not associated with any partner
 * 
 * Lookup order:
 * 1. Check partner_users table (many-to-many relationship)
 * 2. Check users table for role = 'partner' and find matching partner
 * 3. Check app_metadata for partner_id
 */
export async function getPartnerFromSession(): Promise<Partner | null> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) return null;
  const user = session.user;

  // WYSHKIT 2026: Single-Trip Partner Resolution via RPC
  const { data: partner, error } = await (supabase as any).rpc('get_partner_from_session', {
    p_user_id: user.id,
    p_email: user.email || null,
    p_app_metadata: user.app_metadata || {}
  });

  if (error || !partner) {
    return null;
  }

  return partner as unknown as Partner;
}
