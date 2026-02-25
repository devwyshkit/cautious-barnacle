'use client';

import { useRef, useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/components/customer/CartProvider';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { hasAnyPersonalization, hasProductPersonalization } from '@/lib/utils/personalization';
import { formatCurrency } from '@/lib/utils/pricing';

/**
 * WYSHKIT 2026: FloatingCartBar - CSS transitions (zero JS overhead)
 * Swiggy 2026 Pattern: Immediate visibility, smooth CSS animations
 * Keep in DOM for proper CSS transitions (no early return)
 */
export function FloatingCartBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { draftOrder, loading } = useCart();
  const { user: authUser } = useAuth();

  const displayCart = draftOrder;
  const hasItems = displayCart && displayCart.product_count > 0;
  const isVisible = hasItems;

  const handleOpenCart = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic(HapticPattern.ACTION);

    router.push('/checkout');
  };

  const firstItemImage = displayCart?.products?.[0]?.product_image;
  const hasPersonalization = hasAnyPersonalization((displayCart?.products || []) as any[]);
  const productCount = displayCart?.product_count || 0;
  const displayTotal = displayCart?.total || 0;
  const isLoading = loading;

  const [shouldPulse, setShouldPulse] = useState(false);
  const [visualCount, setVisualCount] = useState(productCount);
  const prevCount = useRef(productCount);

  useEffect(() => {
    setVisualCount(productCount);
    if (productCount !== prevCount.current && productCount > 0) {
      if (productCount > prevCount.current) {
        setShouldPulse(true);
        triggerHaptic(HapticPattern.ACTION);
        const timer = setTimeout(() => setShouldPulse(false), 300);
        return () => clearTimeout(timer);
      }
      prevCount.current = productCount;
    }
  }, [productCount]);

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
          "bg-emerald-600 backdrop-blur-3xl rounded-xl shadow-sm border border-emerald-500 overflow-hidden",
          "transition-all duration-300 cursor-pointer active:scale-[0.98]",
          shouldPulse && "scale-[1.02] bg-emerald-500",
          isLoading && "opacity-70 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
          {/* Left: Standardized slim cart product summary */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="size-5 text-emerald-100" />
              <div className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span className="text-[9px] font-black text-emerald-600">{visualCount}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-black text-white leading-none">
                {visualCount} {visualCount === 1 ? 'product' : 'products'}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-medium text-emerald-100/90 truncate max-w-[120px]">
                  {displayCart?.products?.[0]?.vendor_name || 'Local store'}
                </span>
                {hasPersonalization && (
                  <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-white/20">
                    <Sparkles className="size-2 text-white" />
                    <span className="text-[9px] font-black text-white tracking-tight leading-none">Personalized</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Price & CTA */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white tabular-nums">
              {formatCurrency(displayTotal)}
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
