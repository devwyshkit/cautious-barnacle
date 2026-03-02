import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAdminSession } from '@/lib/auth/admin'
import { AdminShell } from '@/components/admin/layout/admin-shell'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerList = await headers();
  const pathname = headerList.get('x-url') || '';
  const isLoginPage = pathname.includes('/login');

  const admin = await getAdminSession()

  if (!admin && !isLoginPage) {
    redirect('/admin/login')
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AdminShell admin={admin as any}>{children}</AdminShell>
}
