import { getPartnerFromSession } from '@/lib/auth/server';
import { get_partner_orders } from '@/lib/actions/partner/partner-actions';
import { OrderQueue } from '@/components/partner/orders/OrderQueue';
import { redirect } from 'next/navigation';

export default async function PartnerOrdersPage() {
  const partner = await getPartnerFromSession();
  if (!partner) redirect('/partner/login');

  const { data: orders } = await get_partner_orders(partner.id);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Orders</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage incoming orders
        </p>
      </div>

      <OrderQueue initialOrders={orders || []} partnerId={partner.id} />
    </div>
  );
}
