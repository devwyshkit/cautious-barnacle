"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DraftTransaction as Cart, SelectedPersonalization, SelectedAddon, DraftLineItem } from "@/lib/types/personalization";
import { useAuth } from "@/hooks/useAuth";
import * as draftOrderActions from "@/lib/actions/draft-order";
import { logger } from "@/lib/logging/logger";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { triggerHaptic, HapticPattern } from "@/lib/utils/haptic";

export interface CartActionResult {
    success: boolean;
    error?: string;
    code?: string;
    requiresCartClear?: boolean;
    cart?: Cart;
}

interface CartContextType {
    draftOrder: Cart;
    loading: boolean;
    isPending: boolean;
    isGuest: boolean;
    addToDraftOrder: (
        item_id: string,
        variant_id: string | null,
        personalization: SelectedPersonalization,
        selected_addons?: SelectedAddon[],
        quantity?: number,
        optimistic_data?: {
            item_name?: string;
            item_image?: string;
            unit_price?: number;
            partner_id?: string;
            partner_name?: string;
            update_item_id?: string;
        }
    ) => Promise<CartActionResult>;
    removeFromDraftOrder: (itemId: string, variantId?: string | null) => Promise<void>;
    updateQuantity: (itemId: string, variantId: string | null, quantity: number) => Promise<void>;
    clearDraftOrder: () => Promise<void>;
    refreshDraftOrder: () => Promise<Cart | null>;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}

/**
 * WYSHKIT 2026: CartProvider (Stateless Server Sync)
 * 
 * Swiggy 2026 Pattern: Absolute Validation
 * - NO Optimistic State. The DB is the ONLY source of truth.
 * - Shows loading state during strict server-side calculation.
 * - Prevents all client-side pricing mismatch and DOM UI jitter.
 */
export function CartProvider({
    children,
    initialCart,
    guestSessionId = null,
}: {
    children: React.ReactNode,
    initialCart?: Cart,
    guestSessionId?: string | null
}) {
    const { user, loading: authLoading } = useAuth();
    const [draftOrder, setDraftOrder] = useState<Cart>(initialCart || { items: [], partner_id: null, subtotal: 0, personalization_charges: 0, delivery_fee: 0, platform_fee: 0, gst: 0, discount: 0, wallet_discount: 0, total: 0, item_count: 0 });
    const [loading, setLoading] = useState(!initialCart);
    const [isPending, setIsPending] = useState(false); // Used for action loaders

    const [showReplaceCartDialog, setShowReplaceCartDialog] = useState(false);
    const [pendingItem, setPendingItem] = useState<any>(null);

    const fetchDraftOrder = async (): Promise<Cart | null> => {
        setLoading(true);
        try {
            const result = await draftOrderActions.getCart();
            const cart = result.cart ?? { items: [], partner_id: null, subtotal: 0, personalization_charges: 0, delivery_fee: 0, platform_fee: 0, gst: 0, discount: 0, wallet_discount: 0, total: 0, item_count: 0 };
            setDraftOrder(cart);
            return cart;
        } catch (error) {
            logger.error('Failed to fetch draft order', error as Error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchDraftOrder();
        }
    }, [authLoading]);

    const addToDraftOrder = async (
        item_id: string,
        variant_id: string | null,
        personalization: SelectedPersonalization,
        selected_addons?: SelectedAddon[],
        quantity: number = 1,
        optimistic_data?: any
    ) => {
        setIsPending(true);
        try {
            let result;
            const update_item_id = optimistic_data?.update_item_id;

            if (update_item_id) {
                // Not mapped cleanly on actions currently, handle fallback if needed
                // Swiggy 2026: The action updateCartItem doesn't exist yet we will rely on addToCart merging
                // Actually wait, let's call addToCart which deduplicates
                result = await draftOrderActions.addToCart({
                    item_id,
                    variant_id,
                    personalization,
                    selected_addons,
                    quantity
                });
            } else {
                result = await draftOrderActions.addToCart({
                    item_id,
                    variant_id,
                    personalization,
                    selected_addons,
                    quantity
                });
            }

            if (result && (result as any).error === 'PARTNER_MISMATCH') {
                triggerHaptic(HapticPattern.ERROR);
                setPendingItem({ item_id, variant_id, personalization, selected_addons, quantity, optimistic_data });
                setShowReplaceCartDialog(true);
                return { success: false, error: 'PARTNER_MISMATCH' };
            }

            const cart = (result as { cart?: Cart })?.cart;
            if (cart) setDraftOrder(cart);

            if (result.error) return { success: false, error: result.error };
            return { success: true };
        } finally {
            setIsPending(false);
        }
    };

    const handleReplaceCart = async () => {
        if (!pendingItem) return;
        triggerHaptic(HapticPattern.ACTION);
        setShowReplaceCartDialog(false);
        setIsPending(true);

        try {
            await draftOrderActions.clearDraftOrder();
            const result = await draftOrderActions.addToCart({
                item_id: pendingItem.item_id,
                variant_id: pendingItem.variant_id,
                personalization: pendingItem.personalization,
                selected_addons: pendingItem.selected_addons,
                quantity: pendingItem.quantity,
            });
            const cart = (result as { cart?: Cart })?.cart;
            if (cart) setDraftOrder(cart);
            setPendingItem(null);
        } catch (error) {
            logger.error('Failed to replace cart', error as Error);
            await fetchDraftOrder();
        } finally {
            setIsPending(false);
        }
    };

    const removeFromDraftOrder = async (itemId: string, variantId?: string | null) => {
        setIsPending(true);
        const normalizedVariantId = variantId ?? null;
        const cartItem = draftOrder.items.find(
            (i: DraftLineItem) => i.item_id === itemId && (i.selected_variant_id ?? null) === normalizedVariantId
        );
        if (!cartItem) {
            setIsPending(false);
            return;
        }

        try {
            const result = await draftOrderActions.removeCartItem(cartItem.id);
            if ((result as any).cart) {
                setDraftOrder((result as any).cart);
            } else {
                await fetchDraftOrder();
            }
        } catch (err) {
            logger.error('CartProvider remove failed', err as Error);
            await fetchDraftOrder();
        } finally {
            setIsPending(false);
        }
    };

    const updateQuantity = async (itemId: string, variantId: string | null, quantity: number) => {
        setIsPending(true);
        const normalizedVariantId = variantId ?? null;
        const cartItem = draftOrder.items.find(
            (i: DraftLineItem) => i.item_id === itemId && (i.selected_variant_id ?? null) === normalizedVariantId
        );
        if (!cartItem) {
            setIsPending(false);
            return;
        }

        try {
            const result = await draftOrderActions.updateCartItemQuantity(cartItem.id, quantity);
            if ((result as any).cart) {
                setDraftOrder((result as any).cart);
            } else {
                await fetchDraftOrder();
            }
        } catch (err) {
            logger.error('CartProvider update quantity failed', err as Error);
            await fetchDraftOrder();
        } finally {
            setIsPending(false);
        }
    };

    const clearDraftOrder = async () => {
        setIsPending(true);
        try {
            const result = await draftOrderActions.clearDraftOrder();
            if ('cart' in result && result.cart) setDraftOrder(result.cart);
        } catch (err) {
            logger.error('CartProvider clear failed', err as Error);
        } finally {
            setIsPending(false);
        }
    };

    const value = {
        draftOrder,
        loading,
        isPending,
        isGuest: !user,
        addToDraftOrder,
        removeFromDraftOrder,
        updateQuantity,
        clearDraftOrder,
        refreshDraftOrder: fetchDraftOrder,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
            <AlertDialog open={showReplaceCartDialog} onOpenChange={setShowReplaceCartDialog}>
                <AlertDialogContent className="rounded-[32px] border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black text-zinc-950 tracking-tight">Replace cart?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-zinc-600 leading-relaxed">
                            Your cart contains items from a different store. Adding this item will clear your current cart.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row gap-2 mt-4">
                        <AlertDialogCancel className="flex-1 rounded-2xl border-zinc-100 font-bold text-zinc-500 hover:bg-zinc-50">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReplaceCart}
                            className="flex-1 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold"
                        >
                            Replace
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CartContext.Provider>
    );
}
