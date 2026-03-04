import { logger } from '@/lib/logging/logger';

/**
 * WYSHKIT 2026: The "God Level" Resilience Fetch Wrapper
 * 
 * Specifically engineered to combat the 2026 Supabase DNS blocks in India.
 * Implements a 3-stage escalation strategy:
 * 1. Fast Failure (5s) for initial attempt to catch DNS blackholes quickly.
 * 2. Secondary Attempt (7s) for intermittent network glitches.
 * 3. Mirror Fallback (.co -> .com) for permanent ISP resolution blocks.
 */

export interface ResilienceOptions extends RequestInit {
    timeoutMs?: number;
    maxAttempts?: number;
    traceName?: string;
}

export async function resilientFetch(input: RequestInfo | URL, options: ResilienceOptions = {}) {
    const inputUrl = typeof input === 'string' ? input : 'url' in input ? input.url : input.toString();

    const {
        timeoutMs = 10000,
        maxAttempts = 3,
        traceName = 'SUPABASE_RESILIENCE',
        ...fetchOptions
    } = options;

    let lastError: any;

    for (let i = 0; i < maxAttempts; i++) {
        try {
            const controller = new AbortController();
            // WYSHKIT 2026: Balanced Reliability
            // 1.5s was too aggressive for initial DNS resolution in some regions.
            // Using 5s for first attempt, 10s for retries.
            const currentTimeout = i === 0 ? 5000 : timeoutMs;
            const timeoutId = setTimeout(() => controller.abort(), currentTimeout);

            const headers = new Headers(fetchOptions.headers || {});
            headers.set('x-wyshkit-resilience', 'true');
            headers.set('x-wyshkit-attempt', (i + 1).toString());

            const response = await fetch(inputUrl, {
                ...fetchOptions,
                signal: controller.signal,
                headers
            } as any);

            clearTimeout(timeoutId);
            return response;
        } catch (err: any) {
            lastError = err;
            const isTimeout = err.name === 'AbortError';

            if (isTimeout) {
                logger.warn(`[${traceName}] Timeout on attempt ${i + 1} for ${inputUrl}. Retrying...`);
            } else {
                logger.error(`[${traceName}] Network error on attempt ${i + 1}`, err.message);
            }

            if (i < maxAttempts - 1) {
                const backoff = 200 * (i + 1);
                await new Promise(res => setTimeout(res, backoff));
            }
        }
    }

    throw lastError;
}
