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
    rating: "bg-zinc-50 text-zinc-900 border border-zinc-100",
    discount: "bg-[var(--primary)] text-white",
    fulfillment: "bg-zinc-900 text-white",
    delivery: "bg-[var(--primary)]/10 text-[var(--primary)] border border-red-200",
    status: "bg-zinc-100 text-zinc-600 border border-zinc-200",
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
