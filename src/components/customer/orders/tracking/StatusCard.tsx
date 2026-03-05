'use client';

import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Timer, Share2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { generateTaxInvoicePDF } from '@/lib/services/pdf-service';
import { HyperlocalTimer } from '@/components/ui/HyperlocalTimer';
import { toast } from 'sonner';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';


import { OrderDetail, OrderProductDetail } from '@/lib/types/order';
import { formatArrivalTime } from '@/lib/utils/sla';

interface StatusCardProps {
    order: OrderDetail;
    orderProducts: OrderProductDetail[];
    isConnected?: boolean;
    className?: string;
}

export function StatusCard({ order, orderProducts, isConnected = true, className }: StatusCardProps) {
    // WYSHKIT 2026: The "Live Pulse" SLA Logic
    const [deadline, setDeadline] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!order || order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.CANCELLED) {
            setDeadline(null);
            return;
        }

        // If it has a specific deadline from DB, use it
        if (order.promised_delivery_at) {
            setDeadline(order.promised_delivery_at);
            return;
        }

        // Fallback to createdAt based SLA: use vendor_prep_mins if available
        const createdAt = new Date(order.created_at || Date.now()).getTime();
        const prepMins = order.vendor_prep_mins || (order.has_personalization ? 120 : 30);
        setDeadline(new Date(createdAt + prepMins * 60000).toISOString());
    }, [order?.status, order?.created_at, order?.has_personalization, order?.promised_delivery_at, order?.vendor_prep_mins]);

    const handleShare = async () => {
        if (!navigator.share) {
            // Copy to clipboard fallback
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Tracking link copied!");
                triggerHaptic(HapticPattern.SUCCESS);
            } catch (err) {
                toast.error("Failed to copy link");
            }
            return;
        }

        try {
            await navigator.share({
                title: `Track my Wyshkit Order #${order.order_number}`,
                text: `Check out the live progress of my gift!`,
                url: window.location.href,
            });
            triggerHaptic(HapticPattern.SUCCESS);
        } catch (err) {
            // User cancelled
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case ORDER_STATUS.PLACED: return <Clock className="size-5" />;
            case ORDER_STATUS.DELIVERED: return <CheckCircle2 className="size-5" />;
            default: return <Clock className="size-5" />;
        }
    };

    function getStatusText(status: string) {
        const map: Record<string, string> = {
            [ORDER_STATUS.PLACED]: 'Order placed',
            [ORDER_STATUS.CONFIRMED]: 'Vendor accepted',
            [ORDER_STATUS.IN_PRODUCTION]: 'Crafting now',
            [ORDER_STATUS.PACKED]: 'Ready to fly',
            [ORDER_STATUS.OUT_FOR_DELIVERY]: 'On the way',
            [ORDER_STATUS.DELIVERED]: 'Delivered',
        };
        return map[status] || status.replace(/_/g, ' ').toLowerCase();
    }

    function getNextStep(status: string, hasPersonalization: boolean = false) {
        switch (status) {
            case ORDER_STATUS.PLACED:
                return hasPersonalization ? 'Waiting for your design details' : 'Waiting for vendor to accept';
            case ORDER_STATUS.CONFIRMED:
                return hasPersonalization ? 'Add preferences to start crafting' : 'Vendor is securing your products';
            case ORDER_STATUS.IN_PRODUCTION: return 'Your gift is being masterfully prepared';
            case ORDER_STATUS.PACKED: return 'Waiting for delivery executive';
            case ORDER_STATUS.OUT_FOR_DELIVERY: return 'Delivery agent is navigating to your address';
            case ORDER_STATUS.DELIVERED: return 'Gift successfully delivered';
            default: return 'Processing your order';
        }
    }

    const [isRefunding, setIsRefunding] = React.useState(false);
    const [confirmRefund, setConfirmRefund] = React.useState(false);

    const handleInstantRefund = async () => {
        // WYSHKIT 2026: window.confirm() is FORBIDDEN (DOCTRINE.md Anti-Dark-Pattern §)
        // Use inline double-confirm state instead — same pattern as PreviewApproval rejection.
        if (!confirmRefund) {
            setConfirmRefund(true);
            return;
        }

        setIsRefunding(true);
        setConfirmRefund(false);
        triggerHaptic(HapticPattern.ACTION);

        try {
            const { update_order_status } = await import('@/lib/actions/commerce/orders');
            const result = await update_order_status(order.id!, 'CANCELLED', {
                reason: 'SLA_BREACH_CUSTOMER_REFUND',
                cancelled_by: 'customer'
            });

            if (result.success) {
                toast.success("Order cancelled. Full refund initiated.");
                triggerHaptic(HapticPattern.SUCCESS);
            } else {
                toast.error(result.error || "Failed to process refund");
                triggerHaptic(HapticPattern.ERROR);
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsRefunding(false);
        }
    };

    const isBreached = React.useMemo(() => {
        if (!deadline || order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.CANCELLED) return false;
        return new Date() > new Date(deadline);
    }, [deadline, order.status]);

    return (
        <section className={cn(
            "rounded-[var(--radius-xl)] border p-6 shadow-[var(--shadow-sm)] overflow-hidden relative transition-all duration-500",
            isBreached ? "bg-[var(--well-destructive)] border-[var(--destructive)]/20 shadow-[var(--shadow-glow-destructive)]" : "bg-[var(--surface)] border-[var(--border)]",
            className
        )}>
            {/* WYSHKIT 2026: Live Pulse Header */}
            {deadline && (
                <div className={cn(
                    "absolute top-0 right-0 px-4 py-2 flex items-center gap-2 rounded-bl-[var(--radius-xl)]",
                    isBreached ? "bg-[var(--destructive)]" : "bg-[var(--foreground)]"
                )}>
                    {isConnected === false && (
                        <div className="flex items-center gap-1.5 mr-1 pr-2 border-r border-white/20 animate-pulse">
                            <RefreshCw className="size-2.5 text-white/70 animate-spin" />
                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Reconnecting</span>
                        </div>
                    )}
                    <div className="relative flex size-2 items-center justify-center">
                        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", isBreached ? "bg-[var(--surface)]" : "bg-[var(--success)]/70")}></span>
                        <span className={cn("relative inline-flex size-1.5 rounded-full shadow-[0_0_8px_rgba(var(--success-rgb),0.5)]", isBreached ? "bg-[var(--surface)]" : "bg-[var(--success)]")}></span>
                    </div>
                    <span className="text-xs font-bold text-[var(--text-inverse)] tracking-tight">
                        {isBreached ? 'SLA Breach' : 'Live Pulse'}
                    </span>
                </div>
            )}

            <div className="flex items-start gap-4">
                <div className={cn(
                    "size-14 rounded-[var(--radius-xl)] flex items-center justify-center shrink-0 relative transition-all duration-500",
                    isBreached ? "bg-[var(--well-destructive)] text-[var(--destructive)]" : (
                        (order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.PACKED) ? "bg-[var(--well-success)] text-[var(--success)]" : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
                    ),
                )}>
                    {isBreached ? <AlertCircle className="size-6 animate-bounce" /> : getStatusIcon(order.status || '')}
                    {deadline && (
                        <div className="absolute -bottom-1 -right-1 size-5 bg-[var(--surface)] rounded-full flex items-center justify-center shadow-sm border border-[var(--border)]">
                            <Timer className={cn("size-3", isBreached ? "text-rose-600" : "text-[var(--text-primary)] animate-pulse")} />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className={cn(
                            "text-lg font-bold tracking-tight leading-tight",
                            isBreached ? "text-[var(--destructive)]" : "text-[var(--text-primary)]"
                        )}>
                            {isBreached ? 'Vendor is Running Late' : getStatusText(order.status || '')}
                        </h2>
                        {(() => {
                            const pendingCount = orderProducts.filter((product) => {
                                if (!product.is_personalized) return false;
                                const s = (product.status || 'PENDING_PERSONALIZATION').toUpperCase();
                                const blocked = ['SUBMITTED', 'DETAILS_RECEIVED', 'MOCKUP_READY', 'MOCKUP_APPROVED', 'IN_PRODUCTION', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
                                return !blocked.includes(s) && !product.personalization_details;
                            }).length;

                            if (order.status === ORDER_STATUS.PLACED && pendingCount > 0) {
                                return (
                                    <span className="text-xs font-bold bg-[var(--primary)] text-[var(--text-inverse)] px-2 py-0.5 rounded-full animate-pulse tracking-tight whitespace-nowrap">
                                        Action Req: {pendingCount} {pendingCount === 1 ? 'Product' : 'Products'}
                                    </span>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    {order.status === ORDER_STATUS.CANCELLED && order.cancellation_reason ? (
                        <div className="mt-2 p-3 bg-[var(--well-warning)] rounded-[var(--radius-md)] border border-[var(--warning)]/20 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                            <AlertCircle className="size-3.5 text-[var(--warning)] shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-[var(--text-primary)]/80 leading-relaxed italic">
                                &quot;{order.cancellation_reason}&quot;
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1.5 mt-1">
                            {isBreached ? (
                                <p className="text-xs font-bold text-[var(--destructive)] leading-tight">
                                    Our vendor missed their deadline. Our support team is intervening.
                                </p>
                            ) : (
                                <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">{getNextStep(order.status || '', !!order.has_personalization)}</p>
                            )}
                            {deadline && (
                                <div className="flex flex-col gap-1">
                                    <p className={cn("text-xs font-bold tracking-tight", isBreached ? "text-rose-600" : "text-[var(--text-primary)]")}>
                                        {formatArrivalTime(deadline)}
                                    </p>
                                    <HyperlocalTimer
                                        deadline={deadline}
                                        variant="minimal"
                                        className={cn("text-xs font-bold", isBreached ? "text-[var(--destructive)]/80" : "text-[var(--text-secondary)]")}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isBreached && (
                <div className="mt-4 p-4 bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--destructive)]/10 shadow-[var(--shadow-sm)] animate-in slide-in-from-bottom-2 duration-500">
                    <p className="text-xs font-bold text-[var(--destructive)] tracking-tight mb-3">Escalation Options</p>
                    {confirmRefund ? (
                        // WYSHKIT 2026: Inline double-confirm. No window.confirm(). No confirmshaming.
                        <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                            <p className="text-xs font-bold text-[var(--text-primary)] text-center">
                                Full refund to wallet. This cannot be undone.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfirmRefund(false)}
                                    className="flex-1 py-3 bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-secondary)] rounded-[var(--radius-xl)] text-xs font-bold tracking-tight active:scale-95 transition-all"
                                >
                                    Keep waiting
                                </button>
                                <button
                                    onClick={handleInstantRefund}
                                    disabled={isRefunding}
                                    className="flex-1 py-3 bg-[var(--destructive)] text-[var(--text-inverse)] rounded-[var(--radius-xl)] text-xs font-bold tracking-tight active:scale-95 transition-all shadow-[var(--shadow-glow-destructive)] disabled:opacity-50"
                                >
                                    {isRefunding ? 'Refunding...' : 'Yes, cancel & refund'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => window.location.href = `tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE}`}
                                className="flex-1 py-3 bg-[var(--destructive)] text-[var(--text-inverse)] rounded-[var(--radius-xl)] text-xs font-bold tracking-tight active:scale-95 transition-all shadow-[var(--shadow-glow-destructive)]"
                            >
                                Priority Call
                            </button>
                            <button
                                onClick={handleInstantRefund}
                                disabled={isRefunding}
                                className="flex-1 py-3 bg-[var(--surface-muted)] border border-[var(--destructive)]/10 text-[var(--destructive)] rounded-[var(--radius-xl)] text-xs font-bold tracking-tight active:scale-95 transition-all shadow-[var(--shadow-md)] disabled:opacity-50"
                            >
                                Instant Refund
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 flex gap-1.5">
                {[0, 1, 2, 3].map((i) => {
                    const stepStatuses: Record<string, number> = {
                        [ORDER_STATUS.PLACED]: 0,
                        [ORDER_STATUS.CONFIRMED]: 0,
                        [ORDER_STATUS.IN_PRODUCTION]: 1,
                        [ORDER_STATUS.PACKED]: 2,
                        [ORDER_STATUS.OUT_FOR_DELIVERY]: 3,
                        [ORDER_STATUS.DELIVERED]: 4,
                    };
                    const currentStep = stepStatuses[order.status || ''] ?? 0;
                    const isActive = i < currentStep;
                    const isCurrent = i === currentStep;

                    return (
                        <div key={i} className="flex-1 h-1 rounded-full bg-[var(--surface-muted)] relative overflow-hidden">
                            {(isActive || isCurrent) && (
                                <div className={cn(
                                    "absolute inset-0 bg-[var(--text-primary)] transition-all duration-1000",
                                    isCurrent && "animate-pulse shadow-[0_0_12px_rgba(0,0,0,0.2)]"
                                )} />
                            )}
                        </div>
                    );
                })}
            </div>

            {!isBreached && (
                <div className="mt-6 pt-5 border-t border-[var(--surface-muted)]">
                    <button
                        onClick={handleShare}
                        className="w-full h-12 bg-[var(--text-primary)] text-[var(--text-inverse)] rounded-[var(--radius-xl)] flex items-center justify-center gap-2 text-xs font-bold tracking-tight active:scale-[0.98] transition-all shadow-lg shadow-[var(--shadow-sm)]"
                    >
                        <Share2 className="size-4" />
                        Share tracking with someone
                    </button>
                </div>
            )}
        </section>
    );
}
