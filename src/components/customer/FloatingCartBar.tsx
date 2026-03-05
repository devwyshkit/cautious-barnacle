'use client';

import { useRef, useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/components/customer/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { hasAnyPersonalization } from '@/lib/utils/personalization';
import { formatCurrency } from '@/lib/utils/pricing';
import { AppText } from '@/components/ui/Typography';

/**
 * WYSHKIT 2026: FloatingCartBar - Spatial Pill Pattern
 * Ultra-compact, thumb-friendly, high-density pill. Zero width bloat.
 */
export function FloatingCartBar({ isStacked = false }: { isStacked?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { draftOrder, loading: cartLoading } = useCart();
  const { user, loading: authLoading } = useAuth();

  const displayCart = draftOrder;
  const hasProducts = displayCart && displayCart.product_count > 0;

  // WYSHKIT 2026: UI Isolation Pattern
  const isTransactionalPage = [
    '/checkout',
    '/auth',
    '/orders/',
  ].some(path => pathname.startsWith(path));

  const isVisible = hasProducts && !isTransactionalPage;

  const handleOpenCart = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic(HapticPattern.ACTION);
    router.push('/checkout');
  };

  const hasPersonalization = hasAnyPersonalization((displayCart?.products || []) as any[]);
  const productCount = displayCart?.product_count || 0;
  const displayTotal = displayCart?.total || 0;
  const isLoading = cartLoading || authLoading;

  const [shouldPulse, setShouldPulse] = useState(false);
  const [visualCount, setVisualCount] = useState(productCount);
  const prevCount = useRef(productCount);

  useEffect(() => {
    setVisualCount(productCount);
    if (productCount > prevCount.current) {
      setShouldPulse(true);
      triggerHaptic(HapticPattern.ACTION);
      const timer = setTimeout(() => setShouldPulse(false), 300);
      prevCount.current = productCount;
      return () => clearTimeout(timer);
    }
    prevCount.current = productCount;
  }, [productCount]);

  return (
    <div
      role="region"
      aria-label="Floating cart summary"
      data-testid="floating-cart-bar"
      className={cn(
        !isStacked && [
          "fixed z-[var(--z-floating)]",
          "left-0 right-0 mx-auto w-max bottom-[var(--floating-cart-bottom)]"
        ],
        "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"
      )}
    >
      <button
        onClick={handleOpenCart}
        type="button"
        aria-label={`View cart: ${visualCount} items, ${formatCurrency(displayTotal)}`}
        className={cn(
          "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] backdrop-blur-3xl rounded-full shadow-[var(--shadow-xl)] border border-white/10 overflow-hidden",
          "transition-all duration-300 cursor-pointer active:scale-[0.98] text-left",
          shouldPulse && "scale-[1.05] brightness-110",
          isLoading && "opacity-70 pointer-events-none"
        )}
      >
        <div className="flex items-center px-2 py-0.5 h-[34px] gap-2.5"> {/* Super tight height */}

          {/* Badge Icon - Refined circle */}
          <div className="relative flex items-center justify-center size-7 bg-white/15 rounded-full shrink-0">
            <ShoppingBag className="size-3.5 text-white" />
            <div className="absolute -top-0.5 -right-0.5 min-w-[12px] h-[12px] px-1 rounded-full bg-white flex items-center justify-center shadow-xs">
              <span className="text-[7.5px] font-black text-[var(--primary)] tabular-nums leading-none">{visualCount}</span>
            </div>
          </div>

          {/* Pricing & Metadata - High Density */}
          <div className="flex flex-col justify-center gap-0 pr-1">
            <AppText variant="body-sm" weight="bold" className="text-white leading-none">
              {formatCurrency(displayTotal)}
            </AppText>
            {hasPersonalization ? (
              <div className="flex items-center gap-0.5 mt-[1px]">
                <Sparkles className="size-2 text-[var(--warning)]" />
                <span className="text-[8px] font-black text-white/70 uppercase tracking-widest">Custom</span>
              </div>
            ) : (
              <span className="text-[8px] font-black text-white/50 uppercase tracking-widest mt-[1px]">View Bag</span>
            )}
          </div>

          {/* Unified Arrow */}
          <div className="flex items-center justify-center size-5 bg-white/10 rounded-full text-white shrink-0">
            <ChevronRight className="size-3 stroke-[3]" />
          </div>

        </div>
      </button>
    </div>
  );
}
