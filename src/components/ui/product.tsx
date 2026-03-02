import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

function ProductGroup({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            role="list"
            data-slot="product-group"
            className={cn("group/product-group flex flex-col", className)}
            {...props}
        />
    )
}

function ProductSeparator({
    className,
    ...props
}: React.ComponentProps<typeof Separator>) {
    return (
        <Separator
            data-slot="product-separator"
            orientation="horizontal"
            className={cn("my-0", className)}
            {...props}
        />
    )
}

const productVariants = cva(
    "group/product flex items-center border border-transparent text-sm rounded-[var(--radius-md)] transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    {
        variants: {
            variant: {
                default: "bg-transparent",
                outline: "border-border",
                muted: "bg-muted/50",
            },
            size: {
                default: "p-4 gap-4",
                sm: "py-3 px-4 gap-2.5",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

function Product({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...props
}: React.ComponentProps<"div"> &
    VariantProps<typeof productVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "div"
    return (
        <Comp
            data-slot="product"
            data-variant={variant}
            data-size={size}
            className={cn(productVariants({ variant, size, className }))}
            {...props}
        />
    )
}

const productMediaVariants = cva(
    "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=product-description]]/product:self-start [&_svg]:pointer-events-none group-has-[[data-slot=product-description]]/product:translate-y-0.5",
    {
        variants: {
            variant: {
                default: "bg-transparent",
                icon: "size-8 border rounded-[var(--radius-sm)] bg-muted [&_svg:not([class*='size-'])]:size-4",
                image:
                    "size-10 rounded-[var(--radius-sm)] overflow-hidden [&_img]:size-full [&_img]:object-cover",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function ProductMedia({
    className,
    variant = "default",
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof productMediaVariants>) {
    return (
        <div
            data-slot="product-media"
            data-variant={variant}
            className={cn(productMediaVariants({ variant, className }))}
            {...props}
        />
    )
}

function ProductContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="product-content"
            className={cn(
                "flex flex-1 flex-col gap-1 [&+[data-slot=product-content]]:flex-none",
                className
            )}
            {...props}
        />
    )
}

function ProductTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="product-title"
            className={cn(
                "flex w-fit items-center gap-2 text-sm leading-snug font-medium",
                className
            )}
            {...props}
        />
    )
}

function ProductDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            data-slot="product-description"
            className={cn(
                "text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance",
                "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
                className
            )}
            {...props}
        />
    )
}

function ProductActions({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="product-actions"
            className={cn("flex items-center gap-2", className)}
            {...props}
        />
    )
}

function ProductHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="product-header"
            className={cn(
                "flex basis-full items-center justify-between gap-2",
                className
            )}
            {...props}
        />
    )
}

function ProductFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="product-footer"
            className={cn(
                "flex basis-full items-center justify-between gap-2",
                className
            )}
            {...props}
        />
    )
}

export {
    Product,
    ProductMedia,
    ProductContent,
    ProductActions,
    ProductGroup,
    ProductSeparator,
    ProductTitle,
    ProductDescription,
    ProductHeader,
    ProductFooter,
}
