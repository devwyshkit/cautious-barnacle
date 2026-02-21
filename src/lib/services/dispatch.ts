import { logger } from '@/lib/logging/logger';
import { ShadowfaxService } from '@/lib/services/shadowfax';
import { createAdminClient } from '@/lib/supabase/server';

interface DispatchOrderPayload {
    order_id: string;
}

/**
 * WYSHKIT 2026: Standardized Dispatch Orchestrator
 * Rules:
 * 1. Try Shadowfax API (3 attempts, 30s apart).
 * 2. If all attempts fail, Fallback to Manual Delivery.
 */
export const dispatch_order = async (payload: DispatchOrderPayload): Promise<{ success: boolean; error?: string }> => {
    try {
        const supabase = await createAdminClient();

        // 1. Fetch Order and Details
        const { data: order, error: order_error } = await supabase
            .from('orders')
            .select(`
                *,
                delivery_address:addresses(*),
                partner:partners(*),
                order_items(*)
            `)
            .eq('id', payload.order_id)
            .single();

        if (order_error || !order) {
            logger.error('DispatchService: Order not found', order_error, { order_id: payload.order_id });
            return { success: false, error: 'Order not found' };
        }

        if (order.awb_number) return { success: true };

        // 2. Resolve Logistics (Swiggy 2026: Flow Completeness)
        const address = (order as any).delivery_address as Record<string, any>;
        const partner = (order as any).partner as Record<string, any>;
        const order_items = (order as any).order_items as any[] || [];


        let total_weight = 0;
        let missing_weight_count = 0;

        order_items.forEach((item: any) => {
            if (!item.weight_kg) {
                missing_weight_count++;
            }
            total_weight += (Number(item.weight_kg) || 0.1) * (item.quantity || 1);
        });

        if (missing_weight_count > 0) {
            logger.warn(`DispatchService: ${missing_weight_count} items missing weight_kg for order ${order.order_number}. Using default 0.1kg per item.`);
        }

        const shadowfax_payload = {
            order_id: order.id,
            customer: {
                name: address?.name || 'Customer',
                phone: address?.phone || '',
                address: `${address?.address_line1 || ''}`.trim(),
                city: address?.city || '',
                pincode: address?.pincode || '',
            },
            pickup: {
                name: partner?.business_name || partner?.name || 'Partner',
                phone: String(partner?.whatsapp_number || ''),
                address: `${partner?.address || ''}`.trim(),
                city: partner?.city || '',
                pincode: partner?.pincode || '',
            },
            order_details: {
                total_weight_kg: total_weight > 0 ? total_weight : 0.5,
            }
        };

        // 3. Persist Intent (Swiggy 2026: Absolute Persistence)
        const { data: attempt, error: attempt_error } = await supabase
            .from('dispatch_attempts')
            .insert({
                order_id: order.id,
                payload: shadowfax_payload,
                status: 'PROCESSING',
                attempts: 1
            })
            .select()
            .single();

        if (attempt_error) {
            logger.error('DispatchService: Failed to persist intent', attempt_error);
            return { success: false, error: 'Database persistence error' };
        }

        // 4. Perform First Attempt
        logger.info(`[Dispatch] Initial attempt for order ${order.order_number}`);
        const dispatch_result = await ShadowfaxService.createOrder(shadowfax_payload);

        // 5. Update Intent Status
        if (dispatch_result.success) {
            await Promise.all([
                supabase.from('dispatch_attempts').update({
                    status: 'SUCCESS',
                    updated_at: new Date().toISOString()
                }).eq('id', attempt.id),
                supabase.from('orders').update({
                    awb_number: dispatch_result.awbNumber,
                    courier_partner: 'Shadowfax',
                    tracking_url: dispatch_result.trackingUrl,
                    updated_at: new Date().toISOString()
                }).eq('id', payload.order_id)
            ]);

            return { success: true };
        } else {
            const error_msg = dispatch_result.error || 'Shadowfax API Error';
            await supabase.from('dispatch_attempts').update({
                status: 'FAILED',
                last_error: error_msg,
                next_attempt_at: new Date(Date.now() + 60000).toISOString(), // 1 min retry boundary
                updated_at: new Date().toISOString()
            }).eq('id', attempt.id);

            logger.warn(`[Dispatch] Initial attempt failed for ${order.id}. Intent preserved for retry worker.`);
            return { success: true, error: `Initial dispatch failed but persistent intent created: ${error_msg}` };
        }

    } catch (error) {
        logger.error('DispatchService: Internal error', error);
        return { success: false, error: 'Internal dispatch error' };
    }
};
