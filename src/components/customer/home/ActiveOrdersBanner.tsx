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
    'PENDING_PERSONALIZATION': { label: 'Details needed', color: 'text-[var(--well-destructive-text)] bg-[var(--well-destructive)] animate-pulse', icon: Timer },
    'CONFIRMED': { label: 'Order Confirmed', color: 'text-[var(--well-info-text)] bg-[var(--well-info)]', icon: Package },
    'IN_PRODUCTION': { label: 'Being Prepared', color: 'text-[var(--well-warning-text)] bg-[var(--well-warning)]', icon: Package },
    'PACKED': { label: 'Ready for Pickup', color: 'text-[var(--well-success-text)] bg-[var(--well-success)]', icon: Package },
    'RIDER_ASSIGNED': { label: 'Rider Assigned', color: 'text-[var(--well-info-text)] bg-[var(--well-info)]', icon: Navigation },
    'OUT_FOR_DELIVERY': { label: 'On the Way', color: 'text-[var(--well-info-text)] bg-[var(--well-info)]', icon: Navigation },
    'DELIVERED': { label: 'Delivered', color: 'text-[var(--well-success-text)] bg-[var(--well-success)]', icon: Package },
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
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-3 shadow-[var(--shadow-xs)] group relative overflow-hidden active:scale-[0.98] transition-all"
            >
                <div className="flex items-center gap-2.5">
                    <div className={cn("size-8 rounded-full flex items-center justify-center shrink-0 border border-[var(--border)]/40", statusInfo.color)}>
                        <StatusIcon className="size-4" />
                    </div>

                    <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-tight whitespace-nowrap">#{order.order_number}</span>
                            <div className="h-1 w-1 rounded-full bg-[var(--success)] animate-pulse" />
                        </div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight truncate leading-none mt-1">
                            {displayLabel}
                        </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 text-[var(--primary)] text-[10px] font-bold uppercase tracking-tight">
                        Track Now
                        <ChevronRight className="size-3 stroke-[3] transition-transform group-hover:translate-x-0.5" />
                    </div>
                </div>

                {/* Progress Bar (Integrated) */}
                <div className="mt-3 h-1 bg-[var(--surface-muted)] w-full rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary)] w-1/2 animate-progress-glow rounded-full" />
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
