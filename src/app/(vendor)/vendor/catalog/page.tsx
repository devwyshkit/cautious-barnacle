import { getVendorFromSession } from '@/lib/auth/server';
import { get_vendor_products } from '@/lib/actions/vendor/vendor-actions';
import { CatalogListClient } from '@/components/vendor/catalog/CatalogListClient';
import { redirect } from 'next/navigation';

export default async function VendorCatalogPage() {
  const vendor = await getVendorFromSession();
  if (!vendor) redirect('/vendor/login');

  const { data: products } = await get_vendor_products(vendor.id);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Catalog</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your products and inventory
        </p>
      </div>

      <CatalogListClient
        initialProducts={products || []}
        vendorId={vendor.id}
      />
    </div>
  );
}
