'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { logError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/logging/logger';
import { getGuestSessionId, getGuestSessionIdReadOnly } from '@/lib/session';
import { withTrace } from '@/lib/observability/tracer';

// --- INTENT SCHEMAS ---

const AddToCartSchema = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    variant_id: z.string().uuid().optional().nullable(),
    personalization: z.record(z.string(), z.any()).optional().nullable(),
    selected_addons: z.array(z.any()).optional().nullable(),
});

const UpdateCartSchema = z.object({
    product_id: z.string().uuid(),
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

const TransitionOrderSchema = z.object({
    order_id: z.string().uuid(),
    target_status: z.string(), // Validated by DB enum
    metadata: z.any().optional(),
});

const OrderProductInputSchema = z.object({
    product_id: z.string().uuid(),
    variant_id: z.string().uuid().nullable().optional(),
    quantity: z.number().int().positive(),
    personalization: z.record(z.string(), z.any()).nullable().optional(),
    selected_addons: z.array(z.any()).nullable().optional(),
});

const PlaceOrderSchema = z.object({
    razorpay_order_id: z.string(),
    products: z.array(OrderProductInputSchema).optional(),
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
    z.object({ intent: z.literal('UPDATE_CART_PRODUCT'), payload: AddToCartSchema }), // Uses same schema
    z.object({ intent: z.literal('APPLY_COUPON'), payload: ApplyCouponSchema }),
    z.object({ intent: z.literal('TOGGLE_WALLET'), payload: ToggleWalletSchema }),
    z.object({ intent: z.literal('SET_ADDRESS'), payload: SetAddressSchema }),
    z.object({ intent: z.literal('SET_GSTIN'), payload: SetGSTINSchema }),
    z.object({ intent: z.literal('SET_GUEST_LOCATION'), payload: SetGuestLocationSchema }),
    z.object({ intent: z.literal('TRANSITION_ORDER'), payload: TransitionOrderSchema }),
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
    return withTrace(`commerce_intent:${intentAction.intent}`, async (span) => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Resolve Session Identity
        // WYSHKIT 2026: Mutations MUST have an identity (User or Session)
        // Transitions/Place Order/Clear Cart/Add/Update all need session creation if guest.
        const isMutation = [
            'ADD_TO_CART',
            'UPDATE_CART_QUANTITY',
            'UPDATE_CART_PRODUCT',
            'APPLY_COUPON',
            'TOGGLE_WALLET',
            'SET_ADDRESS',
            'SET_GSTIN',
            'SET_GUEST_LOCATION',
            'PLACE_ORDER',
            'CLEAR_CART'
        ].includes(intentAction.intent);

        const guestSessionRaw = !user
            ? (isMutation ? await getGuestSessionId() : await getGuestSessionIdReadOnly())
            : undefined;
        const sessionId = guestSessionRaw || undefined;

        span.setAttributes({
            intent: intentAction.intent,
            user_id: user?.id || 'guest',
            session_id: sessionId || 'none'
        });

        try {
            const validated = CommerceIntentSchema.parse(intentAction);
            logger.info('CommerceIntent', { intent: validated.intent, user_id: user?.id });

            switch (validated.intent) {
                case 'ADD_TO_CART': {
                    const { data, error } = await supabase.rpc('execute_cart_mutation', {
                        p_product_id: validated.payload.product_id,
                        p_quantity: validated.payload.quantity,
                        p_mode: 'ADD',
                        p_user_id: user?.id ?? undefined,
                        p_session_id: sessionId ?? undefined,
                        p_variant_id: validated.payload.variant_id ?? undefined,
                        p_personalization: (validated.payload.personalization as any) || { enabled: false },
                        p_selected_addons: (validated.payload.selected_addons as any) || []
                    });
                    if (error) throw error;
                    return { success: true, data };
                }

                case 'UPDATE_CART_QUANTITY': {
                    const { data, error } = await supabase.rpc('execute_cart_mutation', {
                        p_product_id: validated.payload.product_id,
                        p_quantity: validated.payload.quantity,
                        p_mode: 'SET',
                        p_user_id: user?.id ?? undefined,
                        p_session_id: sessionId ?? undefined,
                        p_variant_id: validated.payload.variant_id ?? undefined
                    });
                    if (error) throw error;
                    if (data && !(data as any).success) {
                        throw new Error((data as any).error || 'Failed to update quantity');
                    }
                    break;
                }

                case 'APPLY_COUPON': {
                    const { error } = await supabase.rpc('update_checkout_session', {
                        p_applied_coupon: validated.payload.code ?? undefined,
                        p_user_id: user?.id ?? undefined,
                        p_session_id: sessionId ?? undefined
                    });
                    if (error) throw error;
                    break;
                }

                case 'TOGGLE_WALLET': {
                    const { error } = await supabase.rpc('update_checkout_session', {
                        p_use_wallet: validated.payload.enabled,
                        p_user_id: user?.id ?? undefined,
                        p_session_id: sessionId ?? undefined
                    });
                    if (error) throw error;
                    break;
                }

                case 'SET_ADDRESS': {
                    const { error } = await supabase.rpc('update_checkout_session', {
                        p_selected_address_id: validated.payload.address_id ?? undefined,
                        p_user_id: user?.id ?? undefined,
                        p_session_id: sessionId ?? undefined
                    });
                    if (error) throw error;
                    break;
                }

                case 'SET_GSTIN': {
                    const { error } = await supabase.rpc('update_checkout_session', {
                        p_gstin: validated.payload.gstin ?? undefined,
                        p_user_id: user?.id ?? undefined,
                        p_session_id: sessionId ?? undefined
                    });
                    if (error) throw error;
                    break;
                }

                case 'SET_GUEST_LOCATION': {
                    const { error } = await supabase.rpc('update_checkout_session', {
                        p_guest_lat: validated.payload.lat ?? undefined,
                        p_guest_lng: validated.payload.lng ?? undefined,
                        p_session_id: sessionId ?? undefined
                    });
                    if (error) throw error;
                    break;
                }

                case 'PLACE_ORDER': {
                    const { data, error } = await supabase.rpc('place_atomic_order', {
                        p_products: validated.payload.products as any,
                        p_address_id: validated.payload.address_id!,
                        p_razorpay_order_id: validated.payload.razorpay_order_id,
                        p_payment_id: validated.payload.payment_id ?? undefined,
                        p_coupon_code: validated.payload.coupon_code ?? undefined,
                        p_use_wallet: validated.payload.use_wallet ?? undefined,
                        p_gstin: validated.payload.gstin ?? undefined,
                        p_delivery_instructions: validated.payload.delivery_instructions ?? undefined,
                        p_distance_km: validated.payload.distance_km ?? undefined
                    });
                    if (error) throw error;

                    revalidatePath('/');
                    revalidateTag('orders');
                    return { success: true, data };
                }

                case 'UPDATE_CART_PRODUCT': {
                    const { data, error } = await supabase.rpc('execute_cart_mutation', {
                        p_product_id: validated.payload.product_id,
                        p_quantity: validated.payload.quantity ?? 1,
                        p_mode: 'SET',
                        p_user_id: user?.id,
                        p_session_id: sessionId,
                        p_variant_id: validated.payload.variant_id ?? undefined,
                        p_personalization: (validated.payload.personalization as any) || undefined,
                        p_selected_addons: (validated.payload.selected_addons as any) || undefined
                    });
                    if (error) throw error;
                    if (data && !(data as any).success) {
                        throw new Error((data as any).error || 'Failed to update product');
                    }
                    break;
                }

                case 'TRANSITION_ORDER': {
                    const { data, error } = await supabase.rpc('transition_order', {
                        p_order_id: validated.payload.order_id,
                        p_target_status: validated.payload.target_status as any,
                        p_metadata: validated.payload.metadata || {}
                    });
                    if (error) throw error;
                    if (data && !(data as any).success) {
                        throw new Error((data as any).error || 'Failed to transition order');
                    }
                    revalidateTag('orders');
                    return { success: true, data };
                }

                case 'CLEAR_CART': {
                    const match = user ? { user_id: user.id } : { session_id: sessionId };
                    await Promise.all([
                        supabase.from('cart_products').delete().match(match),
                        supabase.from('checkout_sessions').delete().match(match)
                    ]);
                    break;
                }
            }

            revalidateTag('cart');
            return { success: true };
        } catch (err: any) {
            logError(err, 'IntentEngineError');
            return { success: false, error: err.message };
        }
    });
}
