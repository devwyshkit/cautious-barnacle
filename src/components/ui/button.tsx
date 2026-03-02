'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-brand)] hover:bg-[var(--primary-hover)]",
        destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)] shadow-[var(--shadow-sm)] hover:opacity-90",
        outline: "border-2 border-[var(--border)] bg-transparent hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-tertiary)]",
        secondary: "bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--input)]",
        ghost: "hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 rounded-[var(--radius-sm)] text-xs",
        lg: "h-14 px-8 rounded-[var(--radius-lg)] text-base",
        icon: "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), "active:scale-95 transition-transform font-sans")}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
