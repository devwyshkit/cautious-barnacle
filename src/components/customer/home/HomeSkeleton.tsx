import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/** Skeleton for DiscoveryItemsGrid only - matches grid section layout */
export function HomeSkeleton() {
  return (
    <section className="px-4 py-6 md:px-8">
      <div className="flex flex-col mb-8">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-3 w-32 mt-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}
