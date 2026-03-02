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

const NAV_LINKS = [
  { href: '/vendor', label: 'Home', icon: Home },
  { href: '/vendor/orders', label: 'Orders', icon: Package },
  { href: '/vendor/personalization', label: 'Preview', icon: Palette },
  { href: '/vendor/products', label: "Products", icon: ShoppingBag },
  { href: '/vendor/financials', label: 'Money', icon: Wallet },
];

export function VendorMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] lg:hidden z-[var(--z-nav)] safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href ||
            (link.href !== '/vendor' && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center gap-1.5 px-3 py-2 rounded-[var(--radius-lg)] transition-all min-w-[64px] relative group',
                isActive
                  ? 'text-[var(--primary)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              <div className={cn(
                "p-1.5 rounded-[var(--radius-md)] transition-colors",
                isActive ? "bg-[var(--primary-muted)]" : "group-hover:bg-[var(--surface-muted)]"
              )}>
                <Icon className={cn("size-5", isActive && "stroke-[2.5px]")} />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-tight",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
