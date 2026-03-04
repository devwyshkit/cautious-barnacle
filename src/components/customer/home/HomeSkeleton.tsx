import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/** 
 * WYSHKIT 2026: God-Level Skeleton 
 * Exactly matches src/app/(customer)/page.tsx vertical rhythm to achieve zero CLS.
 */
export function HomeSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-[var(--surface)]">


      <main className="pb-24 max-w-[1440px] mx-auto">
        <div className="px-[var(--space-4)] md:px-[var(--space-8)] space-y-[var(--space-8)] mt-[var(--space-6)]">
          {/* BannerBento Skeleton */}
          <div className="flex flex-col gap-[var(--space-3)]">
            <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-3)]">
              <Skeleton className="size-10 rounded-[var(--radius-md)]" />
              <div className="space-y-[var(--space-1)]">
                <Skeleton className="h-4 w-32 rounded-full" />
                <Skeleton className="h-3 w-24 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[var(--space-3)]">
              <Skeleton className="aspect-[4/5] rounded-[var(--radius-3xl)]" />
              <div className="grid grid-rows-2 gap-[var(--space-3)]">
                <Skeleton className="aspect-square rounded-[var(--radius-3xl)]" />
                <Skeleton className="aspect-square rounded-[var(--radius-3xl)]" />
              </div>
            </div>
          </div>

          {/* CircleRail Skeleton */}
          <div className="flex gap-[var(--space-3)] md:gap-[var(--space-5)] overflow-hidden py-[var(--space-2)]">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-[var(--space-1-5)] shrink-0">
                <Skeleton className="size-14 md:size-16 rounded-full" />
                <Skeleton className="h-2 w-10 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Trending Rail Skeleton (CardRail) */}
        <section className="px-[var(--space-4)] md:px-[var(--space-8)] mt-[var(--space-12)]">
          <div className="flex flex-col gap-[var(--space-4)]">
            <Skeleton className="h-6 w-48 rounded-full" />
            <div className="flex gap-[var(--space-4)] overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="shrink-0 w-[200px] sm:w-[240px] space-y-[var(--space-3)]">
                  <Skeleton className="aspect-square rounded-[var(--radius-md)]" />
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                  <Skeleton className="h-4 w-1/4 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Grid Skeleton (LayoutGrid + VendorCard) */}
        <section className="px-[var(--space-4)] md:px-[var(--space-8)] mt-[var(--space-12)]">
          <Skeleton className="h-6 w-32 mb-[var(--space-6)] rounded-full" />
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--space-4)]">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-[var(--space-3)]">
                <Skeleton className="aspect-[4/3] rounded-[var(--radius-lg)]" />
                <div className="space-y-[var(--space-1-5)]">
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                  <Skeleton className="h-3 w-1/4 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
