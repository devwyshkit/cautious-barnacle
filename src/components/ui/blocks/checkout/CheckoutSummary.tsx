'use client';

import React from 'react';

interface CheckoutSummaryProps {
    metadata?: Record<string, any>;
}

export function CheckoutSummary({ metadata }: CheckoutSummaryProps) {
    const pricing = metadata?.pricing;
    if (!pricing) return null;

    return (
        <div className="surface-card p-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                    <span className="text-sm font-bold text-zinc-900">Bill Summary</span>
                    <span className="text-lg font-black text-zinc-950 tabular-nums">₹{pricing.total}</span>
                </div>
                <div className="space-y-2">
                    {['subtotal', 'delivery_fee', 'platform_fee', 'gst'].map(key => (
                        <div key={key} className="flex justify-between text-xs text-zinc-500 tracking-wider font-bold">
                            <span>{key.replace('_', ' ')}</span>
                            <span className="text-zinc-950">₹{pricing[key] || 0}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
