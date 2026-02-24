'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Palette,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/vendor', label: 'Home', icon: Home },
  { href: '/vendor/orders', label: 'Orders', icon: Package },
  { href: '/vendor/personalization', label: 'Preview', icon: Palette },
  { href: '/vendor/catalog', label: 'Catalog', icon: ShoppingBag },
  { href: '/vendor/financials', label: 'Money', icon: Wallet },
];

export function VendorMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 lg:hidden z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((product) => {
          const isActive = pathname === product.href || 
            (product.href !== '/vendor' && pathname.startsWith(product.href));
          const Icon = product.icon;

          return (
            <Link
              key={product.href}
              href={product.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[56px]',
                isActive 
                  ? 'text-zinc-900' 
                  : 'text-zinc-400'
              )}
            >
              <Icon className={cn("size-5", isActive && "stroke-[2.5px]")} />
              <span className="text-xs font-medium">{product.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
