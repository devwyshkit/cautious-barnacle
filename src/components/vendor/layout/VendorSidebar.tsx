'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Palette,
  ShoppingBag,
  Wallet,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVendorOrdersStatus } from '@/hooks/useVendorOrdersStatus';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { href: '/vendor', label: 'Home', icon: Home },
  { href: '/vendor/orders', label: 'Orders', icon: Package },
  { href: '/vendor/personalization', label: 'Preview queue', icon: Palette },
  { href: '/vendor/catalog', label: 'Catalog', icon: ShoppingBag },
  { href: '/vendor/financials', label: 'Money', icon: Wallet },
  { href: '/vendor/insights', label: 'Insights', icon: BarChart3 },
  { href: '/vendor/onboarding', label: 'Settings', icon: Settings },
];

export function VendorSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [vendorId, setVendorId] = useState<string | undefined>();

  useEffect(() => {
    async function getVendorId() {
      if (!user) return;
      const supabase = createClient();
      // vendor_external_id links auth.users.id → vendors
      const { data } = await supabase
        .from('vendors')
        .select('id')
        .eq('vendor_external_id', user.id)
        .maybeSingle();
      if (data) setVendorId(data.id);
    }
    getVendorId();
  }, [user]);

  const { pendingCount } = useVendorOrdersStatus(vendorId);

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-zinc-100 h-screen fixed left-0 top-0">
      <div className="p-4 border-b border-zinc-100">
        <Link href="/vendor" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-zinc-900 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">W</span>
          </div>
          <span className="font-semibold text-zinc-900">Vendor</span>
        </Link>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((product) => {
            const isActive = pathname === product.href ||
              (product.href !== '/vendor' && pathname.startsWith(product.href));
            const Icon = product.icon;

            return (
              <li key={product.href}>
                <Link
                  href={product.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  )}
                >
                  <Icon className="size-5" />
                  <span className="flex-1">{product.label}</span>
                  {product.label === 'Orders' && pendingCount > 0 && (
                    <Badge className="bg-red-500 text-white border-0 size-5 p-0 flex items-center justify-center text-xs font-bold">
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
