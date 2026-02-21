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
 * WYSHKIT 2026: The "One Surface" Pattern
 * ResponsiveSurface unifies Drawers (Mobile) and Dialogs (Desktop).
 * Pattern: Elite Consolidation (Replace multiple components with one).
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
}

export function ResponsiveSurface({
    children,
    trigger,
    title,
    description,
    open,
    onOpenChange,
    className,
    showClose = true
}: ResponsiveSurfaceProps) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
                <DrawerContent className={cn("flex flex-col max-h-[92vh]", className)}>
                    {(title || description) && (
                        <DrawerHeader className="text-left shrink-0">
                            {title && <DrawerTitle className="text-xl font-black tracking-tight">{title}</DrawerTitle>}
                            {description && <DrawerDescription>{description}</DrawerDescription>}
                        </DrawerHeader>
                    )}
                    <div className="flex-1 overflow-y-auto px-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className={cn("sm:max-w-[425px]", className)} showCloseButton={showClose}>
                {(title || description) && (
                    <DialogHeader className="text-left">
                        {title && <DialogTitle className="text-xl font-black tracking-tight">{title}</DialogTitle>}
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                )}
                <div className="max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
