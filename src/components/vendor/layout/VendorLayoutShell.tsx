import { VendorSidebar } from './VendorSidebar';
import { VendorMobileNav } from './VendorMobileNav';
import { VendorTopBar } from './VendorTopBar';
import type { Database } from '@/lib/supabase/database.types';

type Vendor = Database['public']['Tables']['vendors']['Row'];

interface VendorLayoutShellProps {
  children: React.ReactNode;
  vendor: Vendor;
}

export function VendorLayoutShell({ children, vendor }: VendorLayoutShellProps) {
  return (
    <div className="h-[100dvh] bg-[var(--surface-muted)] flex flex-col lg:flex-row overflow-hidden">
      <VendorSidebar vendorId={vendor.id} />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <VendorTopBar vendor={vendor} />

        <main className="flex-1 overflow-y-auto no-scrollbar pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto w-full p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      <VendorMobileNav />
    </div>
  );
}
