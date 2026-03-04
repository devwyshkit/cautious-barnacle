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
  const router = useRouter();
  const pathname = usePathname();
  const { draftOrder, loading: cartLoading } = useCart();
  const { user, loading: authLoading } = useAuth();

  const displayCart = draftOrder;
  const hasProducts = displayCart && displayCart.product_count > 0;

  // WYSHKIT 2026: UI Isolation Pattern
  // Hide on transactional pages where primary action is already on-page.
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
      // Item was added — pulse the bar
      setShouldPulse(true);
      triggerHaptic(HapticPattern.ACTION);
      const timer = setTimeout(() => setShouldPulse(false), 300);
      prevCount.current = productCount;
      return () => clearTimeout(timer);
    }
    // Always sync ref so remove+re-add works correctly
    prevCount.current = productCount;
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
          "w-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] backdrop-blur-3xl rounded-[var(--radius-2xl)] shadow-[var(--shadow-xl)] border border-[var(--primary-hover)]/20 overflow-hidden",
          "transition-all duration-300 cursor-pointer active:scale-[0.98] text-left",
          shouldPulse && "scale-[1.02] brightness-110",
          isLoading && "opacity-70 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between px-[var(--space-5)] py-[var(--space-3-5)] min-h-[64px]">
          <div className="flex items-center gap-[var(--space-4)]">
            <div className="relative">
              <div className="size-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <ShoppingBag className="size-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 size-5 rounded-full bg-white flex items-center justify-center shadow-[var(--shadow-sm)] border-2 border-[var(--primary)]">
                <span className="text-[10px] font-black text-[var(--primary)] tabular-nums">{visualCount}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-tight leading-none">
                {visualCount} {visualCount === 1 ? 'Product' : 'Products'}
              </span>
              <div className="flex items-center gap-[var(--space-2)] mt-1">
                <span className="text-[11px] font-bold text-white/70 truncate max-w-[140px] uppercase tracking-widest">
                  {displayCart?.products?.[0]?.vendor_name || 'Local Store'}
                </span>
                {hasPersonalization && (
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/20 border border-white/10">
                    <Sparkles className="size-2 text-white" />
                    <span className="text-[9px] font-black text-white tracking-tighter leading-none uppercase">Personalized</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[var(--space-4)]">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">To Pay</span>
              <span className="text-base font-black text-white tabular-nums mt-0.5">
                {formatCurrency(displayTotal)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-full text-[var(--primary)] font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-white/90 transition-colors">
              Checkout
              <ChevronRight className="size-3.5 stroke-[4]" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
