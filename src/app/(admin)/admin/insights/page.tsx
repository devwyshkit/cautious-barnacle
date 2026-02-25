import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

async function getInsights() {
  const supabase = await createClient()
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)
  const lastMonth = new Date(today)
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  const todayStr = today.toISOString().split('T')[0]
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  const lastWeekStr = lastWeek.toISOString().split('T')[0]
  const lastMonthStr = lastMonth.toISOString().split('T')[0]

  const [
    todayOrders,
    yesterdayOrders,
    weekOrders,
    monthOrders,
    topVendors,
    topItems,
    ordersByStatus,
  ] = await Promise.all([
    // Today's orders
    supabase.from('orders').select('total').gte('created_at', `${todayStr}T00:00:00`),
    // Yesterday's orders
    supabase.from('orders').select('total')
      .gte('created_at', `${yesterdayStr}T00:00:00`)
      .lt('created_at', `${todayStr}T00:00:00`),
    // Week orders
    supabase.from('orders').select('total').gte('created_at', `${lastWeekStr}T00:00:00`),
    // Month orders
    supabase.from('orders').select('total').gte('created_at', `${lastMonthStr}T00:00:00`),
    // Top vendors by orders
    supabase.from('orders').select('vendor_id, vendors(business_name)').limit(1000),
    // Top products
    supabase.from('order_products').select('product_id, products(name), quantity').limit(1000),
    // Orders by status
    supabase.from('orders').select('status'),
  ])

  const todayGMV = ((todayOrders.data || []) as { total?: number }[]).reduce((sum, o) => sum + (o.total ?? 0), 0)
  const yesterdayGMV = ((yesterdayOrders.data || []) as { total?: number }[]).reduce((sum, o) => sum + (o.total ?? 0), 0)
  const weekGMV = ((weekOrders.data || []) as { total?: number }[]).reduce((sum, o) => sum + (o.total ?? 0), 0)
  const monthGMV = ((monthOrders.data || []) as { total?: number }[]).reduce((sum, o) => sum + (o.total ?? 0), 0)

  // Calculate vendor leaderboard
  const vendorCounts: Record<string, { name: string; count: number }> = {}
  for (const order of (topVendors.data || []) as { vendor_id?: string; vendors?: { business_name?: string } }[]) {
    const id = order.vendor_id ?? ''
    const name = order.vendors?.business_name || 'Unknown'
    if (!vendorCounts[id]) vendorCounts[id] = { name, count: 0 }
    vendorCounts[id].count++
  }
  const topVendorsList = Object.values(vendorCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Calculate product leaderboard
  const itemCounts: Record<string, { name: string; count: number }> = {}
  for (const product of (topItems.data || []) as { product_id?: string; quantity?: number; products?: { name?: string } }[]) {
    const id = product.product_id ?? ''
    const name = product.products?.name || 'Unknown'
    if (!itemCounts[id]) itemCounts[id] = { name, count: 0 }
    itemCounts[id].count += product.quantity ?? 0
  }
  const topItemsList = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Order status distribution
  const statusCounts: Record<string, number> = {}
  for (const order of (ordersByStatus.data || []) as { status?: string }[]) {
    const s = order.status ?? ''
    statusCounts[s] = (statusCounts[s] || 0) + 1
  }

  return {
    today: { gmv: todayGMV, orders: (todayOrders.data || []).length },
    yesterday: { gmv: yesterdayGMV, orders: (yesterdayOrders.data || []).length },
    week: { gmv: weekGMV, orders: (weekOrders.data || []).length },
    month: { gmv: monthGMV, orders: (monthOrders.data || []).length },
    topVendors: topVendorsList,
    topItems: topItemsList,
    statusDistribution: statusCounts,
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function getTrend(today: number, yesterday: number) {
  if (yesterday === 0) return { icon: Minus, color: 'text-zinc-400', text: '-' }
  const change = ((today - yesterday) / yesterday) * 100
  if (change > 0) return { icon: TrendingUp, color: 'text-emerald-600', text: `+${change.toFixed(0)}%` }
  if (change < 0) return { icon: TrendingDown, color: 'text-red-600', text: `${change.toFixed(0)}%` }
  return { icon: Minus, color: 'text-zinc-400', text: '0%' }
}

export default async function InsightsPage() {
  const insights = await getInsights()
  const gmvTrend = getTrend(insights.today.gmv, insights.yesterday.gmv)
  const ordersTrend = getTrend(insights.today.orders, insights.yesterday.orders)

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-zinc-900">Insights</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">GMV today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(insights.today.gmv)}</p>
            <div className={`flex items-center gap-1 text-xs ${gmvTrend.color}`}>
              <gmvTrend.icon className="size-3" />
              {gmvTrend.text} vs yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Orders today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{insights.today.orders}</p>
            <div className={`flex items-center gap-1 text-xs ${ordersTrend.color}`}>
              <ordersTrend.icon className="size-3" />
              {ordersTrend.text} vs yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">GMV this week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(insights.week.gmv)}</p>
            <p className="text-xs text-zinc-500">{insights.week.orders} orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">GMV this month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(insights.month.gmv)}</p>
            <p className="text-xs text-zinc-500">{insights.month.orders} orders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top vendors</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {insights.topVendors.length === 0 ? (
              <p className="p-4 text-sm text-zinc-500">No data yet</p>
            ) : (
              <div className="divide-y">
                {insights.topVendors.map((vendor, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-4">{i + 1}</span>
                      <span className="text-sm font-medium">{vendor.name}</span>
                    </div>
                    <span className="text-sm text-zinc-500">{vendor.count} orders</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top products</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {insights.topItems.length === 0 ? (
              <p className="p-4 text-sm text-zinc-500">No data yet</p>
            ) : (
              <div className="divide-y">
                {insights.topItems.map((product, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-4">{i + 1}</span>
                      <span className="text-sm font-medium truncate max-w-[150px]">{product.name}</span>
                    </div>
                    <span className="text-sm text-zinc-500">{product.count} sold</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Order status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {Object.keys(insights.statusDistribution).length === 0 ? (
              <p className="p-4 text-sm text-zinc-500">No data yet</p>
            ) : (
              <div className="divide-y">
                {Object.entries(insights.statusDistribution).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm capitalize">{status.toLowerCase().replace(/_/g, ' ')}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
