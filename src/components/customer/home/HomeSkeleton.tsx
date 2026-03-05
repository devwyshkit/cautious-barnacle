import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/** 
 * WYSHKIT 2026: God-Level Skeleton 
 * Exactly matches src/app/(customer)/page.tsx vertical rhythm to achieve zero CLS.
 */
export function HomeSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-[var(--background)]">
      <main className="pb-24">
        {/* Mirroring page.tsx flex-col gap-5 */}
        <div className="flex flex-col gap-5 md:gap-10">

          {/* Categories - CircleRail */}
          <section className="px-4 md:px-8 mt-4">
            <div className="flex gap-4 overflow-hidden py-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                  <Skeleton className="size-12 rounded-full" />
                  <Skeleton className="h-2 w-8 rounded-full" />
                </div>
              ))}
            </div>
          </section>

          {/* Discovery Surface - Promos & Banners */}
          <div className="flex flex-col gap-5 md:gap-10 px-4 md:px-8">
            {/* Wallet Hook / Active Orders Sim */}
            <Skeleton className="h-16 w-full rounded-[var(--radius-xl)]" />

            {/* BannerBento Skeleton */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <div className="flex gap-4 overflow-hidden -mx-4 px-4">
                <Skeleton className="w-[85vw] md:w-[400px] h-[180px] shrink-0 rounded-[var(--radius-xl)]" />
                <Skeleton className="w-[85vw] md:w-[400px] h-[180px] shrink-0 rounded-[var(--radius-xl)] opacity-50" />
              </div>
            </div>

            {/* ReorderRail Skeleton */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-24 rounded-full" />
              <div className="flex gap-3 overflow-hidden -mx-4 px-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-[210px] h-[100px] shrink-0 rounded-[var(--radius-xl)]" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-10 px-4 md:px-8">
            {/* Trending Products Skeleton */}
            <div className="flex flex-col gap-4">
              <Skeleton className="h-5 w-40 rounded-full" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="shrink-0 w-[140px] space-y-2">
                    <Skeleton className="aspect-square w-full rounded-[var(--radius-xl)]" />
                    <Skeleton className="h-3 w-3/4 rounded-full" />
                    <Skeleton className="h-3 w-1/2 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Stores Skeleton */}
            <div className="flex flex-col gap-4">
              <Skeleton className="h-5 w-36 rounded-full" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[16/9] w-full rounded-[var(--radius-xl)]" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-3/4 rounded-full" />
                      <Skeleton className="h-2 w-1/4 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
