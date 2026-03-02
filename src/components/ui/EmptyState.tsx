"use client";

import React from 'react';
import { Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }> | string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'premium';
}

/**
 * WYSHKIT 2026: The "Elite Empty Momement"
 * Zero-State UX as a premium design surface.
 */
export function EmptyState({
  icon: IconOrEmoji,
  title,
  description,
  actionLabel,
  onAction,
  className,
  children,
  variant = 'default'
}: EmptyStateProps) {
  const isEmoji = typeof IconOrEmoji === 'string';

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-24 px-8 text-center min-h-[400px]",
      "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out-expo",
      className
    )}>
      <div className="relative mb-10 group">
        {/* Elite Ambient Orbs */}
        <div className={cn(
          "absolute -inset-8 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-all duration-1000 animate-pulse-slow",
          variant === 'premium' ? "bg-[var(--primary)]" : "bg-[var(--text-tertiary)]"
        )} />
        <div className={cn(
          "absolute -inset-12 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-all duration-1000 animate-pulse-delayed",
          variant === 'premium' ? "bg-[var(--warning)]" : "bg-[var(--surface-muted)]"
        )} />

        {/* Glass Icon Container */}
        <div className={cn(
          "relative size-28 rounded-[var(--radius-3xl)] flex items-center justify-center shadow-2xl transition-all duration-700",
          "hover:scale-110 hover:-rotate-3 active:scale-95",
          "glass-morphism border-2",
          variant === 'premium'
            ? "bg-gradient-to-br from-[var(--primary)] to-[var(--warning)] border-[var(--surface)]/20 shadow-[var(--primary)]/20"
            : "bg-[var(--surface)]/40 backdrop-blur-3xl border-[var(--border)] shadow-[var(--shadow-sm)]/50"
        )}>
          {IconOrEmoji ? (
            isEmoji ? (
              <span className="text-5xl animate-float leading-none drop-shadow-sm">{IconOrEmoji}</span>
            ) : (
              <IconOrEmoji className={cn(
                "size-12 animate-float",
                variant === 'premium' ? "text-[var(--text-inverse)]" : "text-[var(--text-primary)]"
              )} />
            )
          ) : (
            <ShoppingBag className={cn(
              "size-12 animate-float",
              variant === 'premium' ? "text-[var(--text-inverse)]" : "text-[var(--text-primary)]"
            )} />
          )}

          <div className="absolute -top-3 -right-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--surface)]/40 rounded-full blur-xl animate-pulse" />
              <Sparkles className="relative size-8 text-[var(--star-rating)] drop-shadow-glow animate-sparkle" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[300px] space-y-4">
        <h3 className={cn(
          "text-3xl font-bold italic tracking-tighter leading-[0.9] decoration-[var(--primary)]/30 underline-offset-4",
          variant === 'premium' ? "text-[var(--text-primary)]" : "text-[var(--text-primary)] shadow-[var(--text-secondary)]/10 drop-shadow-sm"
        )}>
          {title}
        </h3>
        <p className="text-sm font-bold text-[var(--text-secondary)]/80 leading-snug px-4 tracking-tight">
          {description}
        </p>
      </div>

      {children}

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className={cn(
            "mt-12 rounded-[var(--radius-lg)] px-12 font-bold tracking-tight h-16 shadow-xl active:scale-95 transition-all duration-500",
            "border-b-4",
            variant === 'premium'
              ? "bg-[var(--primary)] hover:bg-[var(--primary)]/90 border-rose-900 text-[var(--primary-foreground)] shadow-[var(--primary)]/30"
              : "bg-[var(--foreground)] hover:bg-[var(--text-primary)] border-[var(--border)] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)]"
          )}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
