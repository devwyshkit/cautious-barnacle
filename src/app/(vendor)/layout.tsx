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

  if (!vendor && !isLoginPage) {
    redirect('/vendor/login');
  }

  // If we are on login page, we don't need the shell or active checks
  if (isLoginPage) {
    return <>{children}</>;
  }

  // HARD GATE: Non-ACTIVE vendors can only access onboarding
  const isActive = (vendor as any).is_active === true || (vendor as any).kyc_status === 'VERIFIED';
  if (!isActive) {
    redirect('/vendor/onboarding');
  }


  return (
    <VendorLayoutShell vendor={vendor as any}>
      {children}
    </VendorLayoutShell>
  );
}
