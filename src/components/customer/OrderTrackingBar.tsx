'use client';

import { useState, useEffect } from 'react';
import { Package, Sparkles, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useActiveOrders, type ActiveOrder } from '@/hooks/useActiveOrders';
import { useCart } from '@/components/customer/CartProvider';
import { ORDER_STATUS, getStatusConfig } from '@/lib/types/order-status';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { OrderTracker } from '@/components/customer/orders/OrderTracker';
import { useSurfaceScribe } from '@/providers/SurfaceScribeProvider';

export function OrderTrackingBar() {
    const { activeOrders, loading } = useActiveOrders();
    const { draftOrder } = useCart();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isCheckoutOpen = pathname?.startsWith('/checkout');
    const hasCartItems = draftOrder && draftOrder.item_count > 0;
    const isCartVisible = hasCartItems && !isCheckoutOpen;

    // WYSHKIT 2026: Show all active orders, but highlight those needing action
    const needsAttention = activeOrders.filter(o =>
        (o.status === ORDER_STATUS.PLACED && o.has_personalization) ||
        o.status === ORDER_STATUS.PREVIEW_READY
    );

    // Prioritize "Needs Attention" orders, otherwise show most recent active order
    const orderToShow = needsAttention.length > 0 ? needsAttention[0] : activeOrders[0];

    // Don't show on checkout to avoid clutter. 
    // Swiggy 2026 Pattern: Even if we are on the order page, the bar can remain if there's ANOTHER order needing attention.
    const isExcludedPage = pathname === '/checkout' || (orderToShow && pathname === `/orders/${orderToShow.id}`);

    const isVisible = !loading && orderToShow && !isExcludedPage;

    const { setTrackingBarHeight } = useSurfaceScribe();

    useEffect(() => {
        if (isVisible) {
            setTrackingBarHeight(72);
        } else {
            setTrackingBarHeight(0);
        }
    }, [isVisible, setTrackingBarHeight]);

    if (!isVisible) return null;

    const handleOpen = () => {
        triggerHaptic(HapticPattern.ACTION);
        setIsOpen(true);
    };

    const config = getStatusConfig(orderToShow);
    const isUrgent = needsAttention.length > 0;

    return (
        <>
            <div
                className="fixed left-0 right-0 z-40 flex justify-center pointer-events-none px-4 animate-in slide-in-from-bottom-8 fade-in duration-500 ease-out transition-all"
                style={{ bottom: `calc(var(--bottom-nav-height, 0px) + ${isCartVisible ? '136px' : '12px'})` }}
            >
                <button
                    onClick={handleOpen}
                    className={cn(
                        "pointer-events-auto min-w-[320px] max-w-sm transition-all duration-500 ease-out",
                        "rounded-[2.5rem] shadow-sm overflow-hidden flex items-center p-1.5 gap-4 active:scale-[0.96]",
                        isUrgent
                            ? "bg-[var(--primary)] ring-4 ring-rose-500/20 shadow-rose-900/40"
                            : "bg-zinc-950/95 backdrop-blur-2xl shadow-zinc-950/60 border border-white/5"
                    )}
                >
                    {/* Status Icon with Heartbeat */}
                    <div className={cn(
                        "size-12 rounded-full flex items-center justify-center relative",
                        isUrgent ? "bg-white" : config.color
                    )}>
                        {isUrgent && (
                            <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping" />
                        )}
                        <div className={cn(
                            "relative z-10",
                            isUrgent ? "text-[var(--primary)]" : ""
                        )}>
                            {isUrgent ? <AlertCircle className="size-6" /> : config.icon}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left min-w-0 py-2">
                        <h4 className={cn(
                            "text-[14px] font-black truncate leading-tight tracking-tight",
                            isUrgent ? "text-white" : "text-white"
                        )}>
                            {isUrgent ? "Add Identity Now" : (orderToShow.partner_name || config.label)}
                        </h4>
                        <p className={cn(
                            "text-xs truncate font-bold tracking-wider mt-0.5 opacity-80",
                            isUrgent ? "text-rose-100" : "text-zinc-400"
                        )}>
                            {isUrgent ? config.label : config.subLabel}
                        </p>
                    </div>

                    {/* Tracking Pill / Action Pill */}
                    <div className={cn(
                        "mr-3 px-4 py-2 rounded-full flex items-center gap-1.5 backdrop-blur-md transition-colors",
                        isUrgent ? "bg-white text-[#D91B24]" : "bg-zinc-800/50 text-white border border-white/10"
                    )}>
                        <span className="text-xs font-black tracking-wider">
                            {isUrgent ? "Go" : "Live"}
                        </span>
                        {!isUrgent && <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        {isUrgent && <ChevronRight className="size-3" />}
                    </div>
                </button>
            </div>

            <ResponsiveSurface
                open={isOpen}
                onOpenChange={setIsOpen}
                title="Order Tracking"
                description={`Tracking your ${orderToShow.partner_name || 'order'}...`}
                className="p-0 sm:max-w-md"
            >
                <div className="h-[80vh] overflow-y-auto">
                    <OrderTracker orderId={orderToShow.id} isSheet />
                </div>
            </ResponsiveSurface>
        </>
    );
}
