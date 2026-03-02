'use client';

import { useRef, useEffect, useState } from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/components/customer/CartProvider';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { formatCurrency } from '@/lib/utils/pricing';
import { Button } from '@/components/ui/button';

export function HeaderCart() {
    const router = useRouter();
    const pathname = usePathname();
    const { draftOrder, loading } = useCart();

    // WYSHKIT 2026: Single source of truth
    const displayCart = draftOrder;
    const hasProducts = displayCart && displayCart.product_count > 0;
    const isCheckoutOpen = pathname.startsWith('/checkout');

    const productCount = displayCart?.product_count || 0;
    const displayTotal = displayCart?.total || 0;

    const [visualCount, setVisualCount] = useState(productCount);
    const [shouldBounce, setShouldBounce] = useState(false);
    const prevCount = useRef(productCount);

    // WYSHKIT 2026: Animation Sync Logic
    useEffect(() => {
        if (productCount > prevCount.current) {
            // Increment: Wait for fly animation (approx 800ms)
            const timer = setTimeout(() => {
                setVisualCount(productCount);
                setShouldBounce(true);
                triggerHaptic(HapticPattern.SUCCESS);
                setTimeout(() => setShouldBounce(false), 300);
            }, 800);
            return () => clearTimeout(timer);
        } else {
            // Decrement/Initial: Update instantly
            setVisualCount(productCount);
        }
        prevCount.current = productCount;
    }, [productCount]);

    const handleCheckout = () => {
        triggerHaptic(HapticPattern.ACTION);
        router.push('/checkout');
    };

    if (!hasProducts || isCheckoutOpen) return null;

    return (
        <div>
            <Button
                variant="ghost"
                onClick={handleCheckout}
                className={cn(
                    "h-10 px-4 rounded-[var(--radius-md)] hover:bg-[var(--surface-muted)] gap-3 font-bold text-sm text-[var(--text-primary)] active:scale-95 transition-all border border-[var(--border)]",
                    shouldBounce && "scale-105 bg-[var(--primary-muted)] border-[var(--primary-ring)]"
                )}
            >
                <div className="relative">
                    <ShoppingBag className={cn("size-5", shouldBounce ? "text-[var(--primary)]" : "text-[var(--text-primary)]")} />
                    {visualCount > 0 && (
                        <span className={cn(
                            "absolute -top-2 -right-2 size-4 rounded-full flex items-center justify-center text-xs text-[var(--text-inverse)] font-bold transition-colors",
                            shouldBounce ? "bg-[var(--primary)]" : "bg-[var(--primary)]" // Consistent brand red
                        )}>
                            {visualCount}
                        </span>
                    )}
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-xs text-[var(--text-secondary)] font-medium tracking-tight">Cart</span>
                    <span className="tabular-nums">{formatCurrency(displayTotal)}</span>
                </div>
            </Button>
        </div>
    );
}
