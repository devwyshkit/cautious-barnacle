import { createClient } from '@/lib/supabase/server'
import { CustomerTable } from './customer-table'

const PAGE_SIZE = 20

async function getCustomers(page = 1) {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, count } = await supabase
    .from('users')
    .select('id, full_name, phone, email, created_at, status', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  return { customers: data || [], totalCount: count || 0 }
}

async function getCustomerStats() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const [totalResult, todayResult] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact' }),
    supabase.from('users').select('id', { count: 'exact' }).gte('created_at', `${today}T00:00:00`),
  ])

  return {
    total: totalResult.count || 0,
    today: todayResult.count || 0,
  }
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1')
  const [{ customers, totalCount }, stats] = await Promise.all([
    getCustomers(currentPage),
    getCustomerStats(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">Customers</h1>
        <div className="flex gap-4 text-sm">
          <span className="text-zinc-500">Total: <strong className="text-zinc-900">{stats.total}</strong></span>
          <span className="text-zinc-500">Today: <strong className="text-emerald-600">+{stats.today}</strong></span>
        </div>
      </div>
      <CustomerTable
        customers={customers}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
