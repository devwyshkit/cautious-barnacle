'use client';

import React from 'react';

export function OrderTrackerSkeleton() {
    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-24 space-y-6 animate-in fade-in duration-500">
            {/* Status Card Skeleton */}
            <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-[var(--surface-muted)] rounded-[var(--radius-sm)] animate-pulse" />
                        <div className="h-8 w-48 bg-[var(--surface-muted)] rounded-[var(--radius-md)] animate-pulse" />
                    </div>
                    <div className="size-12 rounded-full bg-[var(--surface-muted)] animate-pulse" />
                </div>
                <div className="h-2 w-full bg-[var(--surface-muted)] rounded-full animate-pulse" />
            </div>

            {/* Timeline Skeleton */}
            <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] p-6 space-y-6">
                <div className="h-6 w-32 bg-[var(--surface-muted)] rounded-[var(--radius-sm)] animate-pulse" />
                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border)]">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 relative">
                            <div className="size-6 rounded-full bg-[var(--surface-muted)] border-4 border-[var(--surface)] z-10 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-40 bg-[var(--surface-muted)] rounded-[var(--radius-sm)] animate-pulse" />
                                <div className="h-4 w-full bg-[var(--surface-muted)] rounded-[var(--radius-sm)] animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Products List Skeleton */}
            <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] p-6 space-y-4">
                <div className="h-6 w-40 bg-[var(--surface-muted)] rounded-[var(--radius-sm)] animate-pulse" />
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-4 p-3 bg-[var(--surface-muted)]/50 rounded-[var(--radius-lg)]">
                            <div className="size-16 bg-[var(--surface-muted)] rounded-[var(--radius-md)] animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 bg-[var(--surface-muted)] rounded-[var(--radius-sm)] animate-pulse" />
                                <div className="h-4 w-1/4 bg-[var(--surface-muted)] rounded-[var(--radius-sm)] animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
