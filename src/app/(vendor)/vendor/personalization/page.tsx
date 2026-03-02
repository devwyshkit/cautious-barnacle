import { getVendorFromSession } from '@/lib/auth/server';
import { get_personalization_queue } from "@/lib/actions/vendor/vendor-actions";
import { PersonalizationQueueClient } from '@/components/vendor/personalization/PersonalizationQueueClient';
import { redirect } from 'next/navigation';

export default async function VendorPersonalizationPage() {
  const vendor = await getVendorFromSession();
  if (!vendor) redirect('/vendor/login');

  const { data: queue } = await get_personalization_queue(vendor.id);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Preview queue</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Upload previews for personalized orders
        </p>
      </div>

      <PersonalizationQueueClient initialOrders={queue || []} />
    </div>
  );
}
