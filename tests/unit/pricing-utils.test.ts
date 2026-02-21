import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils/pricing';
import { PRICING } from '@/lib/constants/pricing';

describe('formatCurrency', () => {
    it('formats zero correctly', () => {
        expect(formatCurrency(0)).toBe('₹0');
    });

    it('formats whole numbers without decimals', () => {
        expect(formatCurrency(100)).toBe('₹100');
        expect(formatCurrency(1500)).toBe('₹1,500');
    });

    it('formats large numbers with Indian grouping', () => {
        expect(formatCurrency(100000)).toBe('₹1,00,000');
        expect(formatCurrency(1234567)).toBe('₹12,34,567');
    });

    it('rounds decimals per config', () => {
        const result = formatCurrency(99.9);
        expect(result).toBe('₹100');
    });
});

describe('PRICING constants', () => {
    it('has reasonable delivery fee tiers (ascending by distance)', () => {
        expect(PRICING.DEPRECATED_ESTIMATE_DELIVERY_FEE_3KM).toBeLessThan(PRICING.DEPRECATED_ESTIMATE_DELIVERY_FEE_5KM);
        expect(PRICING.DEPRECATED_ESTIMATE_DELIVERY_FEE_5KM).toBeLessThan(PRICING.DEPRECATED_ESTIMATE_DELIVERY_FEE_7KM);
        expect(PRICING.DEPRECATED_ESTIMATE_DELIVERY_FEE_7KM).toBeLessThan(PRICING.DEPRECATED_ESTIMATE_DELIVERY_FEE_ABOVE_7KM);
    });

    it('platform fee is a positive number', () => {
        expect(PRICING.DEPRECATED_ESTIMATE_PLATFORM_FEE).toBeGreaterThan(0);
    });

    it('high value threshold is sensible', () => {
        expect(PRICING.DEPRECATED_ESTIMATE_HIGH_VALUE_THRESHOLD).toBeGreaterThanOrEqual(10000);
    });
});
