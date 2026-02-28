'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logging/logger'

export async function checkServiceability(pincode: string) {
    try {
        const supabase = await createClient()

        // WYSHKIT 2026: Serviceability is moving to distance-based via PostGIS.
        // Pincode check is a legacy fallback.
        const { data, error } = await (supabase as any)
            .from('serviceable_pincodes')
            .select('is_active, estimated_delivery_days')
            .eq('pincode', pincode)
            .maybeSingle();

        if (error || !data) {
            // Hyperlocal Default: If no restriction exists, we assume serviceable within range
            // UI will block later based on actual vendor distance.
            return {
                isServiceable: true,
                estimatedDays: 1, // Default to same-day/next-day for hyperlocal
                message: process.env.NODE_ENV === 'development' ? 'Delivery available (Hyperlocal Fallback)' : undefined
            }
        }

        return {
            isServiceable: !!data.is_active,
            estimatedDays: data.estimated_delivery_days || 1,
            message: data.is_active ? undefined : 'Delivery to this location is temporarily suspended.'
        }
    } catch (error) {
        logger.error('Error checking serviceability', error, { pincode })
        return { isServiceable: false, message: 'Error checking serviceability' }
    }
}
