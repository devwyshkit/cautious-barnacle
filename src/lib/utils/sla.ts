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

export function getDeliverySLASignal(product: any): SLASignal | null {
    const category = product.category?.toLowerCase();
    const productionTime = product.production_time_minutes;

    if (category === 'flowers' || category === 'cakes') {
        return {
            type: 'fast',
            text: 'Perishable: Fast SLA',
            colorClass: 'text-[var(--warning)]',
            // icon defined in component to avoid React element serialization issues if needed, 
            // but for simple cases we can return the node
        };
    }

    if (productionTime && productionTime <= 45) {
        return {
            type: 'fast',
            text: `${productionTime} mins prep`,
            colorClass: 'text-[var(--success)]',
        };
    }

    return null;
}

export function getStockSLASignal(product: any): SLASignal | null {
    const stockQuantity = product.stock_quantity;
    const isPersonalizable = product.has_personalization || (product.personalization_options?.length > 0);

    // WYSHKIT 2026: Only show scarcity for non-personalized products (physical stock matters)
    if (!isPersonalizable && typeof stockQuantity === 'number' && stockQuantity > 0 && stockQuantity <= 3) {
        return {
            type: 'scarcity',
            text: `Only ${stockQuantity} left`,
            colorClass: 'text-[var(--warning)]',
        };
    }

    return null;
}



/**
 * WYSHKIT 2026: Geo Utilities
 * Consistently uses Haversine formula for distance estimation.
 */
export function calculateHaversineDistance(
    lat1: number | null | undefined,
    lon1: number | null | undefined,
    lat2: number | null | undefined,
    lon2: number | null | undefined
): number | null {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
        return null;
    }

    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function calculateTravelTime(distanceKm?: number | null): { min: number; max: number } | null {
    if (distanceKm == null || distanceKm === undefined) return null;

    // WYSHKIT 2026: ~5 mins per 1km in city traffic + 10 mins buffer.
    const baseMins = Math.ceil(distanceKm * 5);
    return {
        min: baseMins + 5,
        max: baseMins + 10
    };
}

/**
 * WYSHKIT 2026: Time > Distance Philosophy
 * Centralized formatting for arrival windows and prep times.
 * Rule: Always favor "Arriving by 5:30 PM" over "30-40 mins".
 */

export function formatPrepTime(prepMins: number): string {
    if (prepMins < 60) {
        return `${Math.round(prepMins)}m`;
    }
    const hours = prepMins / 60;
    return hours % 1 === 0 ? `${hours}h` : `${hours.toFixed(1)}h`;
}

/**
 * @deprecated WYSHKIT 2026: Use formatArrivalTime instead for customer-facing SLA.
 * Only use for internal courier metrics.
 */
export function formatDeliveryTime(min: number, max: number): string {
    return `${min}-${max} mins`;
}

/**
 * Validates and formats the server-driven ETA signal.
 * Example input: "2026-02-25T17:15:00Z"
 * Output: "Arriving by 5:15 PM"
 */
export function formatArrivalTime(eta?: string | null): string {
    if (!eta) return 'Arriving soon';

    try {
        const date = new Date(eta);
        if (isNaN(date.getTime())) return 'Arriving soon';

        return `Arriving by ${date.toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })}`;
    } catch (e) {
        return 'Arriving soon';
    }
}
