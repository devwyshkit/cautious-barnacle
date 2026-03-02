'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface HyperlocalTimerProps {
    deadline?: string; // ISO string
    variant?: 'default' | 'urgent' | 'minimal' | 'badge' | 'subtle';
    className?: string;
    onExpire?: () => void;
}

/**
 * WYSHKIT 2026: Standardized SLA Pulse
 * High-precision, human-centric timer with 1s resolution.
 */
export function HyperlocalTimer({
    deadline,
    variant = 'default',
    className,
    onExpire
}: HyperlocalTimerProps) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        if (!deadline) return;
        const target = new Date(deadline).getTime();

        const update = () => {
            const now = Date.now();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft('00h 00m 00s');
                if (!expired) {
                    setExpired(true);
                    onExpire?.();
                }
                return;
            }

            const hrs = Math.floor(diff / 3600000);
            const mins = Math.floor((diff % 3600000) / 60000);
            const secs = Math.floor((diff % 60000) / 1000);

            setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
            setIsUrgent(hrs < 1);
        };

        const timer = setInterval(update, 1000);
        update();
        return () => clearInterval(timer);
    }, [deadline, expired, onExpire]);

    if (!deadline) return null;

    if (variant === 'minimal') {
        return (
            <div className={cn("flex items-center gap-1.5 tabular-nums text-xs font-bold tracking-tight", isUrgent ? "text-[var(--destructive)]" : "text-[var(--well-warning-text)]", className)}>
                <div className={cn("size-1 rounded-full", isUrgent ? "bg-[var(--destructive)] animate-ping" : "bg-[var(--well-warning-text)]")} />
                {timeLeft}
            </div>
        );
    }

    if (variant === 'badge') {
        return (
            <Badge
                variant={isUrgent ? "destructive" : "secondary"}
                className={cn("gap-1.5 px-2", className)}
            >
                <Clock className={cn("size-2.5", isUrgent && "animate-pulse")} />
                <span className="tabular-nums">{timeLeft}</span>
            </Badge>
        );
    }

    const isSubtle = variant === 'subtle';

    return (
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-[var(--radius-lg)] border transition-all duration-300",
            isUrgent
                ? "bg-[var(--well-destructive)] border-[var(--well-destructive-border)] shadow-[var(--shadow-glow-destructive)]"
                : isSubtle
                    ? "bg-[var(--surface-muted)] border-transparent"
                    : "bg-[var(--surface)] border-[var(--border)]",
            className
        )}>
            <div className={cn(
                "size-8 rounded-[var(--radius-md)] flex items-center justify-center transition-colors shadow-[var(--shadow-sm)]",
                isUrgent ? "bg-[var(--background)] text-[var(--destructive)]" : "bg-[var(--foreground)] text-[var(--background)]"
            )}>
                <Timer className={cn("size-4", isUrgent && "animate-pulse")} />
            </div>
            <div>
                <p className={cn(
                    "text-[var(--text-xxs)] font-black tracking-widest mb-0.5 uppercase",
                    isUrgent ? "text-[var(--destructive)]" : "text-[var(--text-tertiary)]"
                )}>
                    {isUrgent ? 'Expiring Soon' : 'Prep Deadline'}
                </p>
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-sm font-bold tabular-nums tracking-tight",
                        isUrgent ? "text-[var(--destructive)]" : "text-[var(--text-primary)]"
                    )}>
                        {timeLeft}
                    </span>
                    {isUrgent && (
                        <span className="text-[var(--text-xxs)] font-black text-[var(--destructive)] animate-pulse tracking-tighter uppercase px-1.5 py-0.5 bg-[var(--well-destructive)] rounded-[var(--radius-xs)]">Urgent</span>
                    )}
                </div>
            </div>
        </div>
    );
}
