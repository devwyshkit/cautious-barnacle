import { Skeleton } from '@/components/ui/skeleton';

/**
 * WYSHKIT 2026: Search Page Skeleton
 * Swiggy 2026 Pattern: Zero CLS - Skeleton matches exact layout dimensions
 */
export function SearchSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Skeleton */}
      <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg shrink-0" />
        <Skeleton className="flex-1 h-10 rounded-lg" />
      </div>

      {/* Results Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Partners Section Skeleton */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[140px] space-y-3">
                <div className="aspect-square rounded-xl bg-zinc-100 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-50/50 to-transparent animate-shimmer" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-3/4 rounded-full" />
                  <Skeleton className="h-3 w-1/2 rounded-full opacity-50" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-16 rounded-full" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-zinc-50/50 rounded-xl border border-zinc-100/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer -translate-x-full" />
                <Skeleton className="size-16 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-3.5 w-2/3 rounded-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-1/3 rounded-full opacity-60" />
                    <Skeleton className="h-3 w-12 rounded-full opacity-40" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
