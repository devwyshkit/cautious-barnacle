'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * WYSHKIT 2026: The "One Surface" Pattern (Refined)
 * ResponsiveSurface unifies Drawers (Mobile) and Dialogs (Desktop).
 * Pattern: Elite Consolidation (Zero Overengineering).
 * 
 * Update: Purged manual "Sheet Arbiter" global state. 
 * Standard Radix/Vaul orchestration is more resilient and prevents hydration loops.
 */

interface ResponsiveSurfaceProps {
    children: React.ReactNode;
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    lean?: boolean;
}

export function ResponsiveSurface({
    children,
    trigger,
    title,
    description,
    open = false,
    onOpenChange,
    className,
    lean = false
}: ResponsiveSurfaceProps) {
    const isMobile = useIsMobile();

    const handleOpenChange = React.useCallback((val: boolean) => {
        if (onOpenChange) onOpenChange(val);
    }, [onOpenChange]);

    if (!isMobile) {
        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
                <DialogContent className={cn(
                    "flex flex-col h-full max-h-[92vh] sm:max-w-2xl",
                    className
                )} lean={lean}>
                    {(!lean && (title || description)) && (
                        <DialogHeader className="text-left shrink-0 p-[var(--space-6)] sm:p-[var(--space-8)] space-y-[var(--space-1)] border-b border-[var(--border)]">
                            {title && <DialogTitle className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">{title}</DialogTitle>}
                            {description && <DialogDescription className="text-sm font-medium text-[var(--text-secondary)]">{description}</DialogDescription>}

                            <DialogClose className="absolute right-[var(--space-6)] top-[var(--space-6)] rounded-[var(--radius-sm)] opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
                                <XIcon className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </DialogClose>
                        </DialogHeader>
                    )}
                    <div className={cn(
                        "flex-1 flex flex-col min-h-0 relative overscroll-contain overflow-y-auto",
                        "p-0"
                    )}>
                        {children}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
            <DrawerContent className={cn(
                "flex flex-col max-h-[92vh] border-t-0 rounded-t-[var(--radius-3xl)] bg-[var(--surface)] z-[var(--z-overlay)] pb-safe",
                className
            )}>
                {/* WYSHKIT 2026: Elite Handle (Mobile Only) - Now managed by DrawerContent base with sm:hidden */}

                {(!lean && (title || description)) && (
                    <DrawerHeader className="text-left shrink-0 pb-[var(--space-4)] pt-[var(--space-4)] border-b border-[var(--border)] bg-[var(--surface)] rounded-t-[var(--radius-3xl)]">
                        {title && <DrawerTitle className="text-xl font-black tracking-tight text-[var(--text-primary)]">{title}</DrawerTitle>}
                        {description && <DrawerDescription className="text-xs font-medium text-[var(--text-secondary)]">{description}</DrawerDescription>}
                    </DrawerHeader>
                )}

                <div
                    className={cn(
                        "flex-1 flex flex-col min-h-0 h-full relative overflow-y-auto overscroll-contain",
                        lean ? "p-0" : "p-0"
                    )}
                >
                    {children}
                </div>

                {/* WYSHKIT 2026: Elite Clean UI. Dismiss via drag/overlay. */}
            </DrawerContent>
        </Drawer>
    );
}
