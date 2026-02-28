'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
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
    showClose?: boolean;
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
    showClose = true,
    lean = false
}: ResponsiveSurfaceProps) {
    const isMobile = useIsMobile();
    const [mounted, setMounted] = React.useState(false);

    // WYSHKIT 2026: Hydration Barrier
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleOpenChange = React.useCallback((val: boolean) => {
        if (onOpenChange) onOpenChange(val);
    }, [onOpenChange]);

    if (!mounted) return null;

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={handleOpenChange}>
                {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
                <DrawerContent className={cn("flex flex-col max-h-[92vh] border-t-0", className)}>
                    {(!lean && (title || description)) && (
                        <DrawerHeader className="text-left shrink-0 pb-4 border-b border-zinc-100/50">
                            {title && <DrawerTitle className="text-xl font-black tracking-tight text-zinc-900">{title}</DrawerTitle>}
                            {description && <DrawerDescription className="text-zinc-500">{description}</DrawerDescription>}
                        </DrawerHeader>
                    )}
                    <div
                        data-vaul-no-drag
                        className={cn(
                            "flex-1 overflow-y-auto overscroll-contain touch-pan-y scrollbar-none",
                            lean ? "px-0 pb-0" : "px-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]"
                        )}
                    >
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className={cn("sm:max-w-[425px]", lean ? "p-0 overflow-hidden" : "", className)} showCloseButton={showClose && !lean}>
                {(!lean && (title || description)) && (
                    <DialogHeader className="text-left">
                        {title && <DialogTitle className="text-xl font-black tracking-tight">{title}</DialogTitle>}
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                )}
                <div className={cn("overflow-y-auto", lean ? "max-h-[90vh]" : "max-h-[80vh]")}>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
