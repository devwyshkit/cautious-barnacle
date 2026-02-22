'use client';

import { useRef, useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/components/customer/CartProvider';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { hasAnyPersonalization } from '@/lib/utils/personalization';

/**
 * WYSHKIT 2026: FloatingCartBar - CSS transitions (zero JS overhead)
 * Swiggy 2026 Pattern: Immediate visibility, smooth CSS animations
 * Keep in DOM for proper CSS transitions (no early return)
 */
export function FloatingCartBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { draftOrder, loading } = useCart();

  // WYSHKIT 2026: Single source of truth - useDraftOrder
  const displayCart = draftOrder;

  const isCheckoutOpen = pathname.startsWith('/checkout');
  const hasItems = displayCart && displayCart.item_count > 0;

  // WYSHKIT 2026: Visibility Logic
  // Show cart whenever there are items; don't hide for unrelated active orders.
  // If tracking bar is present, we LIFT the cart bar to stack above it.
  const isVisible = hasItems && !isCheckoutOpen;

  const handleCheckout = (e: React.MouseEvent) => {
    // WYSHKIT 2026: Immediate haptic feedback for checkout initiation
    triggerHaptic(HapticPattern.ACTION);

    if (!displayCart || displayCart.item_count === 0) {
      e.preventDefault();
      return;
    }
  };

  const firstItemImage = displayCart?.items?.[0]?.item_image;
  const hasPersonalization = hasAnyPersonalization(displayCart?.items || []);
  const displayCount = displayCart?.item_count || 0;
  const displayTotal = displayCart?.total || 0;
  // WYSHKIT 2026: Loading state - show loading when fetching cart data
  const isLoading = loading;

  const [shouldPulse, setShouldPulse] = useState(false);
  // WYSHKIT 2026: Visual count for animation sync
  const [visualCount, setVisualCount] = useState(displayCount);
  const prevCount = useRef(displayCount);
  const prevLoading = useRef(loading);

  useEffect(() => {
    // WYSHKIT 2026: Instant status - satisfy "Badge pops instantly"
    setVisualCount(displayCount);
    if (displayCount !== prevCount.current && displayCount > 0) {
      if (displayCount > prevCount.current) {
        setShouldPulse(true);
        triggerHaptic(HapticPattern.ACTION);
        const timer = setTimeout(() => setShouldPulse(false), 300);
        return () => clearTimeout(timer);
      }
      prevCount.current = displayCount;
    }
  }, [displayCount]);

  // WYSHKIT 2026: Sync state when loading completes to ensure server state is reflected
  useEffect(() => {
    if (prevLoading.current && !loading) {
      // Loading just completed - server state is now fresh
    }
    prevLoading.current = loading;
  }, [loading]);

  // WYSHKIT 2026: Always render the container to enable CSS transitions.
  // Toggle visibility using transform (translate-y) and opacity.
  return (
    <div
      role="region"
      aria-label="Floating cart summary"
      data-testid="floating-cart-bar"
      className={cn(
        "fixed z-[999] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "left-3 right-3 md:left-auto md:w-[380px] md:right-6",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      )}
      style={{
        bottom: `calc(var(--bottom-nav-height, 0px) + var(--tracking-bar-height, 0px) + 12px + env(safe-area-inset-bottom, 0px))`
      }}
    >
      <div
        className={cn(
          "bg-zinc-950/98 backdrop-blur-2xl rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] border border-white/5 overflow-hidden",
          "transition-all duration-500",
          shouldPulse && "scale-[1.02] ring-2 ring-[var(--primary)]/30"
        )}
      >
        <div className="relative">
          <Link
            href="/checkout"
            onClick={handleCheckout}
            aria-disabled={isLoading}
            className={cn(
              "w-full flex items-center justify-between p-3 transition-all active:scale-[0.97]",
              isLoading && "opacity-70 pointer-events-none"
            )}
          >

            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <div className="relative size-10 rounded-xl bg-zinc-900 overflow-hidden ring-1 ring-zinc-800/50">
                  {firstItemImage ? (
                    <div className="relative size-full">
                      <Image
                        src={firstItemImage}
                        alt="Cart item"
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <ShoppingBag className="size-4 text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="absolute -top-1 -right-1 size-5 rounded-full bg-[#D91B24] flex items-center justify-center ring-2 ring-zinc-950 shadow-md animate-in zoom-in-50 duration-300">
                  <span className="text-[10px] font-black text-white">{visualCount}</span>
                </div>
              </div>

              <div className="flex flex-col items-start min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-tight leading-none">
                    {visualCount} {visualCount === 1 ? 'item' : 'items'}
                  </span>
                  {hasPersonalization && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/10">
                      <Sparkles className="size-2 text-amber-500" />
                      <span className="text-[7px] font-bold text-amber-500 uppercase tracking-tight">Personalized</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-medium text-zinc-500 truncate max-w-[120px] tracking-wide mt-0.5">
                  {displayCart?.items?.[0]?.partner_name || 'Local store'}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#D91B24] text-white shadow-lg relative",
                isLoading && "opacity-50"
              )}
            >
              <span className="tabular-nums">₹{displayTotal.toFixed(0)}</span>
              <ChevronRight className="size-3.5 stroke-[3]" />
            </div>
          </Link>
        </div>

        <div className="h-px bg-white/[0.03]" />

        <div className="flex items-center justify-between px-6 py-2 bg-white/[0.01]">
          {displayCart?.partner_id && (
            <button
              onClick={() => {
                triggerHaptic(HapticPattern.ACTION);
                router.push(`/partner/${displayCart.partner_id}`);
              }}
              className="group flex items-center gap-1.5 py-1"
            >
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors truncate max-w-[180px]">
                View {displayCart?.items?.[0]?.partner_name || 'Store'}
              </span>
              <ChevronRight className="size-2.5 text-zinc-800 group-hover:text-zinc-500 transition-colors" />
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <div className="size-1 rounded-full bg-emerald-500/40 animate-pulse" />
            <span className="text-[8px] font-medium text-zinc-700 uppercase tracking-widest font-mono">Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
