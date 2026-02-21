import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@/lib/supabase/server';
import { create_payment_order, verify_payment_signature } from '@/lib/actions/payment';

// Mock Razorpay
vi.mock('@/lib/services/razorpay', () => ({
    create_razorpay_order: vi.fn().mockResolvedValue({ id: 'order_rzp_123', amount: 1000, currency: 'INR' }),
    verify_payment: vi.fn().mockResolvedValue(true)
}));

// Mock API Actions used within payment flow
vi.mock('@/lib/actions/pricing', () => ({
    calculateOrderTotalRPC: vi.fn().mockResolvedValue({
        data: {
            subtotal: 100,
            delivery_fee: 40,
            platform_fee: 10,
            gst: 18,
            total: 168,
            discount: 0,
            wallet_discount: 0
        },
        error: null
    })
}));

// Mock Orders Actions
vi.mock('@/lib/actions/orders', () => ({
    create_order: vi.fn().mockResolvedValue({
        success: true,
        order_id: 'test-order-id-123',
        order_number: 'WSH-260221-XXXX',
        has_personalization: false,
        order: { id: 'test-order-id-123' }
    }),
    get_order_with_history: vi.fn().mockResolvedValue({ order: { id: 'test-order-id-123' } })
}));

// Mock Supabase Server Client
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(),
    createAdminClient: vi.fn(),
}));

describe('Checkout Intent Flow Automation', () => {
    let mockSupabase: any;
    let builders: Record<string, any>;

    beforeEach(() => {
        vi.clearAllMocks();

        const createMockBuilder = (table: string) => {
            const builder: any = {
                select: vi.fn().mockImplementation(() => builder),
                eq: vi.fn().mockImplementation(() => builder),
                insert: vi.fn().mockImplementation(() => builder),
                delete: vi.fn().mockImplementation(() => builder),
                single: vi.fn().mockImplementation(() => Promise.resolve({ data: { id: 'draft_123' }, error: null })),
                maybeSingle: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null }))
            };
            return builder;
        };

        builders = {
            draft_orders: createMockBuilder('draft_orders'),
            stock_reservations: createMockBuilder('stock_reservations'),
            orders: createMockBuilder('orders'),
        };

        mockSupabase = {
            auth: {
                getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
            },
            from: vi.fn().mockImplementation((table: string) => builders[table]),
            rpc: vi.fn().mockImplementation((rpcName: string) => {
                if (rpcName === 'get_available_stock') return Promise.resolve({ data: 10, error: null });
                return Promise.resolve({ data: null, error: null });
            }),
        };

        (createClient as any).mockResolvedValue(mockSupabase);
    });

    it('creates payment order matching strict DB requirements securely', async () => {
        const payload = {
            address_id: 'address-123',
            draft_items: [
                {
                    item_id: 'item-123',
                    selected_variant_id: 'variant-123',
                    quantity: 1,
                    personalization: { enabled: true, option_id: 'opt1' },
                    selected_addons: []
                }
            ],
            pricing: {
                subtotal: 100,
                delivery_fee: 40,
                platform_fee: 10,
                gst: 18,
                total: 168,
                discount: 0,
                wallet_discount: 0,
                personalization_charges: 0
            },
            use_wallet: false,
        };

        const result = await create_payment_order(16800, 'INR', payload as any);

        expect(result.error).toBeNull();
        expect(result.order?.id).toBe('order_rzp_123');
        expect(builders.draft_orders.insert).toHaveBeenCalled();
        expect(builders.stock_reservations.insert).toHaveBeenCalled();
        expect(mockSupabase.rpc).toHaveBeenCalledWith('get_available_stock', expect.any(Object));
    });

    it('verifies intent and deterministically creates the final order without overengineering', async () => {
        // Assume Draft gets fetched by single()
        builders.draft_orders.single.mockResolvedValue({
            data: {
                id: 'draft_123',
                address_id: 'address-123',
                items: [{ item_id: 'item-123', quantity: 1, selected_variant_id: 'variant-123' }],
                metadata: { coupon_code: null, use_wallet: false }
            },
            error: null
        });

        // Test signature logic
        const response = await verify_payment_signature(
            'order_rzp_123',
            'pay_123',
            'valid_signature',
            { draft_id: 'draft_123' }
        );

        expect(response.success).toBe(true);
        expect(response.order_id).toBe('test-order-id-123');
        // Confirms cleanup happened
        expect(builders.draft_orders.delete).toHaveBeenCalled();

        // Ensure create_order was triggered properly passing the baton
        const { create_order } = await import('@/lib/actions/orders');
        expect(create_order).toHaveBeenCalledWith(expect.objectContaining({
            razorpay_order_id: 'order_rzp_123',
            user_id: 'user-123',
            items: expect.any(Array)
        }));
    });
});
