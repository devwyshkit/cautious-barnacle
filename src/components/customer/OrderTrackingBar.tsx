'use client';

import { useState } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useActiveOrders } from '@/hooks/useActiveOrders';
import { useCart } from '@/components/customer/CartProvider';
import { ORDER_STATUS, PERSONALIZATION_STATUS, getStatusConfig } from '@/lib/types/order-status';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

export function OrderTrackingBar() {
    const { activeOrders, loading } = useActiveOrders();
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
    // Swiggy 2026 Pattern: Even if we are on the order page, the bar can remain if there's ANOTHER order needing attention.
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
                    "fixed left-4 right-4 md:left-auto md:w-[420px] md:right-8 z-[45] transition-all duration-300 ease-out",
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"
                )}
                style={{
                    bottom: `calc(var(--bottom-nav-height, 64px) + env(safe-area-inset-bottom, 0px) + ${isCartVisible ? '80px' : '16px'})`
                }}
            >
                <div
                    onClick={handleOpen}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
                    className={cn(
                        "w-full transition-all duration-300 ease-out cursor-pointer active:scale-[0.98]",
                        "rounded-xl shadow-sm border overflow-hidden flex items-center p-3 gap-3 min-h-[56px]",
                        isUrgent
                            ? "bg-rose-50 border-rose-200"
                            : "bg-zinc-950/95 backdrop-blur-3xl border-white/10"
                    )}
                >
                    {/* Status Icon with Heartbeat */}
                    <div className={cn(
                        "size-8 rounded-full flex items-center justify-center relative shrink-0",
                        isUrgent ? "bg-rose-100" : "bg-white/10"
                    )}>
                        {isUrgent && (
                            <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
                        )}
                        <div className={cn(
                            "relative z-10 scale-75 origin-center",
                            isUrgent ? "text-rose-600" : "text-white"
                        )}>
                            {isUrgent ? <AlertCircle className="size-6" /> : config.icon}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left min-w-0 pr-2">
                        <h4 className={cn(
                            "text-sm font-black truncate leading-none",
                            isUrgent ? "text-rose-950" : "text-white"
                        )}>
                            {isUrgent ? "Complete Auth Now" : (orderToShow.vendor_name || config.label)}
                        </h4>
                        <p className={cn(
                            "text-xs truncate font-medium mt-1 leading-none",
                            isUrgent ? "text-rose-700" : "text-zinc-400"
                        )}>
                            {isUrgent ? config.label : config.subLabel}
                        </p>
                    </div>

                    {/* Tracking Pill / Action Pill */}
                    <div className={cn(
                        "shrink-0 px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md transition-colors",
                        isUrgent ? "bg-rose-600 text-white" : "bg-white/10 text-white"
                    )}>
                        <span className="text-xs font-bold leading-none">
                            {isUrgent ? "Action required" : "Live"}
                        </span>
                        {!isUrgent && <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />}
                        {isUrgent && <ChevronRight className="size-3" />}
                    </div>
                </div>
            </div>
        </>
    );
}
