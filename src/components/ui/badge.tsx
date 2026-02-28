import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center px-2 py-0.5 text-xs font-black tracking-tight w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 transition-all rounded-lg",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-900 text-white shadow-sm",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-600",
        destructive:
          "border-transparent bg-red-50 text-red-600",
        outline:
          "border-zinc-200 text-zinc-500 bg-transparent",
        premium:
          "border-transparent bg-red-50 text-[var(--primary)] font-black tracking-[0.15em]",
        fresh:
          "border-transparent bg-emerald-50 text-emerald-700 font-black tracking-[0.15em]",
        brand:
          "border-transparent bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/20",
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
