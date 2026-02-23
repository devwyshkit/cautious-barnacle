import { Skeleton } from '@/components/ui/skeleton';

/**
 * WYSHKIT 2026: Partner Store Skeleton
 * Swiggy 2026 Pattern: Zero CLS - Skeleton matches exact layout dimensions
 */
export function PartnerSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="relative aspect-[16/6] md:aspect-[16/5] w-full bg-zinc-50 animate-pulse" />
      <div className="px-5 -mt-10 md:-mt-14 relative z-10">
        <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-zinc-100">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="size-12 rounded-full shrink-0" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </div>
      </div>

      {/* Items Grid Skeleton */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-[16px]" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
