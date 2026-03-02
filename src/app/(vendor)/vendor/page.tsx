import { getVendorFromSession } from '@/lib/auth/server';
import { get_vendor_surface } from "@/lib/actions/vendor/vendor-actions";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Package,
  IndianRupee,
  Clock,
  Star,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function VendorDashboard() {
  const vendor = await getVendorFromSession();
  if (!vendor) redirect('/vendor/login');

  const vendor_id = vendor.id;

  const result = await get_vendor_surface(vendor_id);
  if (result.error || !result.data) {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--destructive)]">Error loading dashboard: {result.error}</p>
      </div>
    );
  }

  const { stats, pending_orders } = result.data;

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">
          {vendor.name}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Today&apos;s overview
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--well-info)] flex items-center justify-center">
                <Package className="size-5 text-[var(--well-info-text)]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {stats?.today_orders || 0}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Orders today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--well-success)] flex items-center justify-center">
                <IndianRupee className="size-5 text-[var(--well-success-text)]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  ₹{(stats?.today_revenue || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Revenue today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--well-warning)] flex items-center justify-center">
                <Clock className="size-5 text-[var(--well-warning-text)]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {stats?.pending_orders || 0}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--well-neutral)] flex items-center justify-center">
                <Star className="size-5 text-[var(--well-neutral-text)]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {stats?.avg_rating?.toFixed(1) || '-'}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="bg-[var(--text-primary)] text-white border-[var(--text-secondary)]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold tracking-tight text-[var(--text-secondary)]">Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold tracking-tight">₹{(stats?.total_earnings || 0).toLocaleString('en-IN')}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Total Settled Earnings</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-[var(--success)]">₹{(stats?.pending_settlement || 0).toLocaleString('en-IN')}</p>
                <p className="text-xs text-[var(--text-secondary)] font-bold tracking-tight">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats?.low_stock_count !== undefined && stats.low_stock_count > 0 && (
        <Card className="border-[var(--well-warning-border)] bg-[var(--well-warning)]/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-[var(--radius-md)] bg-[var(--well-warning)] flex items-center justify-center">
                  <AlertCircle className="size-5 text-[var(--well-warning-text)]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{stats.low_stock_count} Products Low on Stock</p>
                  <p className="text-xs text-[var(--text-secondary)]">Refill soon to avoid order cancellations</p>
                </div>
              </div>
              <Link href="/vendor/products">
                <Button size="sm" variant="outline" className="bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] h-8 rounded-[var(--radius-md)]">
                  Update
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {pending_orders.length > 0 && (
        <Card className="border-[var(--well-destructive-border)] bg-[var(--well-destructive)]/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertCircle className="size-4 text-[var(--destructive)]" />
                Action needed
              </CardTitle>
              <Link href="/vendor/orders">
                <Button variant="ghost" size="sm" className="gap-1 text-[var(--text-secondary)]">
                  View all
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {pending_orders.slice(0, 3).map((order: any) => (
                <Link
                  key={order.id}
                  href="/vendor/orders"
                  className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-muted)] -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      #{order.order_number}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {order.order_products?.length || 0} products · ₹{Number(order.total).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Badge className="bg-[var(--well-destructive)] text-[var(--well-destructive-text)] border-0 text-xs rounded-[var(--radius-xs)] font-bold">
                    New
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pending_orders.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Package className="size-10 text-[var(--border)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-secondary)]">No pending orders</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
