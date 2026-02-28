import { getVendorStoreData } from '@/lib/actions/discovery/vendors';
import { VendorStorePage } from '@/components/customer/VendorStorePage';
import { InterceptedProductSheet } from '@/components/customer/product/InterceptedProductSheet';
import { notFound } from 'next/navigation';
import { MappedVendor } from '@/lib/types/vendor';


export default async function ProductFullPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const { id, productId } = await params;

  // WYSHKIT 2026: Immersive Store Context
  // Tapping a shared link to a product should show the store in the background, not a standalone page.
  const { vendor, products, productsGroupedByCategory, categories, error } = await getVendorStoreData(id);

  const product = products?.find(i => String(i.id) === productId);

  if (!vendor || !product || error) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <VendorStorePage
        vendorId={id}
        initialData={(vendor as unknown) as MappedVendor}
        products={products}
        productsGroupedByCategory={productsGroupedByCategory}
        categories={categories}
      />

      <InterceptedProductSheet
        product={product}
        onCloseOverride={`/vendor/${id}`}
      />
    </div>
  );
}

