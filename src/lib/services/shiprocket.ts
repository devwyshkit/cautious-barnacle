import { logger } from '@/lib/logging/logger';

interface ShiprocketOrderPayload {
    order_id: string;
    order_date: string;
    pickup_location: string;
    billing_customer_name: string;
    billing_last_name: string;
    billing_address: string;
    billing_city: string;
    billing_pincode: string;
    billing_state: string;
    billing_country: string;
    billing_email: string;
    billing_phone: string;
    shipping_is_billing: boolean;
    order_items: Array<{
        name: string;
        sku: string;
        units: number;
        selling_price: number;
    }>;
    payment_method: 'Prepaid' | 'COD';
    sub_total: number;
    length: number;
    width: number;
    height: number;
    weight: number;
}

export const ShiprocketService = {
    getToken: async (): Promise<string | null> => {
        try {
            const email = process.env.SHIPROCKET_EMAIL;
            const password = process.env.SHIPROCKET_PASSWORD;

            if (!email || !password) {
                logger.error('Shiprocket credentials missing');
                return null;
            }

            const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                logger.error('Shiprocket login failed', data);
                return null;
            }

            return data.token;
        } catch (error) {
            logger.error('Shiprocket getToken error', error);
            return null;
        }
    },

    createOrder: async (payload: ShiprocketOrderPayload) => {
        try {
            const token = await ShiprocketService.getToken();
            if (!token) return { success: false, error: 'Authentication failed' };

            if (process.env.NODE_ENV === 'development') {
                logger.info(`[Shiprocket] DevMode: Order creation mocked for ${payload.order_id}`);
                return {
                    success: true,
                    order_id: `SR-MOCK-${Date.now()}`,
                    shipment_id: `SR-SHIP-MOCK-${Date.now()}`,
                    awb_code: `AWB-MOCK-${Date.now()}`
                };
            }

            const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) {
                logger.error('Shiprocket create order failed', data);
                return { success: false, error: data.message || 'API request failed' };
            }

            return {
                success: true,
                order_id: data.order_id,
                shipment_id: data.shipment_id,
                awb_code: data.awb_code
            };
        } catch (error) {
            logger.error('Shiprocket createOrder error', error);
            return { success: false, error: 'Internal service error' };
        }
    },

    trackOrder: async (awbCode: string) => {
        try {
            const token = await ShiprocketService.getToken();
            if (!token) return { success: false, error: 'Authentication failed' };

            const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) {
                logger.error('Shiprocket tracking failed', data);
                return { success: false, error: 'Tracking failed' };
            }

            return { success: true, tracking_data: data.tracking_data };
        } catch (error) {
            logger.error('Shiprocket trackOrder error', error);
            return { success: false, error: 'Internal service error' };
        }
    }
};
