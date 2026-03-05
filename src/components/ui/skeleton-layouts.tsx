import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * ProductSkeleton implements the Wyshkit 2026 "Discovery Skeleton".
 * High-fidelity placeholders for smooth layout transitions.
 */
export function ProductSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton className="aspect-square w-full rounded-[var(--radius-xl)]" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/3 rounded-full opacity-60" />
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-1/2 rounded-full opacity-80" />
      </div>
    </div>
  );
}

export function VendorCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton className="aspect-[4/3] w-full rounded-[var(--radius-xl)]" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-full" />
        <Skeleton className="h-3 w-1/2 rounded-full opacity-60" />
      </div>
    </div>
  );
}

export function VendorCircleSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <Skeleton className="size-16 rounded-full" />
      <Skeleton className="h-3 w-12 rounded-full opacity-60" />
    </div>
  );
}

// Aliases for backward compatibility while refactoring
export const ProductCardSkeleton = ProductSkeleton;

export function ProductSurfaceSkeleton() {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <Skeleton className="aspect-square w-full rounded-[var(--radius-xl)] md:rounded-none" />
      <div className="px-5 py-8 space-y-10">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-full opacity-60" />
            <Skeleton className="h-8 w-3/4 rounded-full" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-12 rounded-[var(--radius-lg)]" />
            <Skeleton className="h-12 rounded-[var(--radius-lg)]" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-3 w-24 rounded-full opacity-60" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <Skeleton className="h-4 w-4/6 rounded-full opacity-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-[var(--surface)] p-3 rounded-[var(--radius-lg)] border border-[var(--border)] space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 rounded-[var(--radius-md)] shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4 rounded-full" />
          <Skeleton className="h-2.5 w-1/3 rounded-full opacity-60" />
          <div className="flex gap-2 pt-0.5">
            <Skeleton className="h-4 w-12 rounded-full opacity-40" />
            <Skeleton className="h-4 w-16 rounded-full opacity-40" />
          </div>
        </div>
      </div>
      <div className="pt-3 border-t border-[var(--surface-muted)] flex justify-between items-center">
        <Skeleton className="h-2.5 w-20 rounded-full opacity-40" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}
