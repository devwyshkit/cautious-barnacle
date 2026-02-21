'use client';

import React from 'react';
import { Clock, CheckCircle2, Package, Camera, FileText, Download, AlertCircle, Timer, Sparkles, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { generateEstimatePDF, generateTaxInvoicePDF } from '@/lib/services/pdf-service';
import { HyperlocalTimer } from '@/components/ui/HyperlocalTimer';
import { toast } from 'sonner';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { PRICING } from '@/lib/constants/pricing';

import { OrderDetail } from '@/lib/types/order';

interface StatusCardProps {
    order: OrderDetail;
}

export function StatusCard({ order }: StatusCardProps) {
    // WYSHKIT 2026: The "Live Pulse" SLA Logic
    const [deadline, setDeadline] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!order || order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.CANCELLED) {
            setDeadline(null);
            return;
        }

        // If it has a specific deadline from DB, use it
        if (order.design_deadline_at) {
            setDeadline(order.design_deadline_at);
            return;
        }

        // Fallback to createdAt based SLA: use prep_hours if available from partner
        const createdAt = new Date(order.created_at || Date.now()).getTime();
        const prepMins = ((order as any).partners?.prep_hours || (order.has_personalization ? 2 : 0.5)) * 60;
        setDeadline(new Date(createdAt + prepMins * 60000).toISOString());
    }, [order?.status, order?.created_at, order?.has_personalization, order?.design_deadline_at]);

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
            case ORDER_STATUS.DETAILS_RECEIVED: return <Package className="size-5" />;
            case ORDER_STATUS.PREVIEW_READY: return <Camera className="size-5" />;
            case ORDER_STATUS.APPROVED: return <CheckCircle2 className="size-5" />;
            case ORDER_STATUS.DELIVERED: return <CheckCircle2 className="size-5" />;
            default: return <Clock className="size-5" />;
        }
    };

    function getStatusText(status: string) {
        const map: Record<string, string> = {
            [ORDER_STATUS.PLACED]: 'Order placed',
            [ORDER_STATUS.CONFIRMED]: 'Partner confirmed',
            [ORDER_STATUS.DETAILS_RECEIVED]: 'Details reviewed',
            [ORDER_STATUS.PREVIEW_READY]: 'Preview is ready',
            [ORDER_STATUS.REVISION_REQUESTED]: 'Revision in progress',
            [ORDER_STATUS.APPROVED]: 'Ready to craft',
            [ORDER_STATUS.IN_PRODUCTION]: 'Crafting now',
            [ORDER_STATUS.PACKED]: 'Ready to fly',
            [ORDER_STATUS.DISPATCHED]: 'On the way',
            [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Arriving shortly',
            [ORDER_STATUS.DELIVERED]: 'Delivered',
        };
        return map[status] || status.replace(/_/g, ' ').toLowerCase();
    }

    function getNextStep(status: string, hasPersonalization: boolean = false) {
        switch (status) {
            case ORDER_STATUS.PLACED:
                return hasPersonalization ? 'Waiting for your design details' : 'Waiting for partner to accept';
            case ORDER_STATUS.CONFIRMED:
                return hasPersonalization ? 'Share identity to start crafting' : 'Partner is securing your items';
            case ORDER_STATUS.DETAILS_RECEIVED: return 'Partner is sketching your vision';
            case ORDER_STATUS.PREVIEW_READY: return 'Review and approve your design preview';
            case ORDER_STATUS.APPROVED: return 'Partner is starting production';
            case ORDER_STATUS.IN_PRODUCTION: return 'Your gift is being masterfully prepared';
            case ORDER_STATUS.PACKED: return 'Gift is being gift-wrapped for delivery';
            case ORDER_STATUS.OUT_FOR_DELIVERY: return 'Valet is arriving at your location';
            case ORDER_STATUS.DELIVERED: return 'Gift successfully delivered';
            default: return 'Processing your order';
        }
    }

    return (
        <section className="bg-white rounded-3xl border border-zinc-100 p-6 shadow-sm overflow-hidden relative">
            {/* WYSHKIT 2026: Live Pulse Header */}
            {deadline && (
                <div className="absolute top-0 right-0 px-4 py-2 bg-zinc-950 flex items-center gap-2 rounded-bl-2xl">
                    <div className="relative flex size-2 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="absolute inline-flex h-2 w-2 animate-ping-slow rounded-full bg-emerald-400/30 opacity-40"></span>
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Pulse</span>
                </div>
            )}

            <div className="flex items-start gap-4">
                <div className={cn(
                    "size-14 rounded-2xl flex items-center justify-center shrink-0 relative transition-all duration-500",
                    order.status === ORDER_STATUS.PREVIEW_READY
                        ? "bg-rose-50 text-[var(--primary)]"
                        : order.status === ORDER_STATUS.DELIVERED ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-600",
                )}>
                    {getStatusIcon(order.status || '')}
                    {deadline && (
                        <div className="absolute -bottom-1 -right-1 size-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-zinc-100">
                            <Timer className="size-3 text-zinc-950 animate-pulse" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-zinc-900 uppercase tracking-tight leading-tight">
                            {getStatusText(order.status || '')}
                        </h2>
                        {(() => {
                            const pendingCount = (order.order_items || []).filter((item: any) => {
                                if (!item.is_personalized) return false;

                                // WYSHKIT 2026: Include all personalized items regardless of addon complexity
                                // if they don't have details submitted yet.
                                const s = (item.status || 'pending').toLowerCase();
                                const blocked = ['submitted', 'details_received', 'preview_ready', 'approved', 'in_production', 'packed', 'shipped', 'delivered', 'cancelled'];
                                return !blocked.includes(s) && !item.personalization_details;
                            }).length;

                            if (order.status === ORDER_STATUS.PLACED && pendingCount > 0) {
                                return (
                                    <span className="text-[9px] font-black bg-[var(--primary)] text-white px-2 py-0.5 rounded-full animate-pulse uppercase tracking-widest whitespace-nowrap">
                                        Action Req: {pendingCount} {pendingCount === 1 ? 'Item' : 'Items'}
                                    </span>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    {order.status === ORDER_STATUS.CANCELLED && order.cancellation_reason ? (
                        <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                            <AlertCircle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-amber-900/80 leading-relaxed italic">
                                "{order.cancellation_reason}"
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1.5 mt-1">
                            <p className="text-xs font-bold text-zinc-900 leading-tight">{getNextStep(order.status || '', !!order.has_personalization)}</p>
                            {deadline && (
                                <HyperlocalTimer
                                    deadline={deadline}
                                    variant="minimal"
                                    className="text-[11px] font-black"
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex gap-1.5">
                {[0, 1, 2, 3].map((i) => {
                    const stepStatuses: Record<string, number> = {
                        [ORDER_STATUS.PLACED]: 0,
                        [ORDER_STATUS.CONFIRMED]: 0,
                        [ORDER_STATUS.DETAILS_RECEIVED]: 1,
                        [ORDER_STATUS.PREVIEW_READY]: 1,
                        [ORDER_STATUS.REVISION_REQUESTED]: 1,
                        [ORDER_STATUS.APPROVED]: 1,
                        [ORDER_STATUS.IN_PRODUCTION]: 1,
                        [ORDER_STATUS.PACKED]: 2,
                        [ORDER_STATUS.DISPATCHED]: 3,
                        [ORDER_STATUS.OUT_FOR_DELIVERY]: 3,
                        [ORDER_STATUS.DELIVERED]: 4,
                    };
                    const currentStep = stepStatuses[order.status || ''] ?? 0;
                    const isActive = i < currentStep;
                    const isCurrent = i === currentStep;

                    return (
                        <div key={i} className="flex-1 h-1 rounded-full bg-zinc-100 relative overflow-hidden">
                            {(isActive || isCurrent) && (
                                <div className={cn(
                                    "absolute inset-0 bg-zinc-900 transition-all duration-1000",
                                    isCurrent && "animate-pulse shadow-[0_0_12px_rgba(0,0,0,0.2)]"
                                )} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* WYSHKIT 2026: B2B Documents (Estimate/Invoice) */}
            <div className="mt-6 flex flex-wrap gap-2 pt-5 border-t border-zinc-50">
                <button
                    onClick={() => {
                        const orderData = order as any;
                        generateEstimatePDF({
                            order_number: order.order_number || '',
                            date: new Date(order.created_at || Date.now()).toLocaleDateString(),
                            order_items: order.order_items,
                            customer_name: order.users?.full_name || 'Valued Customer',
                            billing_address: order.delivery_address as any,
                            gstin: order.gstin || undefined,
                            partner: {
                                name: order.partner_name || 'Partner',
                                address: 'Bangalore, India'
                            },
                            totals: {
                                item_total: Number(order.subtotal) || 0,
                                delivery_fee: Number(order.delivery_fee) || 0,
                                platform_fee: Number(order.platform_fee) || 0,
                                gst_amount: Number(order.gst) || 0,
                                grand_total: Number(order.total) || 0
                            }
                        });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-[11px] font-bold text-zinc-600 hover:bg-zinc-100 active:scale-95 transition-all"
                >
                    <FileText className="size-3.5" />
                    Estimate
                </button>
                {order.status === ORDER_STATUS.DELIVERED && (
                    <button
                        onClick={() => {
                            const orderData = order as any;
                            generateTaxInvoicePDF({
                                order_number: order.order_number || '',
                                date: new Date().toLocaleDateString(),
                                order_items: order.order_items,
                                customer_name: order.users?.full_name || 'Valued Customer',
                                billing_address: order.delivery_address as any,
                                gstin: order.gstin || undefined,
                                partner: {
                                    name: order.partner_name || 'Partner',
                                    address: 'Bangalore, India'
                                },
                                totals: {
                                    item_total: Number(order.subtotal) || 0,
                                    delivery_fee: Number(order.delivery_fee) || 0,
                                    platform_fee: Number(order.platform_fee) || PRICING.DEPRECATED_ESTIMATE_PLATFORM_FEE,
                                    gst_amount: Number(order.gst) || 0,
                                    grand_total: Number(order.total) || 0
                                }
                            });
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-[11px] font-bold text-emerald-600 hover:bg-emerald-100 active:scale-95 transition-all"
                    >
                        <Download className="size-3.5" />
                        Invoice
                    </button>
                )}
                <button
                    onClick={handleShare}
                    className="flex-1 h-11 bg-zinc-900 text-white rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-zinc-200"
                >
                    <Share2 className="size-3.5" />
                    Share Track
                </button>
            </div>
        </section>
    );
}
