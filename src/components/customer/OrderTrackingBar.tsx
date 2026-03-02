'use client';

import { useState } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useActiveOrders } from '@/hooks/useActiveOrders';
import { useCart } from '@/components/customer/CartProvider';
import { ORDER_STATUS, PERSONALIZATION_STATUS, getStatusConfig } from '@/lib/types/order-status';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

export function OrderTrackingBar({ initialOrders = [] }: { initialOrders?: any[] }) {
    const { activeOrders, loading } = useActiveOrders(initialOrders);
    const { draftOrder } = useCart();
    const pathname = usePathname();
    const router = useRouter();

    const hasCartProducts = draftOrder && draftOrder.product_count > 0;
    const isCartVisible = hasCartProducts;

    // WYSHKIT 2026: Show all active orders, but highlight those needing action
    const needsAttention = activeOrders.filter(o =>
        (o.status === ORDER_STATUS.PLACED && o.has_personalization) ||
        o.personalization_status === PERSONALIZATION_STATUS.PREVIEW_READY
    );

    // Prioritize "Needs Attention" orders, otherwise show most recent active order
    const orderToShow = needsAttention.length > 0 ? needsAttention[0] : activeOrders[0];

    // Don't show on checkout to avoid clutter. 
    // WYSHKIT 2026 Pattern: Even if we are on the order page, the bar can remain if there's ANOTHER order needing attention.
    const isExcludedPage = orderToShow && pathname === `/orders/${orderToShow.id}`;

    const isVisible = !loading && orderToShow && !isExcludedPage;

    if (!isVisible) return null;

    const handleOpen = () => {
        triggerHaptic(HapticPattern.ACTION);
        router.push(`/orders/${orderToShow.id}`);
    };

    const config = getStatusConfig(orderToShow);
    const isUrgent = needsAttention.length > 0;

    return (
        <>
            <div
                className={cn(
                    "fixed z-[var(--z-overlay)] transition-all duration-300 ease-out",
                    "left-4 right-4 md:left-auto md:w-[420px] md:right-8 lg:right-12",
                    isCartVisible
                        ? "bottom-[calc(var(--bottom-nav-height,64px)+80px)] pb-safe md:bottom-[104px] md:pb-0"
                        : "bottom-[calc(var(--bottom-nav-height,64px)+16px)] pb-safe md:bottom-8 md:pb-0",
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"
                )}
            >
                <div
                    onClick={handleOpen}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
                    className={cn(
                        "w-full transition-all duration-300 ease-out cursor-pointer active:scale-[0.98]",
                        "rounded-xl shadow-[var(--shadow-sm)] border overflow-hidden flex items-center p-3 gap-3 min-h-[56px]",
                        isUrgent
                            ? "bg-[var(--well-destructive)] border-[var(--destructive)]/20"
                            : "bg-[var(--foreground)]/95 backdrop-blur-3xl border-[var(--border)]/10"
                    )}
                >
                    {/* Status Icon with Heartbeat */}
                    <div className={cn(
                        "size-8 rounded-full flex items-center justify-center relative shrink-0",
                        isUrgent ? "bg-[var(--destructive)]/10" : "bg-[var(--surface-muted)]/20"
                    )}>
                        {isUrgent && (
                            <div className="absolute inset-0 rounded-full bg-[var(--destructive)]/20 animate-ping" />
                        )}
                        <div className={cn(
                            "relative z-10 scale-75 origin-center",
                            isUrgent ? "text-[var(--destructive)]" : "text-white"
                        )}>
                            {isUrgent ? <AlertCircle className="size-6" /> : config.icon}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left min-w-0 pr-2">
                        <h4 className={cn(
                            "text-sm font-bold truncate leading-none",
                            isUrgent ? "text-[var(--text-primary)]" : "text-white"
                        )}>
                            {isUrgent ? "Complete Auth Now" : (orderToShow.vendor_name || config.label)}
                        </h4>
                        <p className={cn(
                            "text-xs truncate font-medium mt-1 leading-none",
                            isUrgent ? "text-[var(--destructive)]" : "text-[var(--text-tertiary)]"
                        )}>
                            {isUrgent ? config.label : config.subLabel}
                        </p>
                    </div>

                    {/* Tracking Pill / Action Pill */}
                    <div className={cn(
                        "shrink-0 px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md transition-colors",
                        isUrgent ? "bg-[var(--destructive)] text-white" : "bg-[var(--surface-muted)]/20 text-white"
                    )}>
                        <span className="text-xs font-bold leading-none">
                            {isUrgent ? "Action required" : "Live"}
                        </span>
                        {!isUrgent && <div className="size-1.5 rounded-full bg-[var(--success)] animate-pulse ml-0.5" />}
                        {isUrgent && <ChevronRight className="size-3" />}
                    </div>
                </div>
            </div>
        </>
    );
}
