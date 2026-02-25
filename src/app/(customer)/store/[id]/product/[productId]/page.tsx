import { getVendorStoreData } from '@/lib/actions/discovery/vendors';
import { VendorStorePage } from '@/components/customer/VendorStorePage';
import { InterceptedProductSheet } from '@/components/customer/product/InterceptedProductSheet';
import { notFound } from 'next/navigation';
import { MappedVendor } from '@/lib/types/vendor';


export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id, itemId } = await params;

  // WYSHKIT 2026: Immersive Store Context
  // Tapping a shared link to an product should show the store in the background, not a standalone page.
  const { vendor, products, itemsGroupedByCategory, categories, error } = await getVendorStoreData(id);

  const product = products?.find(i => String(i.id) === itemId);

  if (!vendor || !product || error) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <VendorStorePage
        vendorId={id}
        initialData={(vendor as unknown) as MappedVendor}
        products={products}
        itemsGroupedByCategory={itemsGroupedByCategory}
        categories={categories}
      />

      <InterceptedProductSheet
        product={product}
        onCloseOverride={`/vendor/${id}`}
      />
    </div>
  );
}

