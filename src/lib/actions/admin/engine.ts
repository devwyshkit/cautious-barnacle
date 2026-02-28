'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { logger } from '@/lib/logging/logger';
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'

/**
 * WYSHKIT 2026: Polymorphic Admin Intent Engine
 * One primitive to rule them all. Reduces Glue-Code by 90%.
 */

const AdminIntentSchema = z.discriminatedUnion('entity', [
    z.object({
        entity: z.literal('vendor'),
        action: z.enum(['APPROVE_KYC', 'REJECT_KYC', 'TOGGLE_STATUS', 'UPDATE_COMMISSION']),
        id: z.string().uuid(),
        metadata: z.any().optional()
    }),
    z.object({
        entity: z.literal('product'),
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
    }),
    z.object({
        entity: z.literal('pincode'),
        action: z.enum(['ADD', 'TOGGLE_STATUS', 'DELETE']),
        id: z.string().uuid().optional(),
        metadata: z.any().optional()
    }),
    z.object({
        entity: z.literal('return'),
        action: z.enum(['APPROVE', 'REJECT']),
        id: z.string().uuid(),
        metadata: z.any().optional()
    }),
    z.object({
        entity: z.literal('wallet_credit'),
        action: z.enum(['CREDIT']),
        id: z.string().uuid(),
        metadata: z.any().optional()
    }),
    z.object({
        entity: z.literal('settings'),
        action: z.enum(['UPDATE_SETTING']),
        metadata: z.any()
    })
]);

export type AdminIntent = z.infer<typeof AdminIntentSchema>;

export async function executeAdminIntent(intent: AdminIntent) {
    await requireAdmin();
    const supabase = await createClient();

    const validated = AdminIntentSchema.parse(intent);

    try {
        // WYSHKIT 2026: Single Source of Truth
        // All administrative actions are routed through the RPC for auditability and RBAC.
        // Exception: Order Status updates must trigger side effects (refunds, cashback) in TS.
        if (validated.entity === 'order' && validated.action === 'UPDATE_STATUS') {
            const { update_order_status } = await import('@/lib/actions/commerce/orders');
            const result = await update_order_status(validated.id, validated.target_status, {
                reason: validated.metadata?.reason,
                cancelled_by: 'admin'
            });
            if (!result.success) throw new Error(result.error);
        } else {
            const { data, error } = await supabase.rpc('execute_admin_intent', {
                p_intent: validated
            });
            if (error) throw error;
        }

        // Frontend Cache Freshness
        switch (validated.entity) {
            case 'vendor': revalidatePath('/admin/vendors'); break;
            case 'product': revalidatePath('/admin/catalog'); revalidatePath('/'); break;
            case 'order': revalidatePath('/admin/orders'); break;
            case 'category': revalidatePath('/admin/categories'); break;
            case 'coupon': revalidatePath('/admin/coupons'); break;
        }

        return { success: true };
    } catch (error: any) {
        logger.error('Admin Intent Error:', { error });
        return { success: false, error: error.message };
    }
}
