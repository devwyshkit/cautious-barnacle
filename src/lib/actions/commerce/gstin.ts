'use server';

import { validateGSTIN } from '@/lib/utils/gstin';
import { revalidatePath } from 'next/cache';

export type GSTINValidationResult =
  | { valid: false; error: string }
  | { valid: true; verified?: boolean; businessName?: string };

/**
 * Validates GSTIN format (regex) and optionally verifies via Idfy API.
 * Non-blocking: validation is for B2B users who want input tax credit.
 */
export async function validateGSTINAction(gstin: string): Promise<GSTINValidationResult> {
  const trimmed = gstin.trim();

  if (!trimmed) {
    // Clear GSTIN if empty
    const { executeCommerceIntent } = await import('./intent-engine');
    await executeCommerceIntent({ intent: 'SET_GSTIN', payload: { gstin: null } });
    revalidatePath('/');
    return { valid: true };
  }

  if (trimmed.length !== 15) {
    return { valid: false, error: 'GSTIN must be 15 characters' };
  }

  if (!validateGSTIN(trimmed)) {
    return { valid: false, error: 'Invalid GSTIN format' };
  }

  // Persist for session in Database (Zero Split Brain)
  const { executeCommerceIntent } = await import('./intent-engine');
  await executeCommerceIntent({ intent: 'SET_GSTIN', payload: { gstin: trimmed } });

  // Also set cookie primarily for non-checkout pages if needed, but DB is source of truth
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.set('gstin', trimmed, { maxAge: 60 * 60 });

  revalidatePath('/');
  return { valid: true };
}
