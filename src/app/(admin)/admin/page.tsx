import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import type { DashboardMetrics } from '@/lib/types/admin.types'

async function getMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const [ordersResult, vendorsResult, kycResult] = await Promise.all([
    supabase
      .from('orders')
      .select('total')
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`),
    supabase
      .from('vendors')
      .select('id', { count: 'exact' })
      .eq('kyc_status', 'ACTIVE'),
    supabase
      .from('vendors')
      .select('id', { count: 'exact' })
      .eq('kyc_status', 'SUBMITTED'),
  ])

  const orders = ordersResult.data || []

  return {
    gmv_today: (orders as { total?: number }[]).reduce((sum, o) => sum + (o.total ?? 0), 0),
    orders_today: orders.length,
    active_vendors: vendorsResult.count || 0,
    pending_kyc: kycResult.count || 0,
  }
}

async function getRecentOrders() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at, vendors(business_name)')
    .order('created_at', { ascending: false })
    .limit(5)

  // Explicit type cast to fix 'never' inference with joins
  return (data || []) as Array<{
    id: string;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    vendors: { business_name: string } | null;
  }>;
}

async function getPendingKYC() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('vendors')
    .select('id, business_name, created_at')
    .eq('kyc_status', 'SUBMITTED')
    .order('created_at', { ascending: true })
    .limit(5)

  // Explicit type cast to fix 'never' inference
  return (data || []) as Array<{
    id: string;
    business_name: string;
    created_at: string;
  }>;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

export default async function AdminDashboard() {
  const [metrics, recentOrders, pendingKYC] = await Promise.all([
    getMetrics(),
    getRecentOrders(),
    getPendingKYC(),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-[var(--text-primary)]">Overview</h1>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">GMV today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(metrics.gmv_today)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Orders today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{metrics.orders_today}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Active vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{metrics.active_vendors}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">KYC Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/vendors?status=SUBMITTED" className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-[var(--warning)]">{metrics.pending_kyc}</p>
              {metrics.pending_kyc > 0 && <ArrowRight className="size-4 text-[var(--warning)]" />}
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent orders</CardTitle>
            <Link href="/admin/orders" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <p className="p-4 text-sm text-[var(--text-secondary)]">No orders yet</p>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">#{order.order_number}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {order.vendors?.business_name || 'Unknown vendor'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                      <Badge variant="secondary" className="text-xs">{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending KYC */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">KYC queue</CardTitle>
            <Link href="/admin/vendors?status=SUBMITTED" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {pendingKYC.length === 0 ? (
              <p className="p-4 text-sm text-[var(--text-secondary)]">No pending applications</p>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {pendingKYC.map((vendor) => (
                  <Link
                    key={vendor.id}
                    href={`/admin/vendors/${vendor.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-[var(--surface-muted)]"
                  >
                    <div>
                      <p className="text-sm font-medium">{vendor.business_name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">Applied {formatDate(vendor.created_at!)}</p>
                    </div>
                    <Badge variant="outline" className="text-[var(--warning)] border-[var(--warning)]/20">Review</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
