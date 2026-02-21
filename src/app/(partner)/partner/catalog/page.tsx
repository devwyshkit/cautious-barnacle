import { getPartnerFromSession } from '@/lib/auth/server';
import { get_partner_items } from '@/lib/actions/partner/partner-actions';
import { CatalogListClient } from '@/components/partner/catalog/CatalogListClient';
import { redirect } from 'next/navigation';

export default async function PartnerCatalogPage() {
  const partner = await getPartnerFromSession();
  if (!partner) redirect('/partner/login');

  const { data: items } = await get_partner_items(partner.id);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Catalog</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your items and inventory
        </p>
      </div>

      <CatalogListClient
        initialItems={items || []}
        partnerId={partner.id}
      />
    </div>
  );
}
