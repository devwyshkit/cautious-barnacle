import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addToCart, getCart } from '@/lib/actions/draft-order';
import { createClient } from '@/lib/supabase/server';

// Mock Supabase Server Client
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(),
    createAdminClient: vi.fn(),
}));

// Mock Next.js cache
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

// Mock Session
vi.mock('@/lib/session', () => ({
    getGuestSessionId: vi.fn(() => Promise.resolve('guest-123')),
    getGuestSessionIdReadOnly: vi.fn(() => Promise.resolve('guest-123')),
}));

describe('Draft Order Integration Tests', () => {
    let mockSupabase: any;

    beforeEach(() => {
        vi.clearAllMocks();

        const createMockBuilder = (table: string) => {
            const builder: any = {
                select: vi.fn().mockImplementation(() => builder),
                eq: vi.fn().mockImplementation(() => builder),
                order: vi.fn().mockImplementation(() => builder),
                limit: vi.fn().mockImplementation(() => builder),
                or: vi.fn().mockImplementation(() => builder),
                maybeSingle: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
                single: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
                then: vi.fn().mockImplementation((onFulfilled: any) => Promise.resolve({ data: [], error: null }).then(onFulfilled)),
                insert: vi.fn().mockImplementation(() => builder),
                update: vi.fn().mockImplementation(() => builder),
            };
            return builder;
        };

        const builders: Record<string, any> = {
            items: createMockBuilder('items'),
            cart_items: createMockBuilder('cart_items'),
            variants: createMockBuilder('variants'),
            v_active_cart_totals: createMockBuilder('v_active_cart_totals'),
            cart_reservations: createMockBuilder('cart_reservations'),
        };

        mockSupabase = {
            auth: {
                getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
            },
            from: vi.fn().mockImplementation((table: string) => builders[table] || createMockBuilder(table)),
            rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
        };

        (createClient as any).mockResolvedValue(mockSupabase);
        (mockSupabase as any).builders = builders;
    });

    it('addToCart enforces MAX_ITEM_QUANTITY (10)', async () => {
        const { builders } = (mockSupabase as any);

        builders.items.maybeSingle.mockResolvedValue({
            data: { partner_id: 'partner-1', is_active: true },
            error: null
        });

        mockSupabase.rpc.mockResolvedValue({ data: 100, error: null });
        builders.cart_items.then.mockImplementation((fn: any) => Promise.resolve(fn({ data: [], error: null })));
        builders.cart_items.single.mockResolvedValue({ data: { id: 'new-row' }, error: null });

        const result = await addToCart({
            item_id: 'item-123',
            quantity: 15
        });

        expect(builders.cart_items.insert).toHaveBeenCalledWith(expect.objectContaining({
            quantity: 10
        }));
    });

    it('addToCart prevents partner mismatch', async () => {
        const { builders } = (mockSupabase as any);
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });

        builders.items.maybeSingle.mockResolvedValueOnce({ data: { partner_id: 'partner-2', is_active: true }, error: null })
            .mockResolvedValueOnce({ data: { partner_id: 'partner-1' }, error: null });

        builders.cart_items.then.mockImplementation((fn: any) => Promise.resolve(fn({
            data: [{ item_id: 'existing-item' }],
            error: null
        })));

        mockSupabase.rpc.mockResolvedValue({ data: 10, error: null });

        const result = await addToCart({
            item_id: 'new-item',
            quantity: 1
        });

        expect(result).toEqual(expect.objectContaining({
            error: 'Transaction already in progress with another partner',
            code: 'PARTNER_MISMATCH'
        }));
    });

    it('getCart correctly maps and sums items', async () => {
        const { builders } = (mockSupabase as any);
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });

        builders.v_active_cart_totals.maybeSingle.mockResolvedValue({
            data: { pricing: { subtotal: 1000, total: 1100 } },
            error: null
        });

        const itemsData = [
            {
                id: 'row-1',
                item_id: 'item-1',
                quantity: 2,
                items: {
                    name: 'Item 1',
                    base_price: 500,
                    partner_id: 'partner-1',
                    partners: { name: 'Store 1' }
                }
            }
        ];

        // Mocking .then is essential for getCart since it awaits the query chain
        builders.cart_items.then.mockImplementation((fn: any) => Promise.resolve(fn({ data: itemsData, error: null })));

        const result = await getCart();

        expect(result.cart?.item_count).toBe(2);
        expect(result.cart?.total).toBe(1100);
        expect(result.cart?.items[0].item_name).toBe('Item 1');
    });
});
