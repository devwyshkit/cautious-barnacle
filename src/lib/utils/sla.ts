import { Flame, Sparkles, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

/**
 * WYSHKIT 2026: Standardized SLA Utility
 * Ensures transparent and consistent delivery signals across the platform.
 */

export interface SLASignal {
    type: 'fast' | 'scarcity' | 'standard';
    text: string;
    icon?: React.ReactNode;
    colorClass: string;
}

export function getDeliverySLASignal(item: any): SLASignal | null {
    const category = item.category?.toLowerCase();
    const productionTime = item.production_time_minutes;

    if (category === 'flowers' || category === 'cakes') {
        return {
            type: 'fast',
            text: 'Perishable: Fast SLA',
            colorClass: 'text-orange-500',
            // icon defined in component to avoid React element serialization issues if needed, 
            // but for simple cases we can return the node
        };
    }

    if (productionTime && productionTime <= 45) {
        return {
            type: 'fast',
            text: `${productionTime} mins prep`,
            colorClass: 'text-emerald-500',
        };
    }

    return null;
}

export function getStockSLASignal(item: any): SLASignal | null {
    const stockQuantity = item.stock_quantity;
    const isPersonalizable = item.has_personalization || (item.personalization_options?.length > 0);

    // Swiggy 2026: Only show scarcity for non-personalized items (physical stock matters)
    if (!isPersonalizable && typeof stockQuantity === 'number' && stockQuantity > 0 && stockQuantity <= 3) {
        return {
            type: 'scarcity',
            text: `Only ${stockQuantity} left`,
            colorClass: 'text-amber-600',
        };
    }

    return null;
}

export function calculateTravelTime(distanceKm?: number): { min: number; max: number } | null {
    if (!distanceKm) return null;

    // Standard hyperlocal speed: ~4-5 mins per km + 10 mins base prep/buffer
    const baseTime = 10;
    const travelTime = distanceKm * 5;

    const min = Math.round(baseTime + travelTime);
    const max = min + 10;

    return { min, max };
}

/**
 * WYSHKIT 2026: SLA & Time Utilities
 * Centralized formatting for delivery and prep times.
 */

export function formatPrepTime(prepHours: number): string {
    if (prepHours < 1) {
        return `${Math.round(prepHours * 60)}m`;
    }
    return `${prepHours}h`;
}

export function formatDeliveryTime(min: number, max: number): string {
    return `${min}-${max} mins`;
}
