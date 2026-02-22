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
      "flex flex-col items-center justify-center py-20 px-8 text-center",
      "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out",
      className
    )}>
      <div className="relative mb-8 group">
        {/* Animated Orbs */}
        <div className={cn(
          "absolute -inset-4 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000 animate-pulse",
          variant === 'premium' ? "bg-rose-500" : "bg-zinc-400"
        )} />

        <div className={cn(
          "relative size-24 rounded-[32px] flex items-center justify-center shadow-sm transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3",
          variant === 'premium'
            ? "bg-gradient-to-br from-rose-500 to-orange-500 shadow-rose-500/20"
            : "bg-white border border-zinc-100 shadow-zinc-200/50"
        )}>
          {IconOrEmoji ? (
            isEmoji ? (
              <span className="text-4xl animate-bounce-slow leading-none">{IconOrEmoji}</span>
            ) : (
              <IconOrEmoji className={cn(
                "size-10",
                variant === 'premium' ? "text-white" : "text-zinc-400"
              )} />
            )
          ) : (
            <ShoppingBag className={cn(
              "size-10",
              variant === 'premium' ? "text-white" : "text-zinc-400"
            )} />
          )}

          <div className="absolute -top-2 -right-2">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-md" />
              <Sparkles className="relative size-6 text-amber-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[280px] space-y-3">
        <h3 className={cn(
          "text-2xl font-black italic tracking-tighter leading-none",
          variant === 'premium' ? "text-zinc-950" : "text-zinc-900"
        )}>
          {title}
        </h3>
        <p className="text-sm font-medium text-zinc-500 leading-relaxed px-2">
          {description}
        </p>
      </div>

      {children}

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className={cn(
            "mt-10 rounded-2xl px-10 font-black tracking-wider h-14 shadow-xl active:scale-95 transition-all duration-300",
            variant === 'premium'
              ? "bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white shadow-rose-500/20"
              : "bg-zinc-950 hover:bg-zinc-800 text-white"
          )}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
