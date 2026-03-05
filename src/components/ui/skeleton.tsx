import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden bg-[var(--surface-muted)] rounded-[var(--radius-md)]",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-[var(--surface)]/40 after:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
