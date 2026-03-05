import { logger } from '@/lib/logging/logger';

export const IdfyService = {
    verifyIdentity: async (payload: any) => {
        try {
            const accountId = process.env.IDFY_ACCOUNT_ID;
            const apiKey = process.env.IDFY_API_KEY;
            const baseUrl = process.env.IDFY_BASE_URL || 'https://eve.idfy.com/v3';

            if (!accountId || !apiKey) {
                logger.error('Idfy credentials missing');
                return { success: false, error: 'Configuration missing' };
            }

            if (process.env.NODE_ENV === 'development') {
                logger.info(`[Idfy] DevMode: Identity verification mocked`);
                return { success: true, request_id: `IDFY-MOCK-${Date.now()}` };
            }

            const response = await fetch(`${baseUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey,
                    'account-id': accountId
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) {
                logger.error('Idfy verification failed', data);
                return { success: false, error: data.message || 'API request failed' };
            }

            return { success: true, data };
        } catch (error) {
            logger.error('IdfyService error', error);
            return { success: false, error: 'Internal service error' };
        }
    }
};
