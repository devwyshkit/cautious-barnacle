import type { SupabaseClient, User } from '@supabase/supabase-js';
import { logger } from '@/lib/logging/logger';

export type UserRole = 'admin' | 'vendor' | 'customer';

export interface UserPermissions {
  isAdmin: boolean;
  isVendor: boolean;
  isCustomer: boolean;
  vendorIds: string[];
}


/**
 * Shared redirect logic (Unified Auth Model)
 */
export function getRedirectPath(permissions: UserPermissions, returnUrl?: string | null): string {
  if (returnUrl && returnUrl.startsWith('/')) {
    return returnUrl;
  }

  // Redirect based on the strongest capability if no returnUrl
  // Context-aware: If we are already in a portal flow, stay there
  if (permissions.isVendor) {
    // If they have multiple outlets, they must select one
    if (permissions.vendorIds.length > 1) {
      return '/vendor/select-outlet';
    }
    return '/vendor';
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
  const vendorIds = data?.vendorIds || [];

  return {
    isAdmin: roles.includes('admin'),
    isVendor: roles.includes('vendor') || vendorIds.length > 0,
    isCustomer: true,
    vendorIds,
  };
}

// Wrapper with timeout to prevent auth hanging
export async function resolveUserPermissionsWithTimeout(
  supabase: SupabaseClient,
  userId: string
): Promise<UserPermissions> {
  const timeout = new Promise<UserPermissions>((_, reject) =>
    setTimeout(() => reject(new Error('Permissions fetch timed out')), 2500)
  );

  return Promise.race([
    resolveUserPermissions(supabase, userId),
    timeout
  ]).catch((err) => {
    logger.error('Permission resolution failed or timed out', err as Error);
    // Fallback to basic customer permissions
    return {
      isAdmin: false,
      isVendor: false,
      isCustomer: true,
      vendorIds: []
    };
  });
}



