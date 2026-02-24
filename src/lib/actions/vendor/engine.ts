'use server';

import { createClient } from '@/lib/supabase/server';
import { getPartnerFromSession } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ORDER_STATUS } from '@/lib/types/order-status';

/**
 * WYSHKIT 2026: Polymorphic Vendor Intent Engine
 * One primitive for all vendor-side operations.
 */

const PartnerIntentSchema = z.discriminatedUnion('entity', [
    z.object({
        entity: z.literal('order'),
        action: z.enum(['ACCEPT', 'REJECT', 'UPDATE_STATUS', 'UPLOAD_PREVIEW']),
        id: z.string().uuid(),
        target_status: z.string().optional(),
        metadata: z.any().optional()
    }),
    z.object({
        entity: z.literal('product'),
        action: z.enum(['TOGGLE_STATUS', 'TOGGLE_STOCK', 'DELETE', 'UPDATE_STOCK']),
        id: z.string().uuid(),
        metadata: z.any().optional()
    }),
    z.object({
        entity: z.literal('vendor'),
        action: z.enum(['TOGGLE_ONLINE']),
        id: z.string().uuid(),
        metadata: z.any().optional()
    })
]);

export type PartnerIntent = z.infer<typeof PartnerIntentSchema>;

export async function executePartnerIntent(intent: PartnerIntent) {
    const vendor = await getPartnerFromSession();
    if (!vendor) throw new Error('Unauthorized');

    // Safety: ensure the vendor can only act on their own entities
    // We'll verify this inside each case for granular security.

    const validated = PartnerIntentSchema.parse(intent);
    const supabase = await createClient();

    try {
        switch (validated.entity) {
            case 'order': {
                // Verify ownership
                const { data: order } = await supabase
                    .from('orders')
                    .select('vendor_id')
                    .eq('id', validated.id)
                    .single();

                if (order?.vendor_id !== vendor.id) throw new Error('Access denied');

                if (validated.action === 'ACCEPT') {
                    const { update_order_status } = await import('../commerce/orders');
                    return await update_order_status(validated.id, ORDER_STATUS.CONFIRMED);
                } else if (validated.action === 'REJECT') {
                    const { reject_order } = await import('./vendor-actions');
                    return await reject_order(validated.id, validated.metadata?.reason || 'Store busy');
                } else if (validated.action === 'UPDATE_STATUS') {
                    const { update_order_status } = await import('../commerce/orders');
                    return await update_order_status(validated.id, validated.target_status as any);
                } else if (validated.action === 'UPLOAD_PREVIEW') {
                    const { upload_preview } = await import('./vendor-actions');
                    return await upload_preview(
                        validated.id,
                        validated.metadata.order_product_id,
                        validated.metadata.preview_url,
                        validated.metadata.partner_notes
                    );
                }
                break;
            }

            case 'product': {
                // Verify ownership
                const { data: product } = await supabase
                    .from('products')
                    .select('vendor_id')
                    .eq('id', validated.id)
                    .single();

                if (product?.vendor_id !== vendor.id) throw new Error('Access denied');

                if (validated.action === 'TOGGLE_STATUS') {
                    await supabase.from('products').update({ is_active: validated.metadata.isActive }).eq('id', validated.id);
                } else if (validated.action === 'TOGGLE_STOCK') {
                    // products table doesn't have stock_status, we use is_active or update variants
                    await supabase.from('products').update({ is_active: validated.metadata.stockStatus === 'IN_STOCK' }).eq('id', validated.id);
                } else if (validated.action === 'UPDATE_STOCK') {
                    const { variant_id, quantity } = validated.metadata;
                    await supabase.from('product_variants').update({ stock_quantity: quantity }).eq('id', variant_id).eq('product_id', validated.id);
                } else if (validated.action === 'DELETE') {
                    const { deleteItem } = await import('./catalog');
                    return await deleteItem(validated.id);
                }
                revalidatePath('/vendor/catalog');
                break;
            }

            case 'vendor': {
                if (validated.id !== vendor.id) throw new Error('Access denied');

                if (validated.action === 'TOGGLE_ONLINE') {
                    await supabase.from('vendors').update({ is_online: validated.metadata.isOnline }).eq('id', validated.id);
                }
                break;
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error('[executePartnerIntent] Error:', error);
        return { success: false, error: error.message };
    }
}
