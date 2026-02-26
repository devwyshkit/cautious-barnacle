import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/webhooks/razorpay/route';
import { NextRequest } from 'next/server';
import { validateWebhookSignature } from '@/lib/services/razorpay';
import { createAdminClient } from '@/lib/supabase/server';
import { executeCommerceIntent } from '@/lib/actions/commerce/intent-engine';
import Razorpay from 'razorpay';

// Mock Dependencies
vi.mock('@/lib/services/razorpay', () => ({
    validateWebhookSignature: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
    createAdminClient: vi.fn(),
}));

vi.mock('@/lib/actions/commerce/orders', () => ({
    create_order: vi.fn(),
}));

// Fixed Constructor Mock
vi.mock('razorpay', () => {
    return {
        default: class {
            orders = {
                fetch: vi.fn().mockResolvedValue({
                    notes: { draftId: 'draft_123', userId: 'user_123' }
                })
            }
        }
    };
});

describe('Razorpay Webhook Contract Test', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.RAZORPAY_WEBHOOK_SECRET = 'test_secret';
        process.env.RAZORPAY_KEY_ID = 'test_key';
        process.env.RAZORPAY_KEY_SECRET = 'test_secret';
    });

    it('correctly handles payment.captured and calls create_order with snake_case', async () => {
        // 1. Mock validateWebhookSignature
        (validateWebhookSignature as any).mockReturnValue(true);

        // 2. Mock Supabase
        const mockSupabase = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: {
                    id: 'draft_123',
                    address_id: 'addr_123',
                    products: [{ product_id: 'product_1', quantity: 1 }],
                    metadata: { coupon_code: 'SAVE10', use_wallet: true }
                },
                error: null
            }),
            maybeSingle: vi.fn().mockResolvedValue({ data: null }) // No existing order
        };
        (createAdminClient as any).mockResolvedValue(mockSupabase);

        // 3. Mock create_order
        (executeCommerceIntent as any).mockResolvedValue({ success: true, order_id: 'order_123' });

        // 4. Construct Request
        const body = JSON.stringify({
            event: 'payment.captured',
            payload: {
                payment: {
                    entity: {
                        order_id: 'rzp_order_123',
                        id: 'rzp_pay_123'
                    }
                }
            }
        });

        const req = new NextRequest('http://localhost:3000/api/webhooks/razorpay', {
            method: 'POST',
            headers: { 'x-razorpay-signature': 'valid_sig' },
            body: body
        });

        const res = await POST(req);
        const resData = await res.json();

        // 5. Assertions
        expect(res.status).toBe(200);
        expect(resData.order_id).toBe('order_123');
        expect(executeCommerceIntent).toHaveBeenCalledWith(expect.objectContaining({
            address_id: 'addr_123',
            razorpay_order_id: 'rzp_order_123',
            payment_id: 'rzp_pay_123',
            coupon_code: 'SAVE10',
            use_wallet: true,
            useAdmin: true
        }));
    });

    it('prevents duplicate order creation (Idempotency)', async () => {
        (validateWebhookSignature as any).mockReturnValue(true);

        const mockSupabase = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { id: 'draft_123' } }),
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'existing_order_123' } })
        };
        (createAdminClient as any).mockResolvedValue(mockSupabase);

        const body = JSON.stringify({
            event: 'payment.captured',
            payload: {
                payment: { entity: { order_id: 'rzp_order_123', id: 'rzp_pay_123' } }
            }
        });

        const req = new NextRequest('http://localhost:3000/api/webhooks/razorpay', {
            method: 'POST',
            headers: { 'x-razorpay-signature': 'valid_sig' },
            body: body
        });

        const res = await POST(req);
        const resData = await res.json();

        expect(res.status).toBe(200);
        expect(resData.message).toBe('Order already processed');
        expect(executeCommerceIntent).not.toHaveBeenCalled();
    });
});
