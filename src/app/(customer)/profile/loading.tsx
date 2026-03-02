import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
    return (
        <div className="min-h-[100dvh] bg-[var(--background)] max-w-2xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4 py-4">
                <Skeleton className="size-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[var(--surface-muted)] rounded-[var(--radius-md)] border border-[var(--border)]">
                        <div className="flex items-center gap-3">
                            <Skeleton className="size-5 rounded-[var(--radius-sm)]" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="size-4" />
                    </div>
                ))}
            </div>

            <div className="space-y-4 pt-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full rounded-[var(--radius-md)]" />
                <Skeleton className="h-12 w-full rounded-[var(--radius-md)]" />
            </div>
        </div>
    );
}
