import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center px-2 py-0.5 text-xs font-black uppercase tracking-widest w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 transition-all rounded-[var(--radius-sm)]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--text-primary)] text-[var(--primary-foreground)] shadow-sm",
        secondary:
          "border-transparent bg-[var(--surface-muted)] text-[var(--text-secondary)]",
        destructive:
          "border-transparent bg-[var(--destructive-foreground)] text-[var(--destructive)]",
        outline:
          "border-[var(--border)] text-[var(--text-tertiary)] bg-transparent",
        premium:
          "border-transparent bg-[var(--primary-muted)] text-[var(--primary)] font-black",
        fresh:
          "border-transparent bg-[var(--success-foreground)] text-[var(--success)] font-black",
        brand:
          "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
