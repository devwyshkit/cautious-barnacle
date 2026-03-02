import { getVendorFromSession } from '@/lib/auth/server';
import { get_vendor_orders } from '@/lib/actions/vendor/vendor-actions';
import { OrderQueue } from '@/components/vendor/orders/OrderQueue';
import { redirect } from 'next/navigation';
import type { VendorOrder } from '@/lib/actions/commerce/orders';

export default async function VendorOrdersPage() {
  const vendor = await getVendorFromSession();
  if (!vendor) redirect('/vendor/login');

  const { data: orders } = await get_vendor_orders(vendor.id);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Orders</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage incoming orders
        </p>
      </div>

      <OrderQueue initialOrders={orders || []} vendorId={vendor.id} />
    </div>
  );
}
