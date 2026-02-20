import type { SupabaseClient } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'partner' | 'customer';

export interface UserPermissions {
  isAdmin: boolean;
  isPartner: boolean;
  isCustomer: boolean;
  partnerIds: string[];
}

import { logger } from '@/lib/logging/logger';

/**
 * Shared redirect logic (Unified Identity Model)
 */
export function getRedirectPath(permissions: UserPermissions, returnUrl?: string | null): string {
  if (returnUrl && returnUrl.startsWith('/')) {
    return returnUrl;
  }

  // Redirect based on the strongest capability if no returnUrl
  // Context-aware: If we are already in a portal flow, stay there
  if (permissions.isPartner) {
    // If they have multiple outlets, they must select one
    if (permissions.partnerIds.length > 1) {
      return '/partner/select-outlet';
    }
    return '/partner';
  }

  if (permissions.isAdmin) return '/admin';

  return '/';
}

/**
 * Core role resolution logic (Non-exclusive Permissions)
 * This identifies ALL capabilities of a user.
 * Phone is the single source of truth.
 */
export async function resolveUserPermissions(
  supabase: SupabaseClient,
  userId: string
): Promise<UserPermissions> {
  const startTime = Date.now();

  // WYSHKIT 2026: Consolidated RPC to reduce auth latency
  const { data, error } = await supabase.rpc('resolve_user_permissions', {
    p_user_id: userId
  });

  logger.debug(`[AUTH] Permissions fetch completed in ${Date.now() - startTime}ms`);

  if (error) {
    logger.error('[AUTH] Error resolving user permissions via RPC', error);
  }

  const roles = data?.roles || [];
  const partnerIds = data?.partnerIds || [];

  return {
    isAdmin: roles.includes('admin'),
    isPartner: roles.includes('partner') || partnerIds.length > 0,
    isCustomer: true,
    partnerIds,
  };
}

// Wrapper with timeout to prevent auth hanging
export async function resolveUserPermissionsWithTimeout(
  supabase: SupabaseClient,
  userId: string
): Promise<UserPermissions> {
  const timeout = new Promise<UserPermissions>((_, reject) =>
    setTimeout(() => reject(new Error('Permissions fetch timed out')), 15000)
  );

  return Promise.race([
    resolveUserPermissions(supabase, userId),
    timeout
  ]).catch((err) => {
    logger.error('Permission resolution failed or timed out', err as Error);
    // Fallback to basic customer permissions
    return {
      isAdmin: false,
      isPartner: false,
      isCustomer: true,
      partnerIds: []
    };
  });
}

/**
 * @deprecated Use resolveUserPermissions() instead.
 * resolveUserPermissions() provides non-exclusive capability checks.
 */
export async function resolveUserRole(
  supabase: SupabaseClient,
  userId: string
): Promise<UserRole> {
  const permissions = await resolveUserPermissions(supabase, userId);

  if (permissions.isAdmin) return 'admin';
  if (permissions.isPartner) return 'partner';
  return 'customer';
}
