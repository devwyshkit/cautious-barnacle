import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth/admin'
import { AdminShell } from '@/components/admin/layout/admin-shell'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdminSession()

  if (!admin) {
    redirect('/admin/login')
  }

  return <AdminShell admin={admin}>{children}</AdminShell>
}
