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
import { usePartnerOrdersStatus } from '@/hooks/usePartnerOrdersStatus';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { href: '/partner', label: 'Home', icon: Home },
  { href: '/partner/orders', label: 'Orders', icon: Package },
  { href: '/partner/personalization', label: 'Preview queue', icon: Palette },
  { href: '/partner/catalog', label: 'Catalog', icon: ShoppingBag },
  { href: '/partner/financials', label: 'Money', icon: Wallet },
  { href: '/partner/insights', label: 'Insights', icon: BarChart3 },
  { href: '/partner/onboarding', label: 'Settings', icon: Settings },
];

export function PartnerSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [partnerId, setPartnerId] = useState<string | undefined>();

  useEffect(() => {
    async function getPartnerId() {
      if (!user) return;
      const supabase = createClient();
      const { data } = await supabase
        .from('partner_users')
        .select('partner_id')
        .eq('user_id', user.id)
        .single();
      if (data) setPartnerId((data as any).partner_id);
    }
    getPartnerId();
  }, [user]);

  const { pendingCount } = usePartnerOrdersStatus(partnerId);

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-zinc-100 h-screen fixed left-0 top-0">
      <div className="p-4 border-b border-zinc-100">
        <Link href="/partner" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-zinc-900 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">W</span>
          </div>
          <span className="font-semibold text-zinc-900">Partner</span>
        </Link>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/partner' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  )}
                >
                  <Icon className="size-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.label === 'Orders' && pendingCount > 0 && (
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
