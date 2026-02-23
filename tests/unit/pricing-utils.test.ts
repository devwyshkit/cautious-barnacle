import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils/pricing';

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
