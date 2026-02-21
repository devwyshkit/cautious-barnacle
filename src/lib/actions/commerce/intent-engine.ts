'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/logging/logger';
import { getGuestSessionId, getGuestSessionIdReadOnly } from '@/lib/session';

// --- INTENT SCHEMAS ---

const AddToCartSchema = z.object({
    item_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    variant_id: z.string().uuid().optional(),
    personalization: z.any().optional(),
    selected_addons: z.array(z.any()).optional(),
});

const UpdateCartSchema = z.object({
    item_id: z.string().uuid(),
    quantity: z.number().int().nonnegative(),
    variant_id: z.string().uuid().optional(),
});

const ApplyCouponSchema = z.object({
    code: z.string().nullable(),
});

const ToggleWalletSchema = z.object({
    enabled: z.boolean(),
});

const SetAddressSchema = z.object({
    address_id: z.string().uuid(),
});

const SetGSTINSchema = z.object({
    gstin: z.string().nullable(),
});

const SetGuestLocationSchema = z.object({
    lat: z.number(),
    lng: z.number(),
    name: z.string().optional(),
});

const PlaceOrderSchema = z.object({
    razorpay_order_id: z.string(),
    items: z.array(z.any()).optional(), // Optional: can be refetched by RPC
    payment_id: z.string().optional(),
    address_id: z.string().uuid().optional(),
    coupon_code: z.string().optional(),
    use_wallet: z.boolean().optional(),
    gstin: z.string().optional(),
    delivery_instructions: z.string().optional(),
    distance_km: z.number().optional(),
});

const CommerceIntentSchema = z.discriminatedUnion('intent', [
    z.object({ intent: z.literal('ADD_TO_CART'), payload: AddToCartSchema }),
    z.object({ intent: z.literal('UPDATE_CART_QUANTITY'), payload: UpdateCartSchema }),
    z.object({ intent: z.literal('APPLY_COUPON'), payload: ApplyCouponSchema }),
    z.object({ intent: z.literal('TOGGLE_WALLET'), payload: ToggleWalletSchema }),
    z.object({ intent: z.literal('SET_ADDRESS'), payload: SetAddressSchema }),
    z.object({ intent: z.literal('SET_GSTIN'), payload: SetGSTINSchema }),
    z.object({ intent: z.literal('SET_GUEST_LOCATION'), payload: SetGuestLocationSchema }),
    z.object({ intent: z.literal('PLACE_ORDER'), payload: PlaceOrderSchema }),
    z.object({ intent: z.literal('CLEAR_CART'), payload: z.object({}).optional() }),
]);

export type CommerceIntent = z.infer<typeof CommerceIntentSchema>;

// --- ENGINE ---

/**
 * The Unified Commerce Intent Engine.
 * Consolidated entry point for all commerce mutations.
 */
export async function executeCommerceIntent(intentAction: CommerceIntent) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Resolve Session Identity
    const isReadOnly = ['PLACE_ORDER', 'CLEAR_CART'].includes(intentAction.intent) === false;
    const guestSessionRaw = !user
        ? (isReadOnly ? await getGuestSessionIdReadOnly() : await getGuestSessionId())
        : undefined;
    const sessionId = guestSessionRaw || undefined;

    try {
        const validated = CommerceIntentSchema.parse(intentAction);
        logger.info('CommerceIntent', { intent: validated.intent, user_id: user?.id });

        switch (validated.intent) {
            case 'ADD_TO_CART': {
                const { data, error } = await supabase.rpc('add_to_cart_atomic', {
                    p_item_id: validated.payload.item_id,
                    p_quantity: validated.payload.quantity,
                    p_user_id: user?.id,
                    p_session_id: sessionId,
                    p_variant_id: validated.payload.variant_id ?? undefined,
                    p_personalization: (validated.payload.personalization as any) || { enabled: false },
                    p_selected_addons: (validated.payload.selected_addons as any) || []
                });
                if (error) throw error;
                return { success: true, data };
            }

            case 'UPDATE_CART_QUANTITY': {
                // We'll reuse add_to_cart_atomic with negative qty or a dedicated update if needed
                // For now, let's assume we have a clear path for updates
                const { error } = await supabase
                    .from('cart_items')
                    .update({ quantity: validated.payload.quantity })
                    .match({
                        item_id: validated.payload.item_id,
                        ...(user ? { user_id: user.id } : { session_id: sessionId }),
                        ...(validated.payload.variant_id ? { selected_variant_id: validated.payload.variant_id } : {})
                    });
                if (error) throw error;
                break;
            }

            case 'APPLY_COUPON': {
                const { error } = await supabase
                    .from('checkout_sessions')
                    .upsert({
                        user_id: user?.id,
                        session_id: sessionId,
                        applied_coupon: validated.payload.code
                    }, { onConflict: (user ? 'user_id' : 'session_id') });
                if (error) throw error;
                break;
            }

            case 'TOGGLE_WALLET': {
                const { error } = await supabase
                    .from('checkout_sessions')
                    .upsert({
                        user_id: user?.id,
                        session_id: sessionId,
                        use_wallet: validated.payload.enabled
                    }, { onConflict: (user ? 'user_id' : 'session_id') });
                if (error) throw error;
                break;
            }

            case 'SET_ADDRESS': {
                const { error } = await supabase
                    .from('checkout_sessions')
                    .upsert({
                        user_id: user?.id,
                        session_id: sessionId,
                        selected_address_id: validated.payload.address_id
                    }, { onConflict: (user ? 'user_id' : 'session_id') });
                if (error) throw error;
                break;
            }

            case 'SET_GSTIN': {
                const { error } = await supabase
                    .from('checkout_sessions')
                    .upsert({
                        user_id: user?.id,
                        session_id: sessionId,
                        gstin: validated.payload.gstin
                    }, { onConflict: (user ? 'user_id' : 'session_id') });
                if (error) throw error;
                break;
            }

            case 'SET_GUEST_LOCATION': {
                const { error } = await supabase
                    .from('checkout_sessions')
                    .upsert({
                        user_id: user?.id,
                        session_id: sessionId,
                        guest_lat: validated.payload.lat,
                        guest_lng: validated.payload.lng
                    }, { onConflict: (user ? 'user_id' : 'session_id') });
                if (error) throw error;
                break;
            }

            case 'PLACE_ORDER': {
                const { data, error } = await supabase.rpc('place_secure_order', {
                    p_items: validated.payload.items as any,
                    p_razorpay_order_id: validated.payload.razorpay_order_id,
                    p_user_id: user?.id,
                    p_session_id: sessionId,
                    p_address_id: validated.payload.address_id ?? undefined,
                    p_payment_id: validated.payload.payment_id ?? undefined,
                    p_coupon_code: validated.payload.coupon_code ?? undefined,
                    p_use_wallet: validated.payload.use_wallet ?? undefined,
                    p_gstin: validated.payload.gstin ?? undefined,
                    p_delivery_instructions: validated.payload.delivery_instructions ?? undefined,
                    p_distance_km: validated.payload.distance_km ?? undefined
                });
                if (error) throw error;

                // Post-order cleanup
                await Promise.all([
                    supabase.from('cart_items').delete().or(user ? `user_id.eq.${user.id}` : `session_id.eq.${sessionId}`),
                    supabase.from('checkout_sessions').delete().or(user ? `user_id.eq.${user.id}` : `session_id.eq.${sessionId}`)
                ]);

                return { success: true, data };
            }

            case 'CLEAR_CART': {
                await supabase.from('cart_items').delete().or(user ? `user_id.eq.${user.id}` : `session_id.eq.${sessionId}`);
                await supabase.from('checkout_sessions').delete().or(user ? `user_id.eq.${user.id}` : `session_id.eq.${sessionId}`);
                break;
            }
        }

        revalidatePath('/checkout');
        revalidatePath('/cart');
        return { success: true };
    } catch (err: any) {
        logError(err, 'IntentEngineError');
        return { success: false, error: err.message };
    }
}
