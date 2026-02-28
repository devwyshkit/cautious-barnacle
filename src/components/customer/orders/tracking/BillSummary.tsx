'use client';

import React from 'react';
import { Download, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/pricing';
import { generateTaxInvoicePDF } from '@/lib/services/pdf-service';
import { toast } from 'sonner';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { logger } from '@/lib/logging/logger';

import { OrderDetail } from '@/lib/types/order';

interface BillSummaryProps {
    order: OrderDetail;
}

export function BillSummary({ order }: BillSummaryProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!order) return null;

    const handleDownloadInvoice = () => {
        try {
            const data = {
                order_number: order.order_number || '',
                date: new Date(order.created_at || Date.now()).toLocaleDateString(),
                order_products: order.order_products,
                vendor: {
                    name: order.vendor_name || 'WyshKit Vendor',
                    address: 'Bangalore, India', // Placeholder if address missing
                    gstin: order.gstin || undefined
                },
                customer_name: order.users?.full_name || 'Valued Customer',
                totals: {
                    item_total: order.subtotal || 0,
                    delivery_fee: order.delivery_fee || 0,
                    platform_fee: order.platform_fee || 0,
                    gst_amount: order.gst || 0,
                    grand_total: order.total || 0,
                    discount: order.total_savings || 0
                }
            };
            generateTaxInvoicePDF(data as any);
            toast.success('Invoice downloaded');
        } catch (error) {
            logger.error('Invoice generation failed', error as Error);
            toast.error('Failed to generate invoice');
        }
    };

    return (
        <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
            <button
                onClick={() => {
                    setIsExpanded(!isExpanded);
                    triggerHaptic(HapticPattern.ACTION);
                }}
                className={cn(
                    "w-full flex items-center justify-between p-5 bg-white hover:bg-zinc-50 transition-all duration-300",
                    isExpanded && "bg-zinc-50 border-b border-zinc-100"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "size-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm transition-transform duration-500",
                        isExpanded && "rotate-6 scale-110"
                    )}>
                        <FileText className="size-5 text-zinc-900" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-zinc-900">Bill Summary</p>
                        <p className="text-[11px] font-bold text-zinc-600 tabular-nums">
                            Total: {formatCurrency(order.total || 0)}
                        </p>
                    </div>
                </div>
                <div className={cn(
                    "p-2 rounded-full bg-zinc-100 transition-transform duration-500",
                    isExpanded ? "rotate-180 bg-zinc-200" : "rotate-0"
                )}>
                    <ChevronDown className="size-4 text-zinc-900" />
                </div>
            </button>

            <div className={cn(
                "grid transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="overflow-hidden">
                    <div className="p-5 space-y-3">

                        <div className="flex justify-between text-[11px] font-bold text-zinc-600">
                            <span>Product Total</span>
                            <span className="text-zinc-900">{formatCurrency(order.subtotal || 0)}</span>
                        </div>

                        {(order.delivery_fee !== undefined && order.delivery_fee !== null) && (
                            <div className="flex justify-between text-[11px] font-bold text-zinc-600">
                                <span>Delivery Fee</span>
                                <span className="text-zinc-900">
                                    {order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee || 0)}
                                </span>
                            </div>
                        )}

                        {(order.platform_fee && order.platform_fee > 0) && (
                            <div className="flex justify-between text-[11px] font-bold text-zinc-600">
                                <span>Platform Fee</span>
                                <span className="text-zinc-900">{formatCurrency(order.platform_fee || 0)}</span>
                            </div>
                        )}

                        <div className="flex justify-between text-[11px] font-black text-zinc-950">
                            <span>GST & Taxes</span>
                            <span>{formatCurrency(order.gst || 0)}</span>
                        </div>

                        {(order.total_savings && order.total_savings > 0) && (
                            <div className="flex justify-between items-center py-2 px-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                                <span className="text-xs font-black text-emerald-700 tracking-tight">WyshKit Money & Discounts</span>
                                <span className="text-sm font-black text-emerald-700">-{formatCurrency(order.total_savings)}</span>
                            </div>
                        )}

                        <div className="h-px bg-zinc-100 w-full my-2" />

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-zinc-900">Grand Total</span>
                            <span className="text-base font-black text-zinc-900">{formatCurrency(order.total || 0)}</span>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={handleDownloadInvoice}
                                variant="outline"
                                className="w-full h-10 rounded-xl gap-2 font-bold text-xs"
                            >
                                <Download className="size-3.5" />
                                Download Tax Invoice
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
