import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * ProductSkeleton implements the Wyshkit 2026 "Discovery Skeleton".
 * High-fidelity placeholders for smooth layout transitions.
 */
export function ProductSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton className="aspect-[4/5] w-full rounded-[var(--radius-xl)]" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-3 w-1/3 rounded-full" />
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-1/2 rounded-full" />
      </div>
    </div>
  );
}

export function VendorCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton className="aspect-[4/3] w-full rounded-[var(--radius-xl)]" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-4 w-3/4 rounded-full" />
        <Skeleton className="h-3 w-1/2 rounded-full" />
      </div>
    </div>
  );
}

export function VendorCircleSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <Skeleton className="size-16 rounded-full" />
      <Skeleton className="h-3 w-12 rounded-full" />
    </div>
  );
}

// Aliases for backward compatibility while refactoring
export const ProductCardSkeleton = ProductSkeleton;

export function ProductSurfaceSkeleton() {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="px-6 py-8 space-y-10">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-8 w-3/4 rounded-full" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-12 rounded-[var(--radius-md)]" />
            <Skeleton className="h-12 rounded-[var(--radius-md)]" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-3 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <Skeleton className="h-4 w-4/6 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function VendorSheetSkeleton() {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="px-5 -mt-10 relative z-10">
        <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] p-5 border border-[var(--border)] space-y-4">
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-7 w-3/4 rounded-full" />
              <Skeleton className="h-4 w-1/4 rounded-full" />
            </div>
            <Skeleton className="size-12 rounded-[var(--radius-md)]" />
          </div>
          <Skeleton className="h-4 w-full rounded-full" />
          <div className="flex gap-4 pt-4 border-t border-[var(--surface-muted)]">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <div className="px-5 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      </div>
    </div>
  );
}
