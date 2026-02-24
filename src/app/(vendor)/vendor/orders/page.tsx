import { getPartnerFromSession } from '@/lib/auth/server';
import { get_partner_orders } from '@/lib/actions/vendor/vendor-actions';
import { OrderQueue } from '@/components/vendor/orders/OrderQueue';
import { redirect } from 'next/navigation';

export default async function PartnerOrdersPage() {
  const vendor = await getPartnerFromSession();
  if (!vendor) redirect('/vendor/login');

  const { data: orders } = await get_partner_orders(vendor.id);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Orders</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage incoming orders
        </p>
      </div>

      <OrderQueue initialOrders={orders || []} partnerId={vendor.id} />
    </div>
  );
}
