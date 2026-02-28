import { createClient } from '@/lib/supabase/server'
import { AuditLogTable } from './audit-log-table'

const PAGE_SIZE = 50

async function getAuditLogs(page = 1) {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, count } = await supabase
    .from('audit_logs' as any)
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  return { logs: data || [], totalCount: count || 0 }
}

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1')
  const { logs, totalCount } = await getAuditLogs(currentPage)

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-zinc-900">Audit logs</h1>
      <p className="text-sm text-zinc-500">Recent admin actions across the platform</p>
      <AuditLogTable
        logs={logs}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
