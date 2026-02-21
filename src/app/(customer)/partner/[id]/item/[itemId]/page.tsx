import { getPartnerStoreData } from '@/lib/actions/discovery';
import { PartnerStorePage } from '@/components/customer/PartnerStorePage';
import { InterceptedItemSheet } from '@/components/customer/item/InterceptedItemSheet';
import { notFound } from 'next/navigation';

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id, itemId } = await params;
  const includeInactive = process.env.NODE_ENV === 'development';

  // WYSHKIT 2026: Immersive Store Context
  // Tapping a shared link to an item should show the store in the background, not a standalone page.
  const { partner, items, error } = await getPartnerStoreData(id, includeInactive);

  const item = items?.find(i => String(i.id) === itemId);

  if (!partner || !item || error) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <PartnerStorePage
        partnerId={id}
        initialData={partner as any}
        initialItems={items}
      />
      <InterceptedItemSheet
        item={item}
        onCloseOverride={`/partner/${id}`}
      />
    </div>
  );
}

