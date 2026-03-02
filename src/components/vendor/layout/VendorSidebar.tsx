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
import { useAuth } from '@/providers/AuthProvider';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const NAV_LINKS = [
  { href: '/vendor', label: 'Home', icon: Home },
  { href: '/vendor/orders', label: 'Orders', icon: Package },
  { href: '/vendor/personalization', label: 'Preview queue', icon: Palette },
  { href: '/vendor/products', label: 'Products', icon: ShoppingBag },
  { href: '/vendor/financials', label: 'Money', icon: Wallet },
  { href: '/vendor/insights', label: 'Insights', icon: BarChart3 },
  { href: '/vendor/onboarding', label: 'Settings', icon: Settings },
];

interface VendorSidebarProps {
  vendorId: string;
}

export function VendorSidebar({ vendorId }: VendorSidebarProps) {
  const pathname = usePathname();
  const { pendingCount } = useVendorOrdersStatus(vendorId);

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[var(--surface)] border-r border-[var(--border)] h-[100dvh] fixed left-0 top-0">
      <div className="p-4 border-b border-[var(--border)]">
        <Link href="/vendor" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <span className="text-white text-sm font-semibold">W</span>
          </div>
          <span className="font-semibold text-[var(--text-primary)]">Wyshkit Shop</span>
        </Link>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href ||
              (link.href !== '/vendor' && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-[var(--primary)] text-white shadow-brand'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
                  )}
                >
                  <Icon className="size-5" />
                  <span className="flex-1">{link.label}</span>
                  {link.label === 'Orders' && pendingCount > 0 && (
                    <Badge className="bg-[var(--primary)] text-white border-0 size-5 p-0 flex items-center justify-center text-xs font-bold">
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
