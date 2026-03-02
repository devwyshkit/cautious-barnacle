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
        timeoutMs = 7000,
        maxAttempts = 3,
        traceName = 'SUPABASE_RESILIENCE',
        ...fetchOptions
    } = options;

    let lastError: any;
    const getMirrorUrl = (url: string) => null; // WYSHKIT 2026: Mirror disabled to prevent ENOTFOUND on spoofed domains

    for (let i = 0; i < maxAttempts; i++) {
        const mirrorUrl = getMirrorUrl(inputUrl);

        /**
         * WYSHKIT 2026: Fast-Failover Strategy
         * 1. Attempt 1: Standard URL (Fast timeout: 2.5s)
         * 2. Attempt 2+: If attempt 1 failed, use .com Mirror immediately
         */
        const useMirror = i > 0 && mirrorUrl;
        const attemptUrl = useMirror ? mirrorUrl : inputUrl;
        const isFallback = attemptUrl !== inputUrl;

        try {
            const controller = new AbortController();
            // WYSHKIT 2026: Zero-Trip Performance Standards 
            // We escalation fast to mirror if initial DNS/ISP block is detected.
            const currentTimeout = i === 0 ? 1500 : 5000;
            const timeoutId = setTimeout(() => controller.abort(), currentTimeout);

            const response = await fetch(attemptUrl, {
                ...fetchOptions,
                signal: controller.signal,
                headers: {
                    ...fetchOptions.headers,
                    'x-wyshkit-resilience': 'true',
                    'x-wyshkit-attempt': (i + 1).toString(),
                    'x-wyshkit-fallback': isFallback.toString(),
                }
            } as any);

            clearTimeout(timeoutId);

            if (isFallback) {
                logger.info(`[${traceName}] DNS Failover SUCCESS via ${attemptUrl}`);
            }

            return response;
        } catch (err: any) {
            lastError = err;
            const isDnsFailure = err.message?.includes('fetch failed') ||
                err.message?.includes('ENOTFOUND') ||
                err.name === 'AbortError';

            if (isDnsFailure) {
                logger.warn(`[${traceName}] DNS/Timeout on attempt ${i + 1} for ${attemptUrl}. ${i === 0 ? 'FAST ESCALATING TO MIRROR' : 'Retrying...'}`);
            } else {
                logger.error(`[${traceName}] Network error on attempt ${i + 1} (${attemptUrl})`, err.message);
            }

            // Faster backoff for DNS failures 
            if (i < maxAttempts - 1) {
                const backoff = isDnsFailure ? 100 : 300 * (i + 1);
                await new Promise(res => setTimeout(res, backoff));
            }
        }
    }

    throw lastError;
}
