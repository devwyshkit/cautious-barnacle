'use client';

import { useRef, useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
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
  const { draftOrder, loading, setCartOpen } = useCart();

  // WYSHKIT 2026: Single source of truth - useDraftOrder
  const displayCart = draftOrder;

  const isCheckoutOpen = pathname.startsWith('/checkout');
  const hasItems = displayCart && displayCart.item_count > 0;

  // WYSHKIT 2026: Visibility Logic
  const isVisible = hasItems && !isCheckoutOpen;

  const handleOpenCart = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic(HapticPattern.ACTION);
    setCartOpen(true);
  };

  const firstItemImage = displayCart?.items?.[0]?.item_image;
  const hasPersonalization = hasAnyPersonalization(displayCart?.items || []);
  const displayCount = displayCart?.item_count || 0;
  const displayTotal = displayCart?.total || 0;
  const isLoading = loading;

  const [shouldPulse, setShouldPulse] = useState(false);
  const [visualCount, setVisualCount] = useState(displayCount);
  const prevCount = useRef(displayCount);

  useEffect(() => {
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

  return (
    <div
      role="region"
      aria-label="Floating cart summary"
      data-testid="floating-cart-bar"
      className={cn(
        "fixed z-[45] transition-all duration-300 ease-out",
        "left-4 right-4 md:left-auto md:w-[420px] md:right-8",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"
      )}
      style={{
        // Sit directly above BottomNav
        bottom: `calc(var(--bottom-nav-height, 64px) + env(safe-area-inset-bottom, 0px) + 16px)`
      }}
    >
      <div
        onClick={handleOpenCart}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleOpenCart(e as any)}
        className={cn(
          "bg-emerald-600 backdrop-blur-3xl rounded-2xl shadow-sm border border-emerald-500 overflow-hidden",
          "transition-all duration-300 cursor-pointer active:scale-[0.98]",
          shouldPulse && "scale-[1.02] bg-emerald-500",
          isLoading && "opacity-70 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
          {/* Left: Standardized slim cart item summary */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="size-5 text-emerald-100" />
              <div className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span className="text-[9px] font-black text-emerald-600">{visualCount}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-black text-white leading-none">
                {visualCount} {visualCount === 1 ? 'item' : 'items'}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-medium text-emerald-100/90 truncate max-w-[120px]">
                  {displayCart?.items?.[0]?.partner_name || 'Local store'}
                </span>
                {hasPersonalization && (
                  <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-white/20">
                    <Sparkles className="size-2 text-white" />
                    <span className="text-[9px] font-black text-white tracking-widest leading-none">PREVIEW</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Price & CTA */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white tabular-nums">
              ₹{displayTotal.toFixed(0)}
            </span>
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-white font-bold text-xs">
              View
              <ChevronRight className="size-3 stroke-[3]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
