import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getVendorFromSession } from '@/lib/auth/server';
import { VendorLayoutShell } from '@/components/vendor/layout/VendorLayoutShell';

export const dynamic = 'force-dynamic'

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get('x-url') || '';
  const isLoginPage = pathname.includes('/login');

  const vendor = await getVendorFromSession();

  if (!vendor) {
    if (!isLoginPage) {
      redirect('/vendor/login');
    }
    return <>{children}</>;
  }

  // If we are on login page but already have a vendor session, we can still show children or redirect to dashboard
  // For now, if it's login page, we just return children as requested by the flow
  if (isLoginPage) {
    return <>{children}</>;
  }

  // HARD GATE: Non-ACTIVE vendors can only access onboarding
  const isActive = vendor.is_active === true || vendor.kyc_status === 'VERIFIED';
  if (!isActive && !pathname.includes('/onboarding')) {
    redirect('/vendor/onboarding');
  }


  return (
    <VendorLayoutShell vendor={vendor}>
      {children}
    </VendorLayoutShell>
  );
}
