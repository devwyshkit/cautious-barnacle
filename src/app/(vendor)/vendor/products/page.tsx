import { getVendorFromSession } from '@/lib/auth/server';
import { get_vendor_products } from '@/lib/actions/vendor/vendor-actions';
import { ProductListClient } from '@/components/vendor/products/ProductListClient';
import { redirect } from 'next/navigation';

export default async function VendorProductPage() {
  const vendor = await getVendorFromSession();
  if (!vendor) redirect('/vendor/login');

  const { data: products } = await get_vendor_products(vendor.id);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Products</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage your products and inventory
        </p>
      </div>

      <ProductListClient
        initialProducts={products || []}
        vendorId={vendor.id}
      />
    </div>
  );
}
