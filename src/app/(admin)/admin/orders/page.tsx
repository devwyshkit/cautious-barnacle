import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'
import { OrderTable } from './order-table'

type OrderStatus = Database['public']['Enums']['order_status']

const PAGE_SIZE = 20

async function getOrders(status?: string, page = 1) {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('orders')
    .select('*, vendors(business_name), users(full_name, phone)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status) {
    query = query.eq('status', status as OrderStatus)
  }

  const { data, count } = await query
  return { orders: data || [], totalCount: count || 0 }
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status, page } = await searchParams
  const currentPage = parseInt(page || '1')
  const { orders, totalCount } = await getOrders(status, currentPage)

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-zinc-900">Orders</h1>
      <OrderTable
        orders={orders}
        currentStatus={status}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
