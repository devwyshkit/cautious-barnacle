"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerHaptic, HapticPattern } from "@/lib/utils/haptic";

/**
 * WYSHKIT 2026: Mobile Bottom Navigation
 * Persistent tab bar for mobile-first experience.
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
              key={href}
              href={href}
              onClick={() => triggerHaptic(HapticPattern.SOFT)}
              className={cn(
                "flex flex-col items-center justify-center gap-[var(--space-1)] w-full h-full relative transition-all active:scale-90",
                isActive ? "text-[var(--primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              <Icon className={cn("size-[var(--space-5)]", isActive ? "stroke-[3px]" : "stroke-[2.5px]")} />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-tighter leading-none",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {label}
              </span>
              {isActive && (
                <div className="absolute top-[var(--space-1)] right-[var(--space-4)] size-1 bg-[var(--primary)] rounded-full animate-in zoom-in duration-300" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
