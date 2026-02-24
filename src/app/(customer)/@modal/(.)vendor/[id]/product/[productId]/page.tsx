import { getItemWithFullSpec } from '@/lib/actions/discovery/products';
import { InterceptedProductSheet } from '@/components/customer/product/InterceptedProductSheet';
import { notFound } from 'next/navigation';
import { WyshkitItem } from '@/lib/types/product';

export default async function InterceptedItemPage({
    params,
}: {
    params: Promise<{ id: string; itemId: string }>;
}) {
    const { id, itemId } = await params;

    // WYSHKIT 2026: Atomic Product Fetch
    // Since this is an intercepted route, the background (Home/Search/Store) is already rendered.
    // We only fetch the specific product details.
    const { data: product, error } = await getItemWithFullSpec(itemId);

    if (!product || error) {
        // If not found, Next.js will fall back to the full page version or show 404
        return null;
    }

    return (
        <InterceptedProductSheet
            product={product as unknown as WyshkitItem}
        />
    );
}
