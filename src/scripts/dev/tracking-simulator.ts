import { createAdminClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { ORDER_STATUS } from '@/lib/types/order-status';

/**
 * TrackingSimulator
 * 
 * Simulates Shadowfax status transitions for testing and demos.
 * Manually moves an order through the delivery lifecycle.
 */
export const TrackingSimulator = {
    async advanceOrder(orderId: string) {
        const supabase = await createAdminClient();

        const { data: order, error } = await supabase
            .from('orders')
            .select('status, awb_number')
            .eq('id', orderId)
            .single();

        if (error || !order) {
            logger.error('TrackingSimulator: Order not found', error);
            return { success: false, error: 'Order not found' };
        }

        if (!order.awb_number) {
            return { success: false, error: 'Order has no AWB number. Mark as PACKED first.' };
        }

        let nextStatus: string | null = null;
        let nextTrackingStatus: string | null = null;
        const currentTracking = (order as any).tracking_status;

        if (order.status === ORDER_STATUS.PACKED) {
            nextStatus = ORDER_STATUS.DISPATCHED;
            nextTrackingStatus = 'picked_up';
        } else if (order.status === ORDER_STATUS.DISPATCHED) {
            if (currentTracking === 'picked_up') {
                nextStatus = ORDER_STATUS.DISPATCHED;
                nextTrackingStatus = 'in_transit';
            } else if (currentTracking === 'in_transit') {
                nextStatus = 'OUT_FOR_DELIVERY'; // Map to enum if available
                nextTrackingStatus = 'out_for_delivery';
            } else {
                nextStatus = 'OUT_FOR_DELIVERY';
                nextTrackingStatus = 'out_for_delivery';
            }
        } else if (order.status === 'OUT_FOR_DELIVERY') {
            nextStatus = ORDER_STATUS.DELIVERED;
            nextTrackingStatus = 'delivered';
        } else if (order.status === ORDER_STATUS.DELIVERED) {
            return { success: true, message: 'Already delivered' };
        }

        if (!nextStatus) return { success: false, error: 'Cannot advance from current status' };

        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: nextStatus as any,
                tracking_status: nextTrackingStatus,
                updated_at: new Date().toISOString(),
                dispatched_at: nextStatus === ORDER_STATUS.DISPATCHED && nextTrackingStatus === 'picked_up' ? new Date().toISOString() : undefined,
                delivered_at: nextStatus === ORDER_STATUS.DELIVERED ? new Date().toISOString() : undefined,
            })
            .eq('id', orderId);

        if (updateError) {
            logger.error('TrackingSimulator: Update failed', updateError);
            return { success: false, error: updateError.message };
        }

        return { success: true, status: nextStatus, trackingStatus: nextTrackingStatus };
    }
};
