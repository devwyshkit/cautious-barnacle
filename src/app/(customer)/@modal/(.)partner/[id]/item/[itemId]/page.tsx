import { getItemWithFullSpec } from '@/lib/actions/discovery/items';
import { InterceptedItemSheet } from '@/components/customer/item/InterceptedItemSheet';
import { notFound } from 'next/navigation';
import { WyshkitItem } from '@/lib/types/item';

export default async function InterceptedItemPage({
    params,
}: {
    params: Promise<{ id: string; itemId: string }>;
}) {
    const { id, itemId } = await params;

    // WYSHKIT 2026: Atomic Item Fetch
    // Since this is an intercepted route, the background (Home/Search/Store) is already rendered.
    // We only fetch the specific item details.
    const { data: item, error } = await getItemWithFullSpec(itemId);

    if (!item || error) {
        // If not found, Next.js will fall back to the full page version or show 404
        return null;
    }

    return (
        <InterceptedItemSheet
            item={item as unknown as WyshkitItem}
        />
    );
}
