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
                    bg: 'bg-[var(--destructive-muted)] border-b border-[var(--destructive)]/10',
                    text: 'text-[var(--destructive)]',
                    icon: <AlertTriangle className="size-3.5 text-[var(--destructive)] shrink-0" />,
                    label: message || 'High rain in your area. Deliveries might be slightly delayed.',
                    tag: 'Weather Update'
                };
            case 'capacity':
                return {
                    bg: 'bg-[var(--warning-foreground)] border-b border-[var(--warning-border)]',
                    text: 'text-[var(--warning)]',
                    icon: <Clock className="size-3.5 text-[var(--warning)] shrink-0" />,
                    label: message || 'More orders than usual. Allow a few extra minutes.',
                    tag: 'Busy'
                };
            default:
                return {
                    bg: 'bg-[var(--primary-muted)] border-b border-[var(--primary)]/5',
                    text: 'text-[var(--text-primary)]',
                    icon: <Zap className="size-3.5 text-[var(--primary)] fill-[var(--primary)]/20 shrink-0" />,
                    label: message || `~${etaMinutes} min delivery to ${locationName}`,
                    tag: 'On Time'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div
            id="global-masthead"
            className={cn(
                "w-full px-4 md:px-8 py-2.5 transition-all duration-700 ease-in-out",
                config.bg,
                className
            )}
            suppressHydrationWarning
        >
            <div className="flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
                <div className="flex items-center gap-2 overflow-hidden">
                    {config.icon}
                    <span className={cn(
                        "text-[10px] md:text-xs font-black uppercase tracking-tight truncate",
                        config.text
                    )}>
                        {config.label}
                    </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/20">
                        <div className={cn(
                            "size-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]",
                            status === 'normal' ? 'bg-[var(--success)] text-[var(--success)]' : status === 'delayed' ? 'bg-[var(--destructive)] text-[var(--destructive)]' : 'bg-[var(--warning)] text-[var(--warning)]'
                        )} />
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-wider",
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
