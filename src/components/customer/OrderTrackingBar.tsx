'use client';

import { Package, Sparkles, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useActiveOrders, type ActiveOrder } from '@/hooks/useActiveOrders';
import { useCart } from '@/components/customer/CartProvider';
import { ORDER_STATUS, getStatusConfig } from '@/lib/types/order-status';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { useEffect } from 'react';

export function OrderTrackingBar() {
    const { activeOrders, loading } = useActiveOrders();
    const router = useRouter();
    const pathname = usePathname();

    // WYSHKIT 2026: Show all active orders, but highlight those needing action
    const needsAttention = activeOrders.filter(o =>
        (o.status === ORDER_STATUS.PLACED && o.has_personalization) ||
        o.status === ORDER_STATUS.PREVIEW_READY
    );

    // Prioritize "Needs Attention" orders, otherwise show most recent active order
    const orderToShow = needsAttention.length > 0 ? needsAttention[0] : activeOrders[0];

    // Don't show on checkout to avoid clutter. 
    // Show even on other order pages (Swiggy 2026: multi-order support), 
    // unless it's the IDENTICAL order being viewed.
    const isExcludedPage = pathname === '/checkout' || (orderToShow && pathname === `/orders/${orderToShow.id}`);

    const { draftOrder } = useCart();

    const isVisible = !loading && orderToShow && !isExcludedPage;

    useEffect(() => {
        const root = document.documentElement;
        if (isVisible) {
            root.style.setProperty('--tracking-bar-height', '64px');
        } else {
            root.style.setProperty('--tracking-bar-height', '0px');
        }
    }, [isVisible]);

    if (!isVisible) return null;

    const handleTrack = () => {
        triggerHaptic(HapticPattern.ACTION);
        const targetPath = `/orders/${orderToShow.id}`;
        if (pathname === targetPath) {
            // Already there, just a heartbeat
            return;
        }
        router.push(targetPath);
    };

    const config = getStatusConfig(orderToShow);
    const isUrgent = needsAttention.length > 0;

    return (
        <div
            className="fixed left-0 right-0 z-40 flex justify-center pointer-events-none px-4 animate-in slide-in-from-bottom-8 fade-in duration-500 ease-out"
            style={{ bottom: `calc(var(--bottom-nav-height, 0px) + 12px)` }}
        >
            <button
                onClick={handleTrack}
                className={cn(
                    "pointer-events-auto min-w-[280px] max-w-[340px] transition-all duration-500 ease-out",
                    "rounded-2xl shadow-xl overflow-hidden flex items-center p-1 gap-3 active:scale-[0.97]",
                    isUrgent
                        ? "bg-[var(--primary)] ring-2 ring-rose-500/10 shadow-rose-900/30"
                        : "bg-zinc-950/98 backdrop-blur-xl shadow-zinc-950/40 border border-white/5"
                )}
            >
                {/* Status Icon with Heartbeat */}
                <div className={cn(
                    "size-10 rounded-xl flex items-center justify-center relative shrink-0",
                    isUrgent ? "bg-white" : config.color
                )}>
                    {isUrgent && (
                        <div className="absolute inset-0 rounded-xl bg-rose-500/20 animate-ping" />
                    )}
                    <div className={cn(
                        "relative z-10 scale-90",
                        isUrgent ? "text-[var(--primary)]" : ""
                    )}>
                        {isUrgent ? <AlertCircle className="size-5" /> : config.icon}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-left min-w-0">
                    <h4 className={cn(
                        "text-[13px] font-bold truncate leading-tight",
                        isUrgent ? "text-white" : "text-white"
                    )}>
                        {isUrgent ? "Add details" : (orderToShow.partner_name || config.label)}
                    </h4>
                    <p className={cn(
                        "text-[9px] truncate font-medium mt-0.5 opacity-80",
                        isUrgent ? "text-rose-100" : "text-zinc-400"
                    )}>
                        {isUrgent ? config.label : config.subLabel}
                    </p>
                </div>

                {/* Tracking Pill / Action Pill */}
                <div className={cn(
                    "mr-2 px-3 py-1.5 rounded-xl flex items-center gap-1 backdrop-blur-md transition-colors",
                    isUrgent ? "bg-white text-[#D91B24]" : "bg-zinc-900 text-white"
                )}>
                    <span className="text-[9px] font-bold tracking-tight">
                        {isUrgent ? "Fix" : "Track"}
                    </span>
                    {!isUrgent && <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />}
                    {isUrgent && <ChevronRight className="size-2.5" />}
                </div>
            </button>
        </div>
    );
}
