import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-zinc-50/30">
      <div className="max-w-2xl mx-auto pb-40">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-zinc-100 px-4 py-4 sticky top-0 z-10 flex items-center gap-4">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Cart Card Skeleton */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 space-y-4">
            <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
              <Skeleton className="size-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-start py-2">
                <div className="flex gap-3">
                  <Skeleton className="size-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>

          {/* Location Card Skeleton */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 tracking-tighter font-black">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-4 items-center p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>

          {/* Bill Detail Skeleton */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 space-y-4">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
              <div className="pt-3 border-t border-zinc-50 flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-zinc-100 max-w-2xl mx-auto rounded-t-[32px] shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-12 flex-1 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
