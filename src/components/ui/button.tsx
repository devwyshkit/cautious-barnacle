'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#D91B24]/20",
  {
    variants: {
      variant: {
        default: "bg-[#D91B24] text-white shadow-[0_4px_12px_rgb(217_27_36/0.2)] hover:bg-[#B7161D]",
        destructive: "bg-red-600 text-white shadow-md hover:bg-red-700",
        outline: "border-2 border-[#F1F1F6] bg-transparent hover:bg-[#F1F1F6] hover:text-[#161824] hover:border-[#E4E4E7]",
        secondary: "bg-[#F1F1F6] text-[#161824] hover:bg-[#E4E4E7]",
        ghost: "hover:bg-[#F1F1F6] hover:text-[#161824]",
        link: "text-[#D91B24] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-3 rounded-[10px] text-xs",
        lg: "h-14 px-8 rounded-[16px] text-base",
        icon: "size-11 rounded-full",
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
        className={cn(buttonVariants({ variant, size, className }), "active:scale-95 transition-transform")}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
