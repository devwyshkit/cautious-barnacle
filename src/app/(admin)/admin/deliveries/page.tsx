import { createClient } from '@/lib/supabase/server'
import { DeliveryTable } from './delivery-table'

async function getDeliveries(status?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('orders')
    .select('*, vendors(name, business_name), users(full_name, phone)')
    .not('awb_number', 'is', null) // Only orders with a linked delivery
    .order('created_at', { ascending: false })
    .limit(100)

  if (status) {
    // Map frontend delivery status filter to canonical order statuses
    if (status === 'delivered') query = query.eq('status', 'DELIVERED')
    else if (status === 'in_transit') query = query.eq('status', 'OUT_FOR_DELIVERY')
    else if (status === 'picked_up') query = query.eq('status', 'PACKED')
    else if (status === 'pending') query = query.in('status', ['CONFIRMED', 'IN_PRODUCTION'])
  }

  const { data } = await query
  return data || []
}

async function getDeliveryStats() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('status')
    .not('awb_number', 'is', null)

  const stats = {
    pending: 0,
    picked_up: 0,
    in_transit: 0,
    delivered: 0,
    failed: 0,
  }

  for (const d of (data || []) as { status: string }[]) {
    if (d.status === 'DELIVERED') stats.delivered++
    else if (d.status === 'OUT_FOR_DELIVERY') stats.in_transit++
    else if (d.status === 'PACKED') stats.picked_up++
    else if (['CONFIRMED', 'IN_PRODUCTION'].includes(d.status)) stats.pending++
    else if (d.status === 'CANCELLED') stats.failed++
  }

  return stats
}

export default async function DeliveriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const [deliveries, stats] = await Promise.all([getDeliveries(status), getDeliveryStats()])

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-zinc-900">Deliveries</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="border rounded-lg p-3">
          <p className="text-xs text-zinc-500">Pending pickup</p>
          <p className="text-xl font-semibold text-amber-600">{stats.pending}</p>
        </div>
        <div className="border rounded-lg p-3">
          <p className="text-xs text-zinc-500">Picked up</p>
          <p className="text-xl font-semibold text-blue-600">{stats.picked_up}</p>
        </div>
        <div className="border rounded-lg p-3">
          <p className="text-xs text-zinc-500">In transit</p>
          <p className="text-xl font-semibold text-purple-600">{stats.in_transit}</p>
        </div>
        <div className="border rounded-lg p-3">
          <p className="text-xs text-zinc-500">Delivered</p>
          <p className="text-xl font-semibold text-emerald-600">{stats.delivered}</p>
        </div>
        <div className="border rounded-lg p-3">
          <p className="text-xs text-zinc-500">Failed</p>
          <p className="text-xl font-semibold text-red-600">{stats.failed}</p>
        </div>
      </div>

      <DeliveryTable deliveries={deliveries} currentStatus={status} />
    </div>
  )
}
