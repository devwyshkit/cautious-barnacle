'use client';

import { useRef, useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/components/customer/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { hasAnyPersonalization } from '@/lib/utils/personalization';
import { formatCurrency } from '@/lib/utils/pricing';

/**
 * WYSHKIT 2026: FloatingCartBar - Token Aligned
 * REFRESHED: Switched from Swiggy Emerald to WyshKit Red.
 */
export function FloatingCartBar() {
  const { draftOrder, loading, setDrawerOpen } = useCart();

  const displayCart = draftOrder;
  const hasProducts = displayCart && displayCart.product_count > 0;
  const isVisible = hasProducts;

  const handleOpenCart = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic(HapticPattern.ACTION);
    setDrawerOpen(true);
  };

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
        "fixed z-[var(--z-overlay)] transition-all duration-300 ease-out",
        "left-[var(--space-4)] right-[var(--space-4)] bottom-[var(--floating-cart-bottom)] pb-safe",
        "md:left-auto md:w-[420px] md:right-[var(--space-8)] md:bottom-[var(--space-8)] md:pb-0",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"
      )}
    >
      <button
        onClick={handleOpenCart}
        type="button"
        aria-label={`View cart: ${visualCount} items, ${formatCurrency(displayTotal)}`}
        className={cn(
          "w-full bg-[var(--primary)] backdrop-blur-3xl rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--primary-hover)]/30 overflow-hidden",
          "transition-all duration-300 cursor-pointer active:scale-[0.98] text-left",
          shouldPulse && "scale-[1.02] bg-[var(--primary-hover)]",
          isLoading && "opacity-70 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between px-[var(--space-4)] py-[var(--space-3)] min-h-[56px]">
          <div className="flex items-center gap-[var(--space-3)]">
            <div className="relative">
              <ShoppingBag className="size-5 text-[var(--primary-foreground)]/90" />
              <div className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-[var(--surface)] flex items-center justify-center shadow-[var(--shadow-sm)]">
                <span className="text-xs font-bold text-[var(--primary)]">{visualCount}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold text-[var(--primary-foreground)] leading-none">
                {visualCount} {visualCount === 1 ? 'product' : 'products'}
              </span>
              <div className="flex items-center gap-[var(--space-2)] mt-0.5">
                <span className="text-xs font-medium text-[var(--primary-foreground)]/80 truncate max-w-[120px]">
                  {displayCart?.products?.[0]?.vendor_name || 'Local store'}
                </span>
                {hasPersonalization && (
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[var(--surface)]/20">
                    <Sparkles className="size-2 text-white" />
                    <span className="text-xs font-bold text-white tracking-tight leading-none uppercase">Personalized</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[var(--space-2)]">
            <span className="text-sm font-bold text-[var(--primary-foreground)] tabular-nums">
              {formatCurrency(displayTotal)}
            </span>
            <div className="flex items-center gap-1 bg-[var(--surface)]/20 px-2.5 py-1 rounded-full text-white font-bold text-xs">
              View
              <ChevronRight className="size-3 stroke-[3]" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
