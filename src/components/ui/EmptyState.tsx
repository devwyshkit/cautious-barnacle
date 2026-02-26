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
          variant === 'premium' ? "bg-rose-500" : "bg-zinc-400"
        )} />
        <div className={cn(
          "absolute -inset-12 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-all duration-1000 animate-pulse-delayed",
          variant === 'premium' ? "bg-orange-400" : "bg-zinc-300"
        )} />

        {/* Glass Icon Container */}
        <div className={cn(
          "relative size-28 rounded-[28px] flex items-center justify-center shadow-2xl transition-all duration-700",
          "hover:scale-110 hover:-rotate-3 active:scale-95",
          "glass-morphism border-2",
          variant === 'premium'
            ? "bg-gradient-to-br from-rose-500/90 to-orange-500/90 border-white/20 shadow-rose-500/20"
            : "bg-white/40 backdrop-blur-3xl border-white/80 shadow-zinc-200/50"
        )}>
          {IconOrEmoji ? (
            isEmoji ? (
              <span className="text-5xl animate-float leading-none drop-shadow-sm">{IconOrEmoji}</span>
            ) : (
              <IconOrEmoji className={cn(
                "size-12 animate-float",
                variant === 'premium' ? "text-white" : "text-zinc-900"
              )} />
            )
          ) : (
            <ShoppingBag className={cn(
              "size-12 animate-float",
              variant === 'premium' ? "text-white" : "text-zinc-900"
            )} />
          )}

          <div className="absolute -top-3 -right-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/40 rounded-full blur-xl animate-pulse" />
              <Sparkles className="relative size-8 text-amber-400 drop-shadow-glow animate-sparkle" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[300px] space-y-4">
        <h3 className={cn(
          "text-3xl font-black italic tracking-tighter leading-[0.9] decoration-amber-400/30 underline-offset-4",
          variant === 'premium' ? "text-zinc-950" : "text-zinc-900 shadow-zinc-500/10 drop-shadow-sm"
        )}>
          {title}
        </h3>
        <p className="text-[13px] font-bold text-zinc-500/80 leading-snug px-4 tracking-tight">
          {description}
        </p>
      </div>

      {children}

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className={cn(
            "mt-12 rounded-2xl px-12 font-black tracking-tight h-16 shadow-xl active:scale-95 transition-all duration-500",
            "border-b-4",
            variant === 'premium'
              ? "bg-[var(--primary)] hover:bg-[var(--primary)] border-rose-700 text-white shadow-rose-500/30"
              : "bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-white shadow-zinc-900/20"
          )}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
