'use client';

import React from 'react';
import { MapPin, Package } from 'lucide-react';

interface DeliveryInfoProps {
    order: any;
}

export function DeliveryInfo({ order }: DeliveryInfoProps) {
    if (!order.delivery_address && !order.awb_number) return null;

    return (
        <div className="space-y-4">
            {order.awb_number && (
                <div className="surface-card p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-zinc-50 rounded-xl flex items-center justify-center">
                            <Package className="size-5 text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-zinc-500 tracking-wider leading-none mb-1.5">Tracking ID</p>
                            <p className="text-sm font-bold text-zinc-900">{order.courier_partner || 'Shadowfax'} • {order.awb_number}</p>
                        </div>
                    </div>
                    {order.tracking_url && (
                        <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 px-5 rounded-2xl bg-zinc-950 text-white text-xs font-black tracking-wider flex items-center justify-center active:scale-95 transition-all shadow-xl shadow-zinc-950/10 border border-zinc-900"
                        >
                            Track
                        </a>
                    )}
                </div>
            )}

            {order.delivery_address && (
                <div className="surface-card p-4 flex items-start gap-4">
                    <div className="size-10 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="size-5 text-zinc-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-black text-zinc-500 tracking-wider mb-1.5 leading-none">Delivery Address</p>
                        <p className="text-[13px] font-semibold text-zinc-800 leading-snug">
                            {typeof order.delivery_address === 'object'
                                ? `${(order.delivery_address as Record<string, any>).name || ''} • ${(order.delivery_address as Record<string, any>).address_line1 || (order.delivery_address as Record<string, any>).line1 || ''}`
                                : 'Address on file'}
                        </p>
                        {((order as any).gstin || (order.delivery_address as any)?.gstin) && (
                            <div className="mt-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-100 w-fit">
                                <span className="text-xs font-black text-zinc-400 tracking-wider">GSTIN:</span>
                                <span className="text-xs font-bold text-zinc-600">{(order as any).gstin || (order.delivery_address as any).gstin}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
