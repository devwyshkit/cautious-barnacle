import { Skeleton } from "@/components/ui/skeleton";

export default function VendorPageLoading() {
  return (
    <div className="min-h-[100dvh]">
      <Skeleton className="w-full aspect-[3/2]" />
      <div className="px-4 py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
