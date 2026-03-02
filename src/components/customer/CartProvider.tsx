'use client';

import React, { createContext, useContext, useState, useOptimistic, useTransition, useEffect } from "react";
import { DraftTransaction as Cart, SelectedPersonalization, SelectedAddon, CartProduct } from "@/lib/types/personalization";
import { EMPTY_CART } from "@/lib/constants/cart";
import { useAuth } from "@/providers/AuthProvider";
import { executeCommerceIntent } from "@/lib/actions/commerce/intent-engine";
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
        product_id: string,
        variant_id: string | null,
        personalization: SelectedPersonalization,
        selected_addons?: SelectedAddon[],
        quantity?: number,
        optimistic_data?: any
    ) => Promise<CartActionResult>;
    removeFromDraftOrder: (productId: string, variantId?: string | null) => Promise<void>;
    updateQuantity: (productId: string, variantId: string | null, quantity: number) => Promise<void>;
    clearDraftOrder: () => Promise<void>;
    isDrawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
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
 * WYSHKIT 2026 Pattern: Pure Server Authority
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
    const [isPending, startTransition] = useTransition();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // WYSHKIT 2026: Persist guestSessionId if it's the only anchor
    useEffect(() => {
        if (!user && guestSessionId) {
            // This is handled by the middleware/cookie usually, 
            // but we ensure the client stays in sync if needed.
        }
    }, [user, guestSessionId]);

    // ELITE: Optimistic state bridges the gap between Action and Revalidation
    const [optimisticCart, setOptimisticCart] = useOptimistic(
        initialCart,
        (state, update: { type: 'add' | 'remove' | 'update' | 'clear', payload: any }) => {
            switch (update.type) {
                case 'add':
                    // WYSHKIT 2026: Pure metadata addition. NO pricing arithmetic.
                    // The server revalidation will flow back the authoritative totals.
                    return {
                        ...state,
                        products: [...state.products, {
                            id: 'temp-' + Math.random(),
                            ...update.payload,
                            quantity: update.payload.quantity || 1
                        } as CartProduct],
                    };
                case 'remove':
                    return {
                        ...state,
                        products: state.products.filter((i: CartProduct) => i.id !== update.payload)
                    };
                case 'update':
                    return {
                        ...state,
                        products: state.products.map((i: CartProduct) => i.id === update.payload.id ? { ...i, quantity: update.payload.quantity } : i)
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
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const addToDraftOrder = async (
        product_id: string,
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
                    payload: { product_id, variant_id: variant_id, ...optimistic_data }
                });

                try {
                    const result = await executeCommerceIntent({
                        intent: 'ADD_TO_CART',
                        payload: {
                            product_id,
                            variant_id: variant_id ?? undefined,
                            personalization,
                            selected_addons,
                            quantity
                        }
                    });

                    if (result && (result as any).data?.error === 'VENDOR_MISMATCH') {
                        triggerHaptic(HapticPattern.ERROR);
                        setPendingItem({ product_id, variant_id, personalization, selected_addons, quantity, optimistic_data });
                        setShowReplaceCartDialog(true);
                        resolve({ success: false, error: 'VENDOR_MISMATCH' });
                        return;
                    }

                    if (result.error) {
                        resolve({ success: false, error: result.error });
                    } else {
                        resolve({ success: true });
                    }
                } catch (error) {
                    logger.error('AddToCart Transition Error', error as Error);
                    resolve({ success: false, error: 'Internal Error' });
                }
            });
        });
    };

    const removeFromDraftOrder = async (productId: string, variantId?: string | null) => {
        const normalizedVariantId = variantId ?? null;
        const cartItem = optimisticCart.products.find(
            (i: CartProduct) => i.product_id === productId && (i.variant_id ?? null) === normalizedVariantId
        );
        if (!cartItem) return;

        startTransition(async () => {
            setOptimisticCart({ type: 'remove', payload: cartItem.id });
            try {
                await executeCommerceIntent({
                    intent: 'UPDATE_CART_QUANTITY',
                    payload: {
                        product_id: cartItem.product_id,
                        variant_id: (cartItem.variant_id ?? undefined) as string | undefined,
                        quantity: 0
                    }
                });
            } catch (err) {
                logger.error('Remove Transition Error', err as Error);
            }
        });
    };

    const updateQuantity = async (productId: string, variantId: string | null, quantity: number) => {
        const normalizedVariantId = variantId ?? null;
        const cartItem = optimisticCart.products.find(
            (i: CartProduct) => i.product_id === productId && (i.variant_id ?? null) === normalizedVariantId
        );
        if (!cartItem) return;

        startTransition(async () => {
            setOptimisticCart({ type: 'update', payload: { id: cartItem.id, quantity } });
            try {
                await executeCommerceIntent({
                    intent: 'UPDATE_CART_QUANTITY',
                    payload: {
                        product_id: cartItem.product_id,
                        variant_id: (cartItem.variant_id ?? undefined) as string | undefined,
                        quantity: quantity
                    }
                });
            } catch (err) {
                logger.error('Update Transition Error', err as Error);
            }
        });
    };

    const clearCart = async () => {
        startTransition(async () => {
            setOptimisticCart({ type: 'clear', payload: null });
            try {
                await executeCommerceIntent({ intent: 'CLEAR_CART', payload: {} });
            } catch (err) {
                logger.error('Clear Transition Error', err as Error);
            }
        });
    };

    const handleReplaceCart = async () => {
        if (!pendingItem) return;
        setShowReplaceCartDialog(false);
        await clearCart();
        await addToDraftOrder(
            pendingItem.product_id,
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
        isDrawerOpen,
        setDrawerOpen,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
            {/* WYSHKIT 2026: Dialogs/Portals MUST wait for mount to avoid hydration mismatch */}
            {mounted && (
                <AlertDialog open={showReplaceCartDialog} onOpenChange={setShowReplaceCartDialog}>
                    <AlertDialogContent className="rounded-[var(--radius-md)] border-none shadow-sm bg-[var(--surface)]/95 backdrop-blur-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Replace cart?</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                                Your cart contains products from a different store. Adding this product will clear your current cart.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-2 mt-4">
                            <AlertDialogCancel className="flex-1 rounded-[var(--radius-md)] border-[var(--border)] font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleReplaceCart}
                                className="flex-1 rounded-[var(--radius-md)] bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--text-inverse)] font-bold"
                            >
                                Replace
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </CartContext.Provider>
    );
}
