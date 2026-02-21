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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Check partner_users table (preferred method for all users including admins)
  const { data: partnerLink } = await supabase
    .from('partner_users')
    .select('partner_id, partners(*)')
    .eq('user_id', user.id)
    .maybeSingle();

  if ((partnerLink as any)?.partner_id) {
    return (partnerLink as any)?.partners || null;
  }

  // 2. Check users table role and try to match by email
  const { data: dbUser } = await supabase
    .from('users')
    .select('role, email')
    .eq('id', user.id)
    .maybeSingle();

  if ((dbUser as any)?.role === 'partner' && user.email) {
    const { data: partnerByEmail } = await supabase
      .from('partners')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();

    if (partnerByEmail) return partnerByEmail as Partner;
  }

  // 3. Check app_metadata for partner_id
  const partnerId = user.app_metadata?.partner_id;
  if (partnerId) {
    const { data: partner } = await supabase
      .from('partners')
      .select('*')
      .eq('id', partnerId)
      .maybeSingle();

    if (partner) return partner as Partner;
  }

  return null;
}
