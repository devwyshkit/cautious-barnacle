'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, Timer, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActiveOrder {
    id: string;
    order_number: string;
    status: string;
    created_at: string;
    latest_status_title?: string;
    vendor_name?: string;
    vendor_image_url?: string;
}

interface ActiveOrdersBannerProps {
    orders: ActiveOrder[];
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
    'PENDING': { label: 'Awaiting Confirmation', color: 'text-[var(--well-warning-text)] bg-[var(--well-warning)]', icon: Timer },
    'CONFIRMED': { label: 'Order Confirmed', color: 'text-[var(--well-info-text)] bg-[var(--well-info)]', icon: Package },
    'IN_PRODUCTION': { label: 'Being Prepared', color: 'text-[var(--well-warning-text)] bg-[var(--well-warning)]', icon: Package },
    'PACKED': { label: 'Ready for Pickup', color: 'text-[var(--well-success-text)] bg-[var(--well-success)]', icon: Package },
    'OUT_FOR_DELIVERY': { label: 'On the Way', color: 'text-[var(--well-info-text)] bg-[var(--well-info)]', icon: Navigation },
};

/**
 * WYSHKIT 2026: Active Orders Banner (Zeigarnik Effect)
 * Highly prominent banner to close the open loop of an active order.
 */
export function ActiveOrdersBanner({ orders }: ActiveOrdersBannerProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted || !orders || orders.length === 0) return null;

    const order = orders[0]; // Show most recent active order prominently
    const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'text-[var(--text-secondary)] bg-[var(--surface-muted)]', icon: Package };
    const displayLabel = order.latest_status_title || statusInfo.label;
    const StatusIcon = statusInfo.icon;

    return (
        <div className="mx-4 md:mx-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <button
                onClick={() => router.push(`/orders/${order.id}`)}
                className="w-full bg-[var(--foreground)] rounded-[var(--radius-3xl)] p-1 shadow-xl shadow-[var(--shadow-sm)] group relative overflow-hidden active:scale-[0.99] transition-all"
            >
                <div className="bg-[var(--surface-muted)]/10 absolute inset-0 pointer-events-none" />

                <div className="flex items-center gap-4 p-4">
                    <div className={cn("size-14 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0 shadow-inner", statusInfo.color)}>
                        <StatusIcon className="size-7" />
                    </div>

                    <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Active Order #{order.order_number}</span>
                            <div className="h-1 w-1 rounded-full bg-[var(--success)] animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tighter leading-tight mt-0.5">
                            {displayLabel}
                        </h3>
                    </div>

                    <div className="size-10 rounded-full bg-[var(--surface-muted)]/20 flex items-center justify-center text-white group-hover:bg-[var(--surface-muted)]/40 transition-colors">
                        <ChevronRight className="size-5" />
                    </div>
                </div>

                {/* Progress Bar (Simulated) */}
                <div className="h-1 bg-[var(--surface-muted)]/20 w-full overflow-hidden">
                    <div className="h-full bg-[var(--primary)] w-1/2 animate-progress-glow" />
                </div>
            </button>

            {orders.length > 1 && (
                <p className="text-center mt-3 text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                    +{orders.length - 1} more order in progress
                </p>
            )}
        </div>
    );
}
