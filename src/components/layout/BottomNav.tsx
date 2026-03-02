"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * WYSHKIT 2026: Mobile Bottom Navigation
 * Persistent tab bar for mobile-first experience.
 * REFRESHED: Enhanced active state with brand color and better accessibility.
 */
const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[var(--z-nav)] md:hidden bg-[var(--surface-glass)] backdrop-blur-3xl border-t border-[var(--border)] pb-safe shadow-[var(--shadow-lg)]">
      <div className="flex items-center justify-around h-[var(--bottom-nav-height)] px-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = href === "/"
            ? pathname === "/"
            : pathname.startsWith(href.split('?')[0]);

          return (
            <Link
              key={label}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200 outline-none",
                isActive ? "text-[var(--primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <div className="absolute inset-0 -m-2 bg-[var(--primary)]/10 rounded-full animate-in zoom-in-50 duration-300" />
                )}
                <Icon
                  className={cn(
                    "size-5 transition-all duration-300 relative z-10",
                    isActive ? "stroke-[3px] scale-110" : "stroke-[2px]"
                  )}
                />
              </div>
              <span className={cn(
                "text-xs font-bold uppercase tracking-wide relative z-10 mt-0.5",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
