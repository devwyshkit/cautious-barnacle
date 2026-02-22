'use client';

import React from 'react';
import { Clock, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MastheadProps {
    locationName?: string;
    status?: 'normal' | 'delayed' | 'capacity';
    message?: string;
    className?: string;
}

/**
 * WYSHKIT 2026: The Masthead Principle
 * Communicates speed, trust, and real-time system state.
 */
export function Masthead({
    locationName = 'Koramangala',
    status = 'normal',
    message,
    className
}: MastheadProps) {

    const getStatusConfig = () => {
        switch (status) {
            case 'delayed':
                return {
                    bg: 'bg-rose-50/50 border-rose-100/50',
                    text: 'text-rose-900',
                    icon: <AlertTriangle className="size-3.5 text-rose-600 shrink-0" />,
                    label: message || 'High rain in your area. Deliveries might be slightly delayed.',
                    tag: 'Weather Update'
                };
            case 'capacity':
                return {
                    bg: 'bg-amber-50/50 border-amber-100/50',
                    text: 'text-amber-900',
                    icon: <Clock className="size-3.5 text-amber-600 shrink-0" />,
                    label: message || 'Unprecedented demand. We are prioritizing early orders.',
                    tag: 'High Intent'
                };
            default:
                return {
                    bg: 'bg-emerald-50/30 border-emerald-100/50',
                    text: 'text-zinc-900',
                    icon: <Zap className="size-3.5 text-emerald-600 fill-emerald-600/20 shrink-0" />,
                    label: message || `Committed: Delivering by 45 mins to ${locationName}`,
                    tag: 'On Time'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div
            className={cn(
                "px-4 md:px-8 py-2.5 border-b transition-all duration-500 animate-in slide-in-from-top-4",
                config.bg,
                className
            )}
            suppressHydrationWarning
        >
            <div className="flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
                <div className="flex items-center gap-2 overflow-hidden">
                    {config.icon}
                    <span className={cn(
                        "text-[10px] font-bold tracking-tight truncate",
                        config.text
                    )}>
                        {config.label}
                    </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <div className={cn(
                            "size-1 rounded-full animate-pulse",
                            status === 'normal' ? 'bg-emerald-500' : status === 'delayed' ? 'bg-rose-500' : 'bg-amber-500'
                        )} />
                        <span className={cn(
                            "text-[9px] font-bold uppercase tracking-wider",
                            status === 'normal' ? 'text-emerald-700' : status === 'delayed' ? 'text-rose-700' : 'text-amber-700'
                        )}>
                            {config.tag}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
