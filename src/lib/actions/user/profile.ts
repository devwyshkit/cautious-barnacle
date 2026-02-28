'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logging/logger'

export async function updateProfile(payload: { full_name?: string, phone?: string, avatar_url?: string }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { data, error } = await supabase
      .from('users')
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('id, full_name, email, phone, avatar_url, role')
      .maybeSingle() // Changed from .single() - user record might not exist in users table

    if (error) throw error
    if (!data) {
      // User record doesn't exist yet, return error (profile should be created during signup)
      return { error: 'User profile not found. Please contact support.' }
    }

    // Also update auth metadata
    if (payload.full_name || payload.avatar_url) {
      await supabase.auth.updateUser({
        data: {
          full_name: payload.full_name || user.user_metadata.full_name,
          avatar_url: payload.avatar_url || user.user_metadata.avatar_url,
        }
      })
    }

    revalidatePath('/profile')
    return { success: true, user: data }
  } catch (error) {
    logger.error('Error in updateProfile', error, { payload })
    return { error: 'Failed to update profile' }
  }
}
