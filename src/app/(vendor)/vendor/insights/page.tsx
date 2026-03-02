import { getVendorFromSession } from '@/lib/auth/server';
import { get_vendor_stats, get_vendor_orders } from "@/lib/actions/vendor/vendor-actions";
import { redirect } from 'next/navigation';
import { Package, TrendingUp, BarChart3, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function VendorInsightsPage() {
  const vendor = await getVendorFromSession();
  if (!vendor) redirect('/vendor/login');

  const vendor_id = vendor.id; // Define vendor_id for clarity

  const { data: stats } = await get_vendor_stats(vendor_id);
  const { data: orders } = await get_vendor_orders(vendor_id, ['DELIVERED', 'CANCELLED', 'REFUNDED', 'PLACED', 'CONFIRMED', 'IN_PRODUCTION', 'PACKED', 'OUT_FOR_DELIVERY']); // Fetch all orders for breakdown

  const allOrders = orders || [];

  const deliveredOrders = allOrders.filter(o => o.status === 'DELIVERED');
  const cancelledOrders = allOrders.filter(o => o.status === 'CANCELLED');

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const last7DaysOrders = allOrders.filter(o => o.created_at && new Date(o.created_at) > weekAgo);

  const totalRevenue = last7DaysOrders.reduce((sum: number, o) => sum + Number(o.total || 0), 0);
  const avgOrderValue = deliveredOrders.length > 0
    ? totalRevenue / deliveredOrders.length
    : 0;

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Insights</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Performance analytics
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
                <p className="text-xl font-semibold text-[var(--text-primary)]">
                  {allOrders.length}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Total orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--well-success)] flex items-center justify-center">
                <TrendingUp className="size-5 text-[var(--well-success-text)]" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--text-primary)]">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Total revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--well-warning)] flex items-center justify-center">
                <BarChart3 className="size-5 text-[var(--well-warning-text)]" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--text-primary)]">
                  ₹{Math.round(avgOrderValue).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Avg order value</p>
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
                <p className="text-xl font-semibold text-[var(--text-primary)]">
                  {stats?.avg_rating?.toFixed(1) || '-'}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Order breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--text-secondary)]">Delivered</span>
              <span className="text-sm font-bold text-[var(--well-success-text)]">
                {deliveredOrders.length}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--text-secondary)]">Cancelled</span>
              <span className="text-sm font-bold text-[var(--well-destructive-text)]">
                {cancelledOrders.length}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--text-secondary)]">In progress</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {allOrders.filter(o => !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status)).length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--text-secondary)]">Completion rate</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {allOrders.length > 0
                  ? `${Math.round((deliveredOrders.length / allOrders.length) * 100)}% `
                  : '-'
                }
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--text-secondary)]">Total ratings</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {vendor.total_ratings || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
