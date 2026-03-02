'use client';

import React from 'react';
import { MapPin, Package } from 'lucide-react';

import { OrderDetail } from '@/lib/types/order';

interface DeliveryInfoProps {
    order: OrderDetail;
}

export function DeliveryInfo({ order }: DeliveryInfoProps) {
    if (!order.delivery_address && !order.awb_number) return null;

    return (
        <div className="space-y-4">
            {order.awb_number && (
                <div className="surface-card p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-[var(--surface-muted)] rounded-[var(--radius-md)] flex items-center justify-center">
                            <Package className="size-5 text-[var(--text-tertiary)]" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[var(--text-secondary)] tracking-tight leading-none mb-1.5">Tracking ID</p>
                            <p className="text-sm font-bold text-[var(--text-primary)]">{order.courier_vendor || 'Shadowfax'} • {order.awb_number}</p>
                        </div>
                    </div>
                    {order.tracking_url && (
                        <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 px-5 rounded-[var(--radius-md)] bg-[var(--foreground)] text-[var(--text-inverse)] text-xs font-bold tracking-tight flex items-center justify-center active:scale-95 transition-all shadow-sm shadow-[var(--text-primary)]/10 border border-[var(--text-primary)]"
                        >
                            Track
                        </a>
                    )}
                </div>
            )}

            {order.delivery_address && (
                <div className="surface-card p-4 flex items-start gap-4">
                    <div className="size-10 bg-[var(--surface-muted)] rounded-[var(--radius-md)] flex items-center justify-center shrink-0">
                        <MapPin className="size-5 text-[var(--text-tertiary)]" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-[var(--text-secondary)] tracking-tight mb-1.5 leading-none">Delivery Address</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                            {typeof order.delivery_address === 'object'
                                ? `${(order.delivery_address as Record<string, any>).name || ''} • ${(order.delivery_address as Record<string, any>).address_line1 || (order.delivery_address as Record<string, any>).line1 || ''}`
                                : 'Address on file'}
                        </p>
                        {(order.gstin) && (
                            <div className="mt-3 flex items-center gap-2 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] border border-[var(--border)] w-fit">
                                <span className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight">GSTIN:</span>
                                <span className="text-xs font-bold text-[var(--text-secondary)]">{order.gstin}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
