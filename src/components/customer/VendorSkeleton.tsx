import { Skeleton } from '@/components/ui/skeleton';

/**
 * WYSHKIT 2026: Vendor Store Skeleton
 * WYSHKIT 2026 Pattern: Zero CLS - Skeleton matches exact layout dimensions
 */
export function VendorSkeleton() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-[var(--surface)]">
      {/* Header Banner Skeleton */}
      <div className="relative aspect-[4/1] md:aspect-[5/1] w-full bg-[var(--surface-muted)] animate-pulse" />

      {/* Content Layer Skeleton */}
      <div className="-mt-12 relative z-10 px-4 max-w-[1200px] mx-auto w-full">
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="size-16 rounded-[var(--radius-lg)] shrink-0" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 pb-1">
            <Skeleton className="size-9 rounded-[var(--radius-md)]" />
            <Skeleton className="w-11 h-10 rounded-[var(--radius-md)]" />
          </div>
        </div>

        {/* ETA/Delivery Status Pills */}
        <div className="flex items-center gap-3 mt-4">
          <Skeleton className="h-6 w-24 rounded-[var(--radius-sm)]" />
          <Skeleton className="h-6 w-32 rounded-[var(--radius-sm)]" />
        </div>
      </div>

      <div className="h-px bg-[var(--surface-muted)] mt-6 mx-4 md:mx-0" />

      {/* CircleRail Skeleton - Categories */}
      <div className="px-4 md:px-8 mt-6">
        <div className="flex gap-4 overflow-hidden py-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <Skeleton className="size-14 md:size-16 rounded-full" />
              <Skeleton className="h-2 w-10 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid Skeleton - Zero CLS column matching */}
      <div className="px-4 md:px-8 mt-10 space-y-8">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-[16px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-full" />
                <Skeleton className="h-3 w-1/4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
