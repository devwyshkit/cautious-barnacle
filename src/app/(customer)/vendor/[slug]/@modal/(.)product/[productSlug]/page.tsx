import { getProductSurface } from '@/lib/actions/discovery/products';
import { InterceptedProductSheet } from '@/components/customer/product/InterceptedProductSheet';
import { notFound } from 'next/navigation';

export default async function InterceptedProductPage({
    params,
}: {
    params: Promise<{ slug: string; productSlug: string }>;
}) {
    const { slug, productSlug } = await params;

    // WYSHKIT 2026: One-Trip God-Surface (Focused)
    // For intercepted routes, we only need the product data.
    // The background vendor store is ALREADY rendered by the parent layout's children.
    const { data, error } = await getProductSurface(productSlug, slug);

    if (!data || error) {
        // Return null or error so the UI stays stable
        return null;
    }

    return (
        <InterceptedProductSheet
            product={data.product}
            onCloseOverride={`/vendor/${slug}`}
        />
    );
}
