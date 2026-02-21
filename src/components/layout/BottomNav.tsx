"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * WYSHKIT 2026: Mobile Bottom Navigation
 * Persistent tab bar for mobile-first experience.
 */
const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Orders", href: "/profile?tab=orders", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe">
      <div className="glass-morphism mx-4 mb-4 rounded-[28px] px-2 py-2 flex items-center justify-around translate-y-0 transition-transform duration-500">
        {navItems.map(({ label, href, icon: Icon }) => {
          // Strict matching for home, startsWith for others
          const isActive = href === "/"
            ? pathname === "/"
            : pathname.startsWith(href.split('?')[0]);

          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 min-w-[64px] py-1.5 transition-all duration-300 rounded-[20px]",
                isActive
                  ? "bg-rose-50/50 text-rose-600 scale-105"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <Icon
                className={cn(
                  "size-5.5 transition-all duration-500",
                  isActive ? "fill-rose-600/10 stroke-[2.5px]" : "stroke-[2px]"
                )}
              />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.05em] transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-0"
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
