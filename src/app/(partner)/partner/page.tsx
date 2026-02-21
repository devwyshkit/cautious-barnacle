import { getPartnerFromSession } from '@/lib/auth/server';
import { get_partner_stats, get_partner_orders } from "@/lib/actions/partner/partner-actions";
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

export default async function PartnerDashboard() {
  const partner = await getPartnerFromSession();
  if (!partner) redirect('/partner/login');

  const partner_id = partner.id; // Define partner_id as per instruction's usage

  const [statsResult, ordersResult] = await Promise.all([
    get_partner_stats(partner_id),
    get_partner_orders(partner_id, ['PLACED', 'CONFIRMED', 'DETAILS_RECEIVED', 'PREVIEW_READY', 'REVISION_REQUESTED', 'APPROVED', 'IN_PRODUCTION'])
  ]);

  const stats = statsResult.data;
  const pendingOrders = ordersResult.data || [];

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">
          {partner.display_name || partner.name}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Today&apos;s overview
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
                <p className="text-2xl font-semibold text-zinc-900">
                  {stats?.today_orders || 0}
                </p>
                <p className="text-xs text-zinc-500">Orders today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <IndianRupee className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-zinc-900">
                  ₹{(stats?.today_revenue || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-zinc-500">Revenue today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-zinc-900">
                  {stats?.pending_orders || 0}
                </p>
                <p className="text-xs text-zinc-500">Pending</p>
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
                <p className="text-2xl font-semibold text-zinc-900">
                  {stats?.avg_rating?.toFixed(1) || '-'}
                </p>
                <p className="text-xs text-zinc-500">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="bg-zinc-900 text-white border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold tracking-tight">₹{(stats?.total_earnings || 0).toLocaleString('en-IN')}</p>
                <p className="text-xs text-zinc-400 mt-1">Total Settled Earnings</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-emerald-400">₹{(stats?.pending_settlement || 0).toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats?.low_stock_count !== undefined && stats.low_stock_count > 0 && (
        <Card className="border-amber-100 bg-amber-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="size-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">{stats.low_stock_count} Items Low on Stock</p>
                  <p className="text-xs text-amber-700">Refill soon to avoid order cancellations</p>
                </div>
              </div>
              <Link href="/partner/catalog">
                <Button size="sm" variant="outline" className="bg-white border-amber-200 text-amber-700 hover:bg-amber-50 h-8">
                  Update
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {pendingOrders.length > 0 && (
        <Card className="border-red-100 bg-red-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertCircle className="size-4 text-red-500" />
                Action needed
              </CardTitle>
              <Link href="/partner/orders">
                <Button variant="ghost" size="sm" className="gap-1 text-zinc-500">
                  View all
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {pendingOrders.slice(0, 3).map((order: any) => (
                <Link
                  key={order.id}
                  href="/partner/orders"
                  className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0 hover:bg-white/50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      #{order.order_number}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {order.order_items?.length || 0} items · ₹{Number(order.total).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                    New
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pendingOrders.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Package className="size-10 text-zinc-200 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">No pending orders</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
