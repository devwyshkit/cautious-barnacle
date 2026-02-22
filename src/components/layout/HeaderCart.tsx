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
    const hasItems = displayCart && displayCart.item_count > 0;
    const isCheckoutOpen = pathname.startsWith('/checkout');

    const itemCount = displayCart?.item_count || 0;
    const displayTotal = displayCart?.total || 0;

    const [visualCount, setVisualCount] = useState(itemCount);
    const [shouldBounce, setShouldBounce] = useState(false);
    const prevCount = useRef(itemCount);

    // WYSHKIT 2026: Animation Sync Logic
    useEffect(() => {
        if (itemCount > prevCount.current) {
            // Increment: Wait for fly animation (approx 800ms)
            const timer = setTimeout(() => {
                setVisualCount(itemCount);
                setShouldBounce(true);
                triggerHaptic(HapticPattern.SUCCESS);
                setTimeout(() => setShouldBounce(false), 300);
            }, 800);
            return () => clearTimeout(timer);
        } else {
            // Decrement/Initial: Update instantly
            setVisualCount(itemCount);
        }
        prevCount.current = itemCount;
    }, [itemCount]);

    const handleCheckout = () => {
        triggerHaptic(HapticPattern.ACTION);
        router.push('/checkout');
    };

    if (!hasItems || isCheckoutOpen) return null;

    return (
        <div>
            <Button
                variant="ghost"
                onClick={handleCheckout}
                className={cn(
                    "h-10 px-4 rounded-2xl hover:bg-zinc-50 gap-3 font-bold text-[14px] text-zinc-900 active:scale-95 transition-all border border-zinc-100",
                    shouldBounce && "scale-105 bg-emerald-50 border-emerald-200"
                )}
            >
                <div className="relative">
                    <ShoppingBag className={cn("size-5", shouldBounce ? "text-emerald-600" : "text-zinc-900")} />
                    {visualCount > 0 && (
                        <span className={cn(
                            "absolute -top-2 -right-2 size-4 rounded-full flex items-center justify-center text-xs text-white font-bold transition-colors",
                            shouldBounce ? "bg-emerald-600" : "bg-red-500"
                        )}>
                            {visualCount}
                        </span>
                    )}
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-xs text-zinc-500 font-medium tracking-wider">Cart</span>
                    <span className="tabular-nums">{formatCurrency(displayTotal)}</span>
                </div>
            </Button>
        </div>
    );
}
