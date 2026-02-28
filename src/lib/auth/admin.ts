import { createClient } from '@/lib/supabase/server'
import type { AdminSession } from '@/lib/types/admin.types'

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: dbUser } = await supabase
    .from('users')
    .select('id, role, phone, full_name, is_admin')
    .eq('id', user.id)
    .single()

  if (!dbUser || (dbUser.role !== 'admin' && !dbUser.is_admin)) return null

  return {
    id: user.id,
    email: user.email ?? null,
    phone: dbUser.phone,
    name: dbUser.full_name,
    role: 'admin'
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdminSession()
  if (!admin) {
    throw new Error('Unauthorized')
  }
  return admin
}
