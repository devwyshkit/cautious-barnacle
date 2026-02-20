'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Package, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

/**
 * WYSHKIT 2026: Intent-Based Navigation - BottomNav uses routes instead of Zustand
 * Swiggy 2026 Pattern: URL state is the single source of truth
 */
export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleAccountClick = () => {
    if (user) {
      // WYSHKIT 2026: Intent-Based Navigation - Use route instead of Zustand
      router.push('/profile');
    } else {
      // WYSHKIT 2026: Intent-Based Navigation - Use route with returnUrl
      router.push('/auth?intent=signin&returnUrl=/profile');
    }
  };

  const NAV_ITEMS = [
    {
      label: 'Home',
      icon: Home,
      onClick: () => {
        router.push('/');
      },
      isActive: mounted && pathname === '/'
    },
    {
      label: 'Search',
      icon: Search,
      onClick: () => router.push('/search'),
      isActive: mounted && pathname === '/search'
    },
    {
      label: 'Orders',
      icon: Package,
      onClick: () => router.push(user ? '/orders' : '/auth?intent=signin&returnUrl=/orders'),
      isActive: mounted && pathname.startsWith('/orders')
    },
    {
      label: 'Account',
      icon: User,
      onClick: handleAccountClick,
      isActive: mounted && (pathname === '/profile' || pathname.startsWith('/auth'))
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-zinc-100 md:hidden pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-transform active:scale-95"
            >
              <Icon className={cn(
                "size-5",
                isActive ? "text-zinc-950" : "text-zinc-400"
              )} />
              <span className={cn(
                "text-[11px] tracking-tight",
                isActive ? "font-bold text-zinc-950" : "font-medium text-zinc-400"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
