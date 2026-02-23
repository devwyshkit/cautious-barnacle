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
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-zinc-100 pb-safe">
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = href === "/"
            ? pathname === "/"
            : pathname.startsWith(href.split('?')[0]);

          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200",
                isActive ? "text-zinc-950" : "text-zinc-400"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "size-5.5 transition-transform duration-300",
                    isActive ? "stroke-[3px] scale-110" : "stroke-[2px]"
                  )}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zinc-950" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                isActive ? "opacity-100" : "opacity-60"
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
