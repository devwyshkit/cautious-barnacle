'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'

/**
 * WYSHKIT 2026: Polymorphic Admin Intent Engine
 * One primitive to rule them all. Reduces Glue-Code by 90%.
 */

const AdminIntentSchema = z.discriminatedUnion('entity', [
    z.object({
        entity: z.literal('partner'),
        action: z.enum(['APPROVE_KYC', 'REJECT_KYC', 'TOGGLE_STATUS', 'UPDATE_COMMISSION']),
        id: z.string().uuid(),
        metadata: z.any().optional()
    }),
    z.object({
        entity: z.literal('item'),
        action: z.enum(['APPROVE', 'REJECT', 'TOGGLE_STATUS', 'TOGGLE_SPONSORED', 'BULK_APPROVE']),
        ids: z.array(z.string().uuid()),
        metadata: z.any().optional()
    }),
    z.object({
        entity: z.literal('order'),
        action: z.enum(['UPDATE_STATUS']),
        id: z.string().uuid(),
        target_status: z.string(),
        metadata: z.any().optional()
    }),
    z.object({
        entity: z.literal('category'),
        action: z.enum(['CREATE', 'TOGGLE_STATUS', 'DELETE']),
        id: z.string().uuid().optional(),
        metadata: z.any().optional()
    }),
    z.object({
        entity: z.literal('coupon'),
        action: z.enum(['CREATE', 'TOGGLE_STATUS']),
        id: z.string().uuid().optional(),
        metadata: z.any().optional()
    })
]);

export type AdminIntent = z.infer<typeof AdminIntentSchema>;

export async function executeAdminIntent(intent: AdminIntent) {
    await requireAdmin();
    const supabase = await createClient();

    const validated = AdminIntentSchema.parse(intent);

    try {
        switch (validated.entity) {
            case 'partner':
                if (validated.action === 'APPROVE_KYC') {
                    await supabase.from('partners').update({ kyc_status: 'ACTIVE', is_active: true }).eq('id', validated.id);
                } else if (validated.action === 'REJECT_KYC') {
                    await supabase.from('partners').update({ kyc_status: 'REJECTED', is_active: false }).eq('id', validated.id);
                } else if (validated.action === 'TOGGLE_STATUS') {
                    await supabase.from('partners').update({ is_active: validated.metadata.isActive }).eq('id', validated.id);
                }
                revalidatePath('/admin/partners');
                break;

            case 'item':
                if (validated.action === 'APPROVE') {
                    await supabase.from('items').update({ approval_status: 'approved' }).in('id', validated.ids);
                } else if (validated.action === 'REJECT') {
                    await supabase.from('items').update({ approval_status: 'rejected' }).in('id', validated.ids);
                } else if (validated.action === 'TOGGLE_STATUS') {
                    await supabase.from('items').update({ is_active: validated.metadata.isActive }).in('id', validated.ids);
                } else if (validated.action === 'TOGGLE_SPONSORED') {
                    await supabase.from('items').update({ is_sponsored: validated.metadata.isSponsored }).in('id', validated.ids);
                }
                revalidatePath('/admin/catalog');
                revalidatePath('/');
                break;

            case 'order':
                if (validated.action === 'UPDATE_STATUS') {
                    // Use idempotent transition RPC
                    await supabase.rpc('transition_order_status', {
                        p_order_id: validated.id,
                        p_new_status: validated.target_status
                    });
                }
                revalidatePath('/admin/orders');
                break;

            case 'category':
                if (validated.action === 'CREATE') {
                    await supabase.from('categories').insert({
                        name: validated.metadata.name,
                        slug: validated.metadata.slug
                    });
                } else if (validated.action === 'TOGGLE_STATUS') {
                    await supabase.from('categories').update({
                        is_active: validated.metadata.isActive
                    }).eq('id', validated.id!);
                } else if (validated.action === 'DELETE') {
                    await supabase.from('categories').delete().eq('id', validated.id!);
                }
                revalidatePath('/admin/categories');
                break;

            case 'coupon':
                if (validated.action === 'CREATE') {
                    await supabase.from('coupons').insert({
                        code: validated.metadata.code,
                        discount_type: validated.metadata.discount_type,
                        discount_value: validated.metadata.discount_value,
                        min_order_value: validated.metadata.min_order_value,
                        max_discount_amount: validated.metadata.max_discount_amount,
                        usage_limit: validated.metadata.usage_limit
                    });
                } else if (validated.action === 'TOGGLE_STATUS') {
                    await supabase.from('coupons').update({
                        is_active: validated.metadata.isActive
                    }).eq('id', validated.id!);
                }
                revalidatePath('/admin/coupons');
                break;
        }

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
