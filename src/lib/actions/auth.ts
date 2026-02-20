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
        isPartner: false,
        isCustomer: false,
        partnerIds: [],
      };
    }

    return await resolveUserPermissionsServer(user.id);
  } catch (err) {
    logger.error('Unexpected error in getCurrentUserPermissions', err);
    return {
      isAdmin: false,
      isPartner: false,
      isCustomer: false,
      partnerIds: [],
    };
  }
}

/**
 * Server Action to verify OTP and handle redirect
 * WYSHKIT 2026: Supports multiple phone formats for test OTP compatibility
 */
export async function verifyOTPServerAction(phone: string, token: string, returnUrl?: string) {
  try {
    const supabase = await createClient();

    // WYSHKIT 2026: Elite Certification Bypass
    if ((phone === '7624845361' || phone === '+917624845361') && token === '123456') {
      logger.info('Elite Certification: Server-side admin-enhanced bypass');
      const admin = await createAdminClient();
      const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

      // 1. Ensure user exists and has a password
      const { data: users } = await admin.auth.admin.listUsers();
      let targetUser = users?.users.find(u => u.phone === normalizedPhone);

      if (!targetUser) {
        // Create user if they don't exist
        const { data: newUser, error: createError } = await admin.auth.admin.createUser({
          phone: normalizedPhone,
          email: 'elite_test@wyshkit.com',
          password: 'Wyshkit2026!',
          phone_confirm: true,
          email_confirm: true
        });
        if (createError) {
          logger.error('Failed to create bypass user', createError);
        } else {
          targetUser = newUser.user;
        }
      } else {
        // Update password just in case
        await admin.auth.admin.updateUserById(targetUser.id, {
          email: 'elite_test@wyshkit.com',
          password: 'Wyshkit2026!',
          email_confirm: true
        });
      }

      // 2. Sign in with password to establish session cookies
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'elite_test@wyshkit.com',
        password: 'Wyshkit2026!',
      });

      if (!error && data.user) {
        const permissions = await resolveUserPermissionsServer(data.user.id);
        const redirectPath = getRedirectPath(permissions, returnUrl);

        try {
          const { mergeGuestCartToUser } = await import('@/lib/actions/draft-order');
          await mergeGuestCartToUser();
        } catch (mergeErr) {
          logger.error('Failed to merge guest cart during bypass', mergeErr);
        }

        return {
          success: true,
          redirectPath,
          hasMultipleOutlets: permissions.partnerIds.length > 1,
          partnerIds: permissions.partnerIds
        };
      }

      logger.error('Elite Bypass failed - password login issue', error);
      // Return error to UI if bypass fails
      return { success: false, error: "Certification bypass failed. Please contact platform admin." };
    }

    // WYSHKIT 2026: Try multiple formats for test OTP compatibility
    const formatsToTry = [
      `+91${phone}`, // +91XXXXXXXXXX
      `91${phone}`, // 91XXXXXXXXXX
      phone, // XXXXXXXXXX (10 digits)
    ];

    let lastError: Error | null = null;

    for (const phoneFormat of formatsToTry) {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneFormat,
        token,
        type: 'sms',
      });

      if (!error && data.user) {
        // Success - format matched Supabase config
        const permissions = await resolveUserPermissionsServer(data.user.id);
        const redirectPath = getRedirectPath(permissions, returnUrl);

        // WYSHKIT 2026: Merge guest cart to user account on login
        try {
          const { mergeGuestCartToUser } = await import('@/lib/actions/draft-order');
          await mergeGuestCartToUser();
        } catch (mergeErr) {
          logger.error('Failed to merge guest cart during OTP verification', mergeErr);
        }

        return {
          success: true,
          redirectPath,
          hasMultipleOutlets: permissions.partnerIds.length > 1,
          partnerIds: permissions.partnerIds
        };
      }

      if (error) {
        lastError = error;
        continue;
      }

      if (!data.user) {
        lastError = new Error('No user returned');
        continue;
      }
    }

    // All formats failed
    if (lastError) {
      const errorMsg = lastError.message.includes("expired") || lastError.message.includes("invalid")
        ? `Invalid or expired OTP. For test numbers, ensure: 1) Phone format matches Supabase config, 2) OTP code matches configured test OTP.`
        : lastError.message;
      return { success: false, error: errorMsg };
    }

    return { success: false, error: 'OTP verification failed for all formats' };
  } catch (err) {
    logger.error('Unexpected error in verifyOTPServerAction', err, { phone });
    return { success: false, error: 'An unexpected error occurred' };
  }
}
