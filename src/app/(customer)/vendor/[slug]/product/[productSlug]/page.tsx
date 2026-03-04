import { getProductSurface } from '@/lib/actions/discovery/products';
import { VendorStorePage } from '@/components/customer/VendorStorePage';
import { InterceptedProductSheet } from '@/components/customer/product/InterceptedProductSheet';
import { notFound } from 'next/navigation';
import { MappedVendor } from '@/lib/types/vendor';

export default async function ProductFullPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;

  // WYSHKIT 2026: One-Trip God-Surface
  // Fetches focused product, variants, and background vendor store in exactly one trip.
  const { data, error } = await getProductSurface(productSlug, slug);

  if (!data || error || !data.product || !data.vendorContext?.vendor) {
    notFound();
  }

  const { product, vendorContext } = data;

  return (
    <div className="min-h-[100dvh]">
      <VendorStorePage
        vendorId={vendorContext.vendor.id}
        initialData={vendorContext.vendor}
        products={vendorContext.products}
        productsGroupedByCategory={vendorContext.productsGroupedByCategory}
        categories={vendorContext.categories}
      />

      <InterceptedProductSheet
        product={product}
        onCloseOverride={`/vendor/${slug}`}
      />
    </div>
  );
}

