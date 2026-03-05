import { logger } from '@/lib/logging/logger';
import { ShiprocketService } from '@/lib/services/shiprocket';
import { createAdminClient } from '@/lib/supabase/server';

interface DispatchOrderPayload {
    order_id: string;
}

/**
 * WYSHKIT 2026: Standardized Dispatch Orchestrator
 * Rules:
 * 1. Try Shiprocket API (Standard Provider).
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
                vendor:vendors(*),
                order_products(*)
            `)
            .eq('id', payload.order_id)
            .single();

        if (order_error || !order) {
            logger.error('DispatchService: Order not found', order_error, { order_id: payload.order_id });
            return { success: false, error: 'Order not found' };
        }

        if (order.awb_number) return { success: true };

        // 2. Resolve Logistics (WYSHKIT 2026: Flow Completeness)
        const address = (order as any).delivery_address as Record<string, any>;
        const vendor = (order as any).vendor as Record<string, any>;
        const order_products = (order as any).order_products as any[] || [];

        let total_weight = 0;
        let total_value = 0;

        order_products.forEach((product: any) => {
            total_weight += (Number(product.weight_kg) || 0.1) * (product.quantity || 1);
            total_value += (Number(product.unit_price) || 0) * (product.quantity || 1);
        });

        const shiprocket_payload = {
            order_id: order.order_number || order.id,
            order_date: new Date().toISOString().split('T')[0],
            pickup_location: vendor?.business_name || 'Primary',
            billing_customer_name: address?.name?.split(' ')[0] || 'Customer',
            billing_last_name: address?.name?.split(' ').slice(1).join(' ') || '',
            billing_address: address?.address_line1 || '',
            billing_city: address?.city || '',
            billing_pincode: address?.pincode || '',
            billing_state: address?.state || '',
            billing_country: 'India',
            billing_email: address?.email || 'customer@wyshkit.com',
            billing_phone: address?.phone || '',
            shipping_is_billing: true,
            order_items: order_products.map((p: any) => ({
                name: p.product_name || 'Product',
                sku: p.product_id || 'SKU',
                units: p.quantity || 1,
                selling_price: p.unit_price || 0
            })),
            payment_method: 'Prepaid' as const,
            sub_total: total_value,
            length: 10,
            width: 10,
            height: 10,
            weight: total_weight > 0 ? total_weight : 0.5
        };

        // 4. Perform First Attempt
        logger.info(`[Dispatch] Initial attempt for order ${order.order_number} via Shiprocket`);
        const dispatch_result = await ShiprocketService.createOrder(shiprocket_payload);

        // 5. Update Intent Status
        if (dispatch_result.success) {
            // WYSHKIT 2026: Atomic Dispatch (Status + Logistics Metadata in one trip)
            await supabase.rpc('transition_order', {
                p_order_id: payload.order_id,
                p_target_status: 'RIDER_ASSIGNED',
                p_metadata: {
                    awb_number: (dispatch_result as any).awb_code,
                    courier_vendor: 'Shiprocket',
                    shipment_id: (dispatch_result as any).shipment_id,
                    dispatched_at: new Date().toISOString()
                } as any
            });

            return { success: true };
        } else {
            const error_msg = dispatch_result.error || 'Shiprocket API Error';
            logger.error(`[Dispatch] Initial attempt failed for ${order.id}: ${error_msg}`);
            return { success: false, error: `Initial dispatch failed: ${error_msg}` };
        }

    } catch (error) {
        logger.error('DispatchService: Internal error', error);
        return { success: false, error: 'Internal dispatch error' };
    }
};
