'use client';

import React from 'react';
import { FloatingCartBar } from './FloatingCartBar';
import { OrderTrackingBar } from './OrderTrackingBar';
import { cn } from '@/lib/utils';

/**
 * WYSHKIT 2026: FloatingStack Orchestrator
 * Manages the spatial stacking of bottom-floating pills.
 * Prevents UI layout jitters and ensures a unified design voice.
 */
export function FloatingStack({ activeOrders }: { activeOrders?: any[] }) {
    return (
        <div className={cn(
            "fixed z-[var(--z-floating)] left-1/2 -translate-x-1/2 w-max",
            "bottom-[var(--floating-bottom-safe)]",
            "flex flex-col items-center gap-[var(--floating-gap)]",
            "pointer-events-none" // Container is transparent to touch, children are interactive
        )}>
            {/* 
         WYSHKIT 2026 Stacking Logic:
         Tracking Bar on TOP of Cart Bar (Higher priority/temporal context)
         Cart Bar below (Persistent intent)
      */}
            <div className="pointer-events-auto">
                <OrderTrackingBar initialOrders={activeOrders} isStacked={true} />
            </div>
            <div className="pointer-events-auto">
                <FloatingCartBar isStacked={true} />
            </div>
        </div>
    );
}
