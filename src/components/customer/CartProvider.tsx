'use client';

import React, { createContext, useContext, useState, useOptimistic, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DraftTransaction as Cart, SelectedPersonalization, SelectedAddon, DraftLineItem } from "@/lib/types/personalization";
import { EMPTY_CART } from "@/lib/constants/cart";
import { useAuth } from "@/hooks/useAuth";
import { addToCart, removeCartItem, updateCartItemQuantity, clearDraftOrder } from "@/lib/actions/cart/mutations";
import { getCart } from "@/lib/actions/cart/get-cart";
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
        optimistic_data?: any
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
 * WYSHKIT 2026: Elite CartProvider (Zero Shadow State)
 * 
 * Swiggy 2026 Pattern: Pure Server Authority
 * - NO local useState for the cart. The DB/RSC is the source of truth.
 * - useOptimistic provides immediate UI feedback while the Server Action resolves.
 * - revalidateTag('cart') triggers the RSC update, which flows back into initialCart.
 */
export function CartProvider({
    children,
    initialCart = EMPTY_CART,
    guestSessionId = null,
}: {
    children: React.ReactNode,
    initialCart?: Cart,
    guestSessionId?: string | null
}) {
    const { user } = useAuth();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // ELITE: Optimistic state bridges the gap between Action and Revalidation
    const [optimisticCart, setOptimisticCart] = useOptimistic(
        initialCart,
        (state, update: { type: 'add' | 'remove' | 'update' | 'clear', payload: any }) => {
            switch (update.type) {
                case 'add':
                    // Elite optimistic add: calculate count and mock total for instant visual satisfaction
                    return {
                        ...state,
                        items: [...state.items, { id: 'temp', ...update.payload, quantity: update.payload.quantity || 1 }],
                        item_count: state.item_count + (update.payload.quantity || 1),
                        total: state.total + (update.payload.price || 500) // mock price visually until server true source overrides 
                    };
                case 'remove':
                    return {
                        ...state,
                        items: state.items.filter(i => i.id !== update.payload)
                    };
                case 'update':
                    return {
                        ...state,
                        items: state.items.map(i => i.id === update.payload.id ? { ...i, quantity: update.payload.quantity } : i)
                    };
                case 'clear':
                    return EMPTY_CART;
                default:
                    return state;
            }
        }
    );

    const [showReplaceCartDialog, setShowReplaceCartDialog] = useState(false);
    const [pendingItem, setPendingItem] = useState<any>(null);

    const addToDraftOrder = async (
        item_id: string,
        variant_id: string | null,
        personalization: SelectedPersonalization,
        selected_addons?: SelectedAddon[],
        quantity: number = 1,
        optimistic_data?: any
    ): Promise<CartActionResult> => {
        return new Promise((resolve) => {
            startTransition(async () => {
                // Optimistic UI update
                setOptimisticCart({
                    type: 'add',
                    payload: { item_id, selected_variant_id: variant_id, ...optimistic_data }
                });

                try {
                    const result = await addToCart({
                        item_id,
                        variant_id,
                        personalization,
                        selected_addons,
                        quantity
                    });

                    if (result && (result as any).error === 'PARTNER_MISMATCH') {
                        triggerHaptic(HapticPattern.ERROR);
                        setPendingItem({ item_id, variant_id, personalization, selected_addons, quantity, optimistic_data });
                        setShowReplaceCartDialog(true);
                        resolve({ success: false, error: 'PARTNER_MISMATCH' });
                        return;
                    }

                    if (result.error) {
                        resolve({ success: false, error: result.error });
                    } else {
                        // SWIGGY 2026: Force refresh to ensure initialCart prop updates from RSC
                        router.refresh();
                        resolve({ success: true });
                    }
                } catch (error) {
                    logger.error('AddToCart Transition Error', error as Error);
                    resolve({ success: false, error: 'Internal Error' });
                }
            });
        });
    };

    const removeFromDraftOrder = async (itemId: string, variantId?: string | null) => {
        const normalizedVariantId = variantId ?? null;
        const cartItem = optimisticCart.items.find(
            (i: DraftLineItem) => i.item_id === itemId && (i.selected_variant_id ?? null) === normalizedVariantId
        );
        if (!cartItem) return;

        startTransition(async () => {
            setOptimisticCart({ type: 'remove', payload: cartItem.id });
            try {
                await removeCartItem(cartItem.id);
            } catch (err) {
                logger.error('Remove Transition Error', err as Error);
            }
        });
    };

    const updateQuantity = async (itemId: string, variantId: string | null, quantity: number) => {
        const normalizedVariantId = variantId ?? null;
        const cartItem = optimisticCart.items.find(
            (i: DraftLineItem) => i.item_id === itemId && (i.selected_variant_id ?? null) === normalizedVariantId
        );
        if (!cartItem) return;

        startTransition(async () => {
            setOptimisticCart({ type: 'update', payload: { id: cartItem.id, quantity } });
            try {
                await updateCartItemQuantity(cartItem.id, quantity);
            } catch (err) {
                logger.error('Update Transition Error', err as Error);
            }
        });
    };

    const clearCart = async () => {
        return new Promise<void>((resolve) => {
            startTransition(async () => {
                setOptimisticCart({ type: 'clear', payload: null });
                try {
                    await clearDraftOrder();
                    resolve();
                } catch (err) {
                    logger.error('Clear Transition Error', err as Error);
                    resolve();
                }
            });
        });
    };

    const handleReplaceCart = async () => {
        if (!pendingItem) return;
        setShowReplaceCartDialog(false);
        await clearCart();
        // Wait a bit for the transition to settle
        await addToDraftOrder(
            pendingItem.item_id,
            pendingItem.variant_id,
            pendingItem.personalization,
            pendingItem.selected_addons,
            pendingItem.quantity,
            pendingItem.optimistic_data
        );
    };

    const value = {
        draftOrder: optimisticCart,
        loading: isPending,
        isPending,
        isGuest: !user,
        addToDraftOrder,
        removeFromDraftOrder,
        updateQuantity,
        clearDraftOrder: clearCart,
        refreshDraftOrder: async () => {
            const result = await getCart();
            return result.cart || initialCart;
        },
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
