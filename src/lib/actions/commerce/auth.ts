"use server"

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { resolveUserPermissionsServer } from '@/lib/auth/server';
import type { UserPermissions } from '@/lib/auth/core';
import { getRedirectPath } from '@/lib/auth';
import { logger } from '@/lib/logging/logger';

/**
 * Gets the current user's permissions from the database.
 * Following the Wyshkit 2026 Unified Identity model.
 */
export async function getCurrentUserPermissions(): Promise<UserPermissions> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        isAdmin: false,
        isVendor: false,
        isCustomer: false,
        vendorIds: [],
      };
    }

    return await resolveUserPermissionsServer(user.id);
  } catch (err) {
    logger.error('Unexpected error in getCurrentUserPermissions', err);
    return {
      isAdmin: false,
      isVendor: false,
      isCustomer: false,
      vendorIds: [],
    };
  }
}

