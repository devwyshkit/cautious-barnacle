import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getVendorFromSession } from '@/lib/auth/server';
import { VendorLayoutShell } from '@/components/vendor/layout/VendorLayoutShell';

export const dynamic = 'force-dynamic'

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // /vendor/login lives in (vendor-auth) route group - never hits this layout
  const vendor = await getVendorFromSession();
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
