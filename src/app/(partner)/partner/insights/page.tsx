import { getPartnerFromSession } from '@/lib/auth/server';
import { get_partner_stats, get_partner_orders } from "@/lib/actions/partner/partner-actions";
import { redirect } from 'next/navigation';
import { Package, TrendingUp, BarChart3, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function PartnerInsightsPage() {
  const partner = await getPartnerFromSession();
  if (!partner) redirect('/partner/login');

  const partner_id = partner.id; // Define partner_id for clarity

  const { data: stats } = await get_partner_stats(partner_id);
  const { data: orders } = await get_partner_orders(partner_id, ['DELIVERED', 'CANCELLED', 'REFUNDED', 'PLACED', 'CONFIRMED', 'IN_PRODUCTION', 'PACKED', 'DISPATCHED', 'OUT_FOR_DELIVERY']); // Fetch all orders for breakdown

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
        <h1 className="text-xl font-semibold text-zinc-900">Insights</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Performance analytics
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Package className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-900">
                  {allOrders.length}
                </p>
                <p className="text-xs text-zinc-500">Total orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-900">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-zinc-500">Total revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <BarChart3 className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-900">
                  ₹{Math.round(avgOrderValue).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-zinc-500">Avg order value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Star className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-900">
                  {stats?.avg_rating?.toFixed(1) || '-'}
                </p>
                <p className="text-xs text-zinc-500">Rating</p>
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
              <span className="text-sm text-zinc-600">Delivered</span>
              <span className="text-sm font-medium text-emerald-600">
                {deliveredOrders.length}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-zinc-600">Cancelled</span>
              <span className="text-sm font-medium text-red-600">
                {cancelledOrders.length}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-zinc-600">In progress</span>
              <span className="text-sm font-medium text-zinc-900">
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
              <span className="text-sm text-zinc-600">Completion rate</span>
              <span className="text-sm font-medium text-zinc-900">
                {allOrders.length > 0
                  ? `${Math.round((deliveredOrders.length / allOrders.length) * 100)}% `
                  : '-'
                }
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-zinc-600">Total ratings</span>
              <span className="text-sm font-medium text-zinc-900">
                {partner.total_ratings || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
