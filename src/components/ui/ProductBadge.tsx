'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Star, Percent, Clock, Zap } from 'lucide-react';

export type BadgeType = 'rating' | 'discount' | 'fulfillment' | 'delivery' | 'status';

interface BadgeProps {
  type: BadgeType;
  value: string | number;
  className?: string;
}

export function Badge({ type, value, className }: BadgeProps) {
  const Icon = {
    rating: Star,
    discount: Percent,
    fulfillment: Clock,
    delivery: Zap,
    status: null,
  }[type];

  const variants = {
    rating: "bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border)]",
    discount: "bg-[var(--primary)] text-[var(--text-inverse)]",
    fulfillment: "bg-[var(--text-primary)] text-[var(--text-inverse)]",
    delivery: "bg-[var(--primary)]/10 text-[var(--primary)] border border-red-200",
    status: "bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]",
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold tracking-tight shadow-sm",
      variants[type],
      className
    )}>
      {Icon && (
        <Icon
          className={cn(
            "size-2.5",
            type === 'rating' ? "text-green-600 fill-green-600" : "fill-current"
          )}
        />
      )}
      <span>{value}</span>
    </div>
  );
}
