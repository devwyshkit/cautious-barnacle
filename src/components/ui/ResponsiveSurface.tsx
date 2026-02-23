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

// WYSHKIT 2026: Zero-Dependency Container Arbitration
let globalActiveSheetId: string | null = null;
const sheetListeners = new Set<() => void>();

function setGlobalActiveSheetId(id: string | null) {
    globalActiveSheetId = id;
    sheetListeners.forEach(notify => notify());
}

function useSheetArbiter() {
    const [activeSheetId, setActiveSheetId] = React.useState(globalActiveSheetId);

    React.useEffect(() => {
        const notify = () => setActiveSheetId(globalActiveSheetId);
        sheetListeners.add(notify);
        return () => { sheetListeners.delete(notify); };
    }, []);

    return { activeSheetId, setActiveSheetId: setGlobalActiveSheetId };
}

/**
 * WYSHKIT 2026: The "One Surface" Pattern w/ Container Arbitration
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
    open = false,
    onOpenChange,
    className,
    showClose = true
}: ResponsiveSurfaceProps) {
    const isMobile = useIsMobile();
    const componentId = React.useId();
    const { activeSheetId, setActiveSheetId } = useSheetArbiter();

    // WYSHKIT 2026: Container Arbitration Lock
    // Background sheets logically close when a new sheet claims the token.
    React.useEffect(() => {
        if (open) {
            setActiveSheetId(componentId);
        } else if (activeSheetId === componentId) {
            setActiveSheetId(null);
        }
    }, [open, componentId, setActiveSheetId]); // Intentionally omitting activeSheetId from deps

    const isActuallyOpen = open && activeSheetId === componentId;

    const handleOpenChange = React.useCallback((val: boolean) => {
        if (onOpenChange) onOpenChange(val);
        if (!val && activeSheetId === componentId) {
            setActiveSheetId(null);
        }
    }, [onOpenChange, activeSheetId, componentId, setActiveSheetId]);

    if (isMobile) {
        return (
            <Drawer open={isActuallyOpen} onOpenChange={handleOpenChange}>
                {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
                <DrawerContent className={cn("flex flex-col max-h-[92vh]", className)}>
                    {(title || description) && (
                        <DrawerHeader className="text-left shrink-0">
                            {title && <DrawerTitle className="text-xl font-black tracking-tight">{title}</DrawerTitle>}
                            {description && <DrawerDescription>{description}</DrawerDescription>}
                        </DrawerHeader>
                    )}
                    <div
                        data-vaul-no-drag
                        className="flex-1 overflow-y-auto px-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] overscroll-contain touch-pan-y"
                    >
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={isActuallyOpen} onOpenChange={handleOpenChange}>
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
