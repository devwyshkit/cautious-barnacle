'use client';

import { useState } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useActiveOrders } from '@/hooks/useActiveOrders';
import { useCart } from '@/components/customer/CartProvider';
import { ORDER_STATUS, PERSONALIZATION_STATUS, getStatusConfig } from '@/lib/types/order-status';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

import { AppText } from '@/components/ui/Typography';

/**
 * WYSHKIT 2026: OrderTrackingBar - Spatial Pill Pattern
 * Ultra-compact, thumb-friendly, high-density pill.
 */
export function OrderTrackingBar({ initialOrders = [], isStacked = false }: { initialOrders?: any[], isStacked?: boolean }) {
    const { activeOrders, loading } = useActiveOrders(initialOrders);
    const { draftOrder } = useCart();
    const pathname = usePathname();
    const router = useRouter();

    const hasCartProducts = draftOrder && draftOrder.product_count > 0;
    const isCartVisible = hasCartProducts;

    const needsAttention = activeOrders.filter(o =>
        (o.status === ORDER_STATUS.PLACED && o.has_personalization) ||
        o.personalization_status === PERSONALIZATION_STATUS.PREVIEW_READY
    );

    const orderToShow = needsAttention.length > 0 ? needsAttention[0] : activeOrders[0];
    const isExcludedPage = orderToShow && pathname === `/orders/${orderToShow.order_number || orderToShow.id}`;
    const isVisible = !loading && orderToShow && !isExcludedPage;

    if (!isVisible) return null;

    const handleOpen = () => {
        triggerHaptic(HapticPattern.ACTION);
        router.push(`/orders/${orderToShow.order_number || orderToShow.id}`);
    };

    const config = getStatusConfig(orderToShow);
    const isUrgent = needsAttention.length > 0;

    return (
        <div
            className={cn(
                !isStacked && [
                    "fixed z-[var(--z-floating)]",
                    "left-0 right-0 mx-auto w-max",
                    isCartVisible
                        ? "bottom-[var(--floating-tracking-bottom-with-cart)]"
                        : "bottom-[var(--floating-tracking-bottom-base)]"
                ],
                "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"
            )}
        >
            <button
                onClick={handleOpen}
                type="button"
                className={cn(
                    "transition-all duration-300 ease-out cursor-pointer active:scale-[0.98] text-left appearance-none outline-none",
                    "rounded-full shadow-[var(--shadow-xl)] border flex items-center p-1 pr-1.5 gap-2.5 h-[34px]",
                    isUrgent
                        ? "bg-gradient-to-r from-[var(--destructive)] to-[var(--destructive)]/80 border-white/10 text-white"
                        : "bg-[var(--surface)] backdrop-blur-3xl border-[var(--border)]/80 shadow-[var(--shadow-md)]"
                )}
            >
                {/* Status Icon - Refined circle */}
                <div className={cn(
                    "size-7 rounded-full flex items-center justify-center relative shrink-0 overflow-hidden",
                    isUrgent ? "bg-white/20" : "bg-[var(--primary-muted)]"
                )}>
                    {isUrgent && (
                        <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse" />
                    )}
                    <div className={cn(
                        "relative z-10 scale-[0.6] origin-center",
                        isUrgent ? "text-white" : "text-[var(--primary)]"
                    )}>
                        {isUrgent ? <AlertCircle className="size-6" strokeWidth={3} /> : config.icon}
                    </div>
                </div>

                {/* Content - High Density */}
                <div className="flex flex-col justify-center min-w-[70px] pr-1">
                    <AppText variant="body-sm" weight="bold" className={cn(
                        "truncate leading-none",
                        isUrgent ? "text-white" : "text-[var(--text-primary)]"
                    )}>
                        {isUrgent ? "Action Required" : (orderToShow.vendor_name || "Tracking")}
                    </AppText>
                    <AppText variant="metadata" weight="bold" className={cn(
                        "truncate leading-none uppercase tracking-widest text-[8px] mt-[2px]",
                        isUrgent ? "text-white/80" : "text-[var(--text-tertiary)]"
                    )}>
                        {isUrgent ? "Fix Now" : config.label}
                    </AppText>
                </div>

                {/* Action Pill / Indicator */}
                <div className={cn(
                    "shrink-0 flex items-center justify-center size-5 rounded-full transition-all",
                    isUrgent
                        ? "bg-white text-[var(--destructive)]"
                        : "bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-primary)]"
                )}>
                    {isUrgent ? (
                        <ChevronRight className="size-3.5 stroke-[4]" />
                    ) : (
                        <div className="size-1.5 rounded-full bg-[var(--success)] animate-pulse shadow-[0_0_6px_var(--success)]" />
                    )}
                </div>
            </button>
        </div>
    );
}
