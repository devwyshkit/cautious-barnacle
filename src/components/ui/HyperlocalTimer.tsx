'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface HyperlocalTimerProps {
    deadline?: string; // ISO string
    variant?: 'default' | 'urgent' | 'minimal' | 'badge';
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
            <div className={cn("flex items-center gap-1.5 tabular-nums text-xs font-black tracking-wider", isUrgent ? "text-rose-500" : "text-amber-500", className)}>
                <div className={cn("size-1 rounded-full", isUrgent ? "bg-rose-500 animate-ping" : "bg-amber-500")} />
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

    const isDark = variant === 'default' && className?.includes('bg-zinc-800') || className?.includes('bg-zinc-900') || className?.includes('bg-black');

    return (
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300",
            isUrgent ? "bg-rose-50/50 border-rose-100 shadow-[0_4px_12px_rgba(225,29,72,0.05)]" : (isDark ? "bg-white/5 border-white/10" : "bg-white border-zinc-100"),
            className
        )}>
            <div className={cn(
                "size-8 rounded-xl flex items-center justify-center transition-colors",
                isUrgent ? "bg-rose-100 text-rose-600" : (isDark ? "bg-white/10 text-white" : "bg-black text-white")
            )}>
                <Timer className={cn("size-4", isUrgent && "animate-pulse")} />
            </div>
            <div>
                <p className={cn(
                    "text-[11px] font-black tracking-[0.15em] mb-0.5",
                    isUrgent ? "text-rose-500" : (isDark ? "text-white/40" : "text-zinc-400")
                )}>
                    {isUrgent ? 'Expiring Soon' : 'Preparation Deadline'}
                </p>
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-sm font-black tabular-nums tracking-tight",
                        isUrgent ? "text-rose-700" : (isDark ? "text-white" : "text-zinc-900")
                    )}>
                        {timeLeft}
                    </span>
                    {isUrgent && (
                        <span className="text-xs font-bold text-rose-500 animate-pulse tracking-tighter">Urgent</span>
                    )}
                </div>
            </div>
        </div>
    );
}
