'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CheckoutAddressProps {
    data: any[];
    metadata?: Record<string, any>;
}

export function CheckoutAddress({ data, metadata }: CheckoutAddressProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="surface-card p-6">
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Delivery Address</h3>
                {data.map((addr: any) => (
                    <div
                        key={addr.id}
                        className={cn(
                            "p-4 rounded-2xl border transition-all cursor-pointer",
                            addr.id === metadata?.selected_id ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-zinc-100 bg-white"
                        )}
                    >
                        <p className="text-xs font-bold text-zinc-900">{addr.type || 'Home'}</p>
                        <p className="text-[10px] text-zinc-500 line-clamp-1">{addr.address_line1}, {addr.city}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
