import { createClient } from '@/lib/supabase/server'
import { ReturnsTable } from './returns-table'

async function getReturns(status?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('returns')
    .select('*, orders(order_number, total, vendors(business_name))')
    .order('created_at', { ascending: false })
    .limit(100)

  if (status) {
    query = query.eq('status', status)
  }

  const { data } = await query
  return data || []
}

async function getReturnStats() {
  const supabase = await createClient()

  const [pendingResult, totalResult] = await Promise.all([
    supabase.from('returns').select('id', { count: 'exact' }).eq('status', 'pending'),
    supabase.from('returns').select('refund_amount').eq('status', 'approved'),
  ])

  // Explicit type cast to fix 'never' inference
  const totalRefunded = ((totalResult.data || []) as Array<{ refund_amount: number }>).reduce((sum, r) => sum + (r.refund_amount || 0), 0)

  return {
    pending: pendingResult.count || 0,
    totalRefunded
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function ReturnsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const [returns, stats] = await Promise.all([getReturns(status), getReturnStats()])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">Returns</h1>
        <div className="flex gap-4 text-sm">
          <span className="text-[var(--text-secondary)]">
            Pending: <strong className="text-[var(--warning)]">{stats.pending}</strong>
          </span>
          <span className="text-[var(--text-secondary)]">
            Refunded: <strong className="text-[var(--success)]">{formatCurrency(stats.totalRefunded)}</strong>
          </span>
        </div>
      </div>
      <ReturnsTable returns={returns} currentStatus={status} />
    </div>
  )
}
