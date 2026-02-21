'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logging/logger'

export async function checkServiceability(pincode: string) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('serviceable_pincodes')
            .select('is_active, estimated_delivery_days')
            .eq('pincode', pincode)
            .maybeSingle()

        if (error || !data) {
            if (process.env.NODE_ENV === 'development') {
                return {
                    isServiceable: true,
                    estimatedDays: 4,
                    message: 'Delivery available (Dev fallback)'
                }
            }
            return {
                isServiceable: false,
                message: 'Sorry, we do not deliver to this location yet.'
            }
        }

        if (!data.is_active) {
            return {
                isServiceable: false,
                message: 'Delivery to this location is temporarily suspended.'
            }
        }

        return {
            isServiceable: true,
            estimatedDays: data.estimated_delivery_days
        }
    } catch (error) {
        logger.error('Error checking serviceability', error, { pincode })
        return { isServiceable: false, message: 'Error checking serviceability' }
    }
}
