import { logger } from './logging/logger';

/**
 * WYSHKIT 2026: Environment Validation
 * Ensures critical external services are configured.
 */

const REQUIRED_ENV_VARS = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'GOOGLE_MAPS_API_KEY',
] as const;

export function validateEnv() {
    const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

    if (missing.length > 0) {
        logger.error('CRITICAL: Missing environment variables', { missing });
        if (process.env.NODE_ENV === 'production') {
            throw new Error(`Critical environment variables missing: ${missing.join(', ')}`);
        }
    }
}

/**
 * Optional vars that trigger warnings if missing but don't halt production
 */
const RECOMMENDED_ENV_VARS = [
    'SHADOWFAX_API_KEY',
    'RAZORPAY_X_ACCOUNT_NUMBER',
] as const;

export function checkRecommendedEnv() {
    const missing = RECOMMENDED_ENV_VARS.filter(key => !process.env[key]);
    if (missing.length > 0) {
        logger.warn('Recommended environment variables missing', { missing });
    }
}

export function getSupabaseEnv() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        const missing = [];
        if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
        if (!key) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
        throw new Error(
            `Missing required Supabase environment variables: ${missing.join(', ')}. ` +
            'Please check your .env.local file.'
        );
    }
    return { url, key };
}

export function getSupabaseEnvSafe() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return { url, key };
}
