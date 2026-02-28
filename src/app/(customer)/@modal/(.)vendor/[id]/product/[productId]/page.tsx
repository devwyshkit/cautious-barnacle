import { getProductWithFullSpec } from '@/lib/actions/discovery/products';
import { InterceptedProductSheet } from '@/components/customer/product/InterceptedProductSheet';
import { notFound } from 'next/navigation';
import { WyshkitProduct } from '@/lib/types/product';

export default async function InterceptedProductPage({
    params,
}: {
    params: Promise<{ id: string; productId: string }>;
}) {
    const { id, productId } = await params;

    // WYSHKIT 2026: Atomic Product Fetch
    // Since this is an intercepted route, the background (Home/Search/Store) is already rendered.
    // We only fetch the specific product details.
    const { data: product, error } = await getProductWithFullSpec(productId);

    if (!product || error) {
        // If not found, Next.js will fall back to the full page version or show 404
        return null;
    }

    return (
        <InterceptedProductSheet
            product={product as unknown as WyshkitProduct}
        />
    );
}
