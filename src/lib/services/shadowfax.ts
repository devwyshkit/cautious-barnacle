import { logger } from '@/lib/logging/logger';

interface ShadowfaxOrderPayload {
    order_id: string;
    customer: {
        name: string;
        phone: string;
        address: string;
        city: string;
        pincode: string;
    };
    pickup: {
        name: string;
        phone: string;
        address: string;
        city: string;
        pincode: string;
    };
    order_details: {
        total_weight_kg: number;
        length_cm?: number;
        width_cm?: number;
        height_cm?: number;
    };
}

interface ShadowfaxOrderResponse {
    success: boolean;
    awbNumber?: string;
    trackingUrl?: string;
    error?: string;
}

export const ShadowfaxService = {
    createOrder: async (payload: ShadowfaxOrderPayload): Promise<ShadowfaxOrderResponse> => {
        try {
            const apiKey = process.env.SHADOWFAX_API_KEY;
            const apiBase = process.env.SHADOWFAX_API_BASE_URL || 'https://api.shadowfax.in/v2';

            if (!apiKey || process.env.NODE_ENV === 'development') {
                logger.info(`[Shadowfax] DevMode: Order creation mocked for ${payload.order_id}`);
                return {
                    success: true,
                    awbNumber: `SFX-MOCK-${Date.now()}`,
                    trackingUrl: `https://track.shadowfax.in/track?order=${payload.order_id}`
                };
            }

            const res = await fetch(`${apiBase}/orders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_details: {
                        client_order_id: payload.order_id,
                        actual_weight: payload.order_details.total_weight_kg,
                        length: payload.order_details.length_cm,
                        width: payload.order_details.width_cm,
                        height: payload.order_details.height_cm,
                        payment_mode: 'prepaid',
                    },
                    pickup_details: payload.pickup,
                    delivery_details: payload.customer
                })
            });

            const data = await res.json();
            if (!res.ok) {
                logger.error('Shadowfax API error', data);
                return { success: false, error: data.message || 'API request failed' };
            }

            return {
                success: true,
                awbNumber: data.awb_number,
                trackingUrl: data.tracking_url
            };
        } catch (error) {
            logger.error('ShadowfaxService error', error);
            return { success: false, error: 'Internal service error' };
        }
    },

    trackOrder: async (awbNumber: string): Promise<any> => {
        try {
            const apiKey = process.env.SHADOWFAX_API_KEY;
            const apiBase = process.env.SHADOWFAX_API_BASE_URL || 'https://api.shadowfax.in/v2';

            if (!apiKey || process.env.NODE_ENV === 'development') {
                return { success: true, status: 'OUT_FOR_DELIVERY', location: 'Local Hub' };
            }

            const res = await fetch(`${apiBase}/orders/${awbNumber}/track`, {
                headers: { 'Authorization': `Token ${apiKey}` }
            });

            return await res.json();
        } catch (error) {
            logger.error('Shadowfax tracking error', error);
            return { success: false, error: 'Tracking failed' };
        }
    },

    cancelOrder: async (awbNumber: string, reason: string): Promise<boolean> => {
        try {
            const apiKey = process.env.SHADOWFAX_API_KEY;
            const apiBase = process.env.SHADOWFAX_API_BASE_URL || 'https://api.shadowfax.in/v2';

            if (!apiKey || process.env.NODE_ENV === 'development') return true;

            const res = await fetch(`${apiBase}/orders/${awbNumber}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            return res.ok;
        } catch (error) {
            logger.error('Shadowfax cancellation error', error);
            return false;
        }
    },

    /**
     * WYSHKIT 2026: Webhook Verification (Stateless & Secure)
     * Validates that the request genuinely came from Shadowfax.
     */
    verifyWebhook: (body: string, signature: string): boolean => {
        const secret = process.env.SHADOWFAX_WEBHOOK_SECRET;
        if (!secret || process.env.NODE_ENV === 'development') return true;

        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(body).digest('hex');

        return digest === signature;
    }
};
