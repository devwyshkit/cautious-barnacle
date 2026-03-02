'use client';

import React from 'react';
import { Clock, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MastheadProps {
    locationName?: string;
    etaMinutes?: number;
    status?: 'normal' | 'delayed' | 'capacity';
    message?: string;
    className?: string;
}

/**
 * WYSHKIT 2026: The Masthead Principle
 * Communicates speed, trust, and real-time system state.
 * REFRESHED: Using semantic design tokens for background and text.
 */
export function Masthead({
    locationName = 'Koramangala',
    etaMinutes = 45,
    status = 'normal',
    message,
    className
}: MastheadProps) {

    const getStatusConfig = () => {
        switch (status) {
            case 'delayed':
                return {
                    bg: 'bg-[var(--destructive-foreground)] border-[var(--destructive)]/20',
                    text: 'text-[var(--destructive)]',
                    icon: <AlertTriangle className="size-3.5 text-[var(--destructive)] shrink-0" />,
                    label: message || 'High rain in your area. Deliveries might be slightly delayed.',
                    tag: 'Weather Update'
                };
            case 'capacity':
                return {
                    bg: 'bg-[var(--warning-foreground)] border-[var(--warning)]/20',
                    text: 'text-[var(--warning)]',
                    icon: <Clock className="size-3.5 text-[var(--warning)] shrink-0" />,
                    label: message || 'More orders than usual. Allow a few extra minutes.',
                    tag: 'Busy'
                };
            default:
                return {
                    bg: 'bg-[var(--success-foreground)] border-[var(--success)]/10',
                    text: 'text-[var(--text-primary)]',
                    icon: <Zap className="size-3.5 text-[var(--success)] fill-[var(--success)]/20 shrink-0" />,
                    label: message || `~${etaMinutes} min delivery to ${locationName}`,
                    tag: 'On Time'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div
            className={cn(
                "px-[var(--space-4)] md:px-[var(--space-8)] py-[var(--space-3)] border-b transition-all duration-500 animate-in slide-in-from-top-4",
                config.bg,
                className
            )}
            suppressHydrationWarning
        >
            <div className="flex items-center justify-between gap-[var(--space-4)] max-w-[1440px] mx-auto">
                <div className="flex items-center gap-[var(--space-2-5)] overflow-hidden">
                    {config.icon}
                    <span className={cn(
                        "text-xs font-bold tracking-tight truncate",
                        config.text
                    )}>
                        {config.label}
                    </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <div className={cn(
                            "size-1.5 rounded-full animate-pulse",
                            status === 'normal' ? 'bg-[var(--success)]' : status === 'delayed' ? 'bg-[var(--destructive)]' : 'bg-[var(--warning)]'
                        )} />
                        <span className={cn(
                            "text-xs font-bold tracking-tight",
                            status === 'normal' ? 'text-[var(--success)]' : status === 'delayed' ? 'text-[var(--destructive)]' : 'text-[var(--warning)]'
                        )}>
                            {config.tag}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
