import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getPartnerFromSession } from '@/lib/auth/server';
import { VendorLayoutShell } from '@/components/vendor/layout/VendorLayoutShell';

export const dynamic = 'force-dynamic'

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const vendor = await getPartnerFromSession();
  if (!vendor) {
    redirect('/vendor/login');
  }

  // HARD GATE: Non-ACTIVE vendors can only access onboarding
  const isActive = vendor.kyc_status === 'ACTIVE' || vendor.onboarding_status === 'ACTIVE';
  if (!isActive) {
    redirect('/vendor/onboarding');
  }

  const supabase = await createClient();

  return (
    <VendorLayoutShell vendor={vendor}>
      {children}
    </VendorLayoutShell>
  );
}
