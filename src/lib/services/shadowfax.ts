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
            const apiBase = process.env.SHADOWFAX_API_BASE_URL || 'https://api.shadowfax.in/v2'; // Production URL default

            // In development or if no key, return mock success for testing flow
            if (!apiKey || process.env.NODE_ENV === 'development') {
                logger.info(`[Shadowfax] DevMode: Order creation mocked for ${payload.order_id}`);
                return {
                    success: true,
                    awbNumber: `SFX-MOCK-${Date.now()}`,
                    trackingUrl: `https://track.shadowfax.in/track?order=${payload.order_id}`
                };
            }

            // Real API implementation
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
    }
};
