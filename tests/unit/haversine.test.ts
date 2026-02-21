import { describe, it, expect } from 'vitest';
import { calculateHaversineDistance, calculateTravelTime } from '@/lib/utils/distance';

describe('Haversine Distance Calculation', () => {
    it('calculates Bangalore to Mysore ≈ 128km (straight-line)', () => {
        const d = calculateHaversineDistance(12.9716, 77.5946, 12.2958, 76.6394);
        expect(d).not.toBeNull();
        expect(d!).toBeGreaterThan(120);
        expect(d!).toBeLessThan(140);
    });

    it('calculates same point = 0km', () => {
        const d = calculateHaversineDistance(12.9716, 77.5946, 12.9716, 77.5946);
        expect(d).toBe(0);
    });

    it('returns null for missing coordinates', () => {
        expect(calculateHaversineDistance(null, 77.5, 12.9, 77.5)).toBeNull();
        expect(calculateHaversineDistance(12.9, null, 12.9, 77.5)).toBeNull();
        expect(calculateHaversineDistance(12.9, 77.5, null, 77.5)).toBeNull();
        expect(calculateHaversineDistance(12.9, 77.5, 12.9, null)).toBeNull();
    });

    it('calculates short hyperlocal distance ≈ 2-4km', () => {
        // Koramangala to Indiranagar (Bangalore neighborhoods)
        const d = calculateHaversineDistance(12.9352, 77.6245, 12.9719, 77.6412);
        expect(d).not.toBeNull();
        expect(d!).toBeGreaterThan(1);
        expect(d!).toBeLessThan(6);
    });
});

describe('Travel Time Estimation', () => {
    it('estimates travel time for 3km distance', () => {
        const time = calculateTravelTime(3);
        expect(time).not.toBeNull();
        expect(time!.min).toBeGreaterThanOrEqual(15);
        expect(time!.max).toBeGreaterThan(time!.min);
    });

    it('returns null for null distance', () => {
        expect(calculateTravelTime(null)).toBeNull();
        expect(calculateTravelTime(undefined)).toBeNull();
    });
});
