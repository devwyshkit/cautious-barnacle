"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerHaptic, HapticPattern } from "@/lib/utils/haptic";
import { useUI } from "@/providers/UIProvider";

/**
 * WYSHKIT 2026: Mobile Bottom Navigation
 * Persistent tab bar for mobile-first experience.
 */
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  id?: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search, id: 'search' },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: User, id: 'profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { openProfileSheet, openSearchSheet } = useUI();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[var(--z-nav)] md:hidden bg-[var(--surface-glass)] backdrop-blur-3xl border-t border-[var(--border)] pb-safe shadow-[var(--shadow-lg)]">
      <div className="flex items-center justify-around h-[var(--bottom-nav-height)] px-2">
        {navItems.map((item) => {
          const { label, href, icon: Icon } = item;
          const isAction = item.id === 'profile' || item.id === 'search';
          const isActive = href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={label}
              href={href}
              onClick={(e) => {
                triggerHaptic(HapticPattern.ACTION);
                if (isAction) {
                  e.preventDefault();
                  if (item.id === 'profile') openProfileSheet();
                  else openSearchSheet();
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-[var(--space-1)] w-full h-full relative transition-all active:scale-90",
                isActive ? "text-[var(--primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              <Icon className={cn("size-4", isActive ? "stroke-[3px]" : "stroke-[2.5px]")} />
              <span className={cn(
                "text-[9px] font-bold tracking-tight leading-none",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {label}
              </span>
              {isActive && (
                <div className="absolute -bottom-[var(--space-1)] left-1/2 -translate-x-1/2 size-1 bg-[var(--primary)] rounded-full animate-in zoom-in duration-300" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

