import { describe, it, expect, vi } from 'vitest';
import { calculateOrderTotalRPC } from '@/lib/actions/checkout/pricing';
import { createClient } from '@/lib/supabase/server';

// Mock Supabase Server Client
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(),
}));

describe('calculateOrderTotalRPC Contract Test', () => {
    it('correctly maps snake_case keys from database to PricingBreakdown', async () => {
        const mockRpcResponse = {
            data: {
                subtotal: 1000,
                personalization_charges: 50,
                delivery_fee: 40,
                platform_fee: 10,
                gst: 180,
                discount: 0,
                wallet_discount: 0,
                total: 1280
            },
            error: null
        };

        const mockSupabase = {
            rpc: vi.fn().mockResolvedValue(mockRpcResponse)
        };

        (createClient as any).mockResolvedValue(mockSupabase);

        const result = await calculateOrderTotalRPC([]);

        expect(result.data).toEqual({
            subtotal: 1000,
            personalization_charges: 50,
            delivery_fee: 40,
            platform_fee: 10,
            gst: 180,
            discount: 0,
            wallet_discount: 0,
            total: 1280
        });
    });

    it('handles legacy or missing keys gracefully with defaults', async () => {
        const mockRpcResponse = {
            data: {
                subtotal: 500,
                total: 510
                // Missing other keys
            },
            error: null
        };

        const mockSupabase = {
            rpc: vi.fn().mockResolvedValue(mockRpcResponse)
        };

        (createClient as any).mockResolvedValue(mockSupabase);

        const result = await calculateOrderTotalRPC([]);

        expect(result.data?.personalization_charges).toBe(0);
        expect(result.data?.delivery_fee).toBe(0);
        expect(result.data?.total).toBe(510);
    });
});
