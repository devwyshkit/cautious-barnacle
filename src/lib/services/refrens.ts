import { logger } from '@/lib/logging/logger';

interface RefrensInvoicePayload {
    order_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    address: string;
    items: Array<{
        name: string;
        quantity: number;
        rate: number;
        tax_percent?: number;
    }>;
}

export const RefrensService = {
    createInvoice: async (payload: RefrensInvoicePayload) => {
        try {
            const appId = process.env.REFRENS_APP_ID;
            const appSecret = process.env.REFRENS_APP_SECRET;
            const urlKey = process.env.REFRENS_URL_KEY;

            if (!appId || !appSecret || !urlKey) {
                logger.error('Refrens credentials missing');
                return { success: false, error: 'Configuration missing' };
            }

            if (process.env.NODE_ENV === 'development') {
                logger.info(`[Refrens] DevMode: Invoice mocked for ${payload.order_id}`);
                return {
                    success: true,
                    invoice_id: `INV-MOCK-${Date.now()}`,
                    invoice_url: `https://www.refrens.com/invoice/mock-${payload.order_id}`
                };
            }

            // Implementation would typically involve signing a request or using an API key
            // Based on the provided keys, it seems to be a standard REST API with App ID/Secret
            const response = await fetch(`https://api.refrens.com/v1/invoices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-App-Id': appId,
                    'X-App-Secret': appSecret
                },
                body: JSON.stringify({
                    url_key: urlKey,
                    ...payload
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                logger.error('Refrens invoice creation failed', data);
                return { success: false, error: data.message || 'API request failed' };
            }

            return {
                success: true,
                invoice_id: data.invoice_id,
                invoice_url: data.invoice_url
            };
        } catch (error) {
            logger.error('RefrensService error', error);
            return { success: false, error: 'Internal service error' };
        }
    }
};
