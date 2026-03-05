import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyStockAvailability } from '@/lib/actions/commerce/inventory';

// WYSHKIT 2026: Stock Validation Unit Tests
// Ensures we catch stock issues before users commit to payment.

const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => Promise.resolve({
        from: mockFrom
    }))
}));

describe('verifyStockAvailability', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return success when stock is sufficient for base product', async () => {
        mockSingle.mockResolvedValueOnce({
            data: { stock_quantity: 10, name: 'Test Product' },
            error: null
        });

        const result = await verifyStockAvailability([{ product_id: 'p1', quantity: 2 }]);

        expect(result.success).toBe(true);
        expect(mockFrom).toHaveBeenCalledWith('products');
    });

    it('should return failure when stock is insufficient for base product', async () => {
        mockSingle.mockResolvedValueOnce({
            data: { stock_quantity: 1, name: 'In-demand Product' },
            error: null
        });

        const result = await verifyStockAvailability([{ product_id: 'p1', quantity: 5 }]);

        expect(result.success).toBe(false);
        expect(result.outOfStockProduct).toBe('In-demand Product');
    });

    it('should return failure when a variant is out of stock', async () => {
        mockSingle.mockResolvedValueOnce({
            data: { stock_quantity: 0, name: 'Red Variant' },
            error: null
        });

        const result = await verifyStockAvailability([{ product_id: 'p1', variant_id: 'v1', quantity: 1 }]);

        expect(result.success).toBe(false);
        expect(result.outOfStockProduct).toBe('Red Variant');
        expect(mockFrom).toHaveBeenCalledWith('product_variants');
    });

    it('should handle null stock as "infinite" (default behavior)', async () => {
        mockSingle.mockResolvedValueOnce({
            data: { stock_quantity: null, name: 'Unlimited Product' },
            error: null
        });

        const result = await verifyStockAvailability([{ product_id: 'p1', quantity: 100 }]);

        expect(result.success).toBe(true);
    });
});
