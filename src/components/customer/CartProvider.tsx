"use client";

import React, { createContext, useContext, useState, useEffect, useTransition, useOptimistic } from "react";
import { DraftTransaction as Cart, SelectedPersonalization, SelectedAddon, DraftLineItem } from "@/lib/types/personalization";
import { useAuth } from "@/hooks/useAuth";
import * as draftOrderActions from "@/lib/actions/draft-order";
import { createClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logging/logger";
import { calculateItemPrice } from "@/lib/utils/pricing";
import { cartOptimisticReducer } from "@/lib/utils/cart-logic";
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
 * WYSHKIT 2026: CartProvider (Singleton State)
 * 
 * Swiggy 2026 Pattern: One Source of Truth
 * - Shared state across Home, Product, and Checkout screens
 * - Eliminates 'disconnect feel' by ensuring all UI segments update simultaneously
 * - Handles optimistic updates and server synchronization
 * - Resilient to network failures with exponential backoff
 */
export function CartProvider({
    children,
    initialCart,
    guestSessionId = null,
}: {
    children: React.ReactNode,
    initialCart?: Cart,
    /** For guests: scope realtime to this session only (no global leak). */
    guestSessionId?: string | null
}) {
    const { user, loading: authLoading } = useAuth();
    const [draftOrder, setDraftOrder] = useState<Cart>(initialCart || { items: [], partner_id: null, subtotal: 0, total: 0, item_count: 0 });
    const [loading, setLoading] = useState(!initialCart);
    const [isPending, startTransition] = useTransition();

    // WYSHKIT 2026: Global Replace Cart Dialog state
    const [showReplaceCartDialog, setShowReplaceCartDialog] = useState(false);
    const [pendingItem, setPendingItem] = useState<{
        item_id: string;
        variant_id: string | null;
        personalization: SelectedPersonalization;
        selected_addons?: SelectedAddon[];
        quantity: number;
        optimistic_data?: {
            item_name?: string;
            item_image?: string;
            unit_price?: number;
            partner_id?: string;
            partner_name?: string;
            update_item_id?: string;
        };
    } | null>(null);

    const [optimisticCart, addOptimisticCart] = useOptimistic(
        draftOrder,
        cartOptimisticReducer
    );

    // WYSHKIT 2026: Anti-Zombie Mechanism (Mutation Dominance)
    const lastActionTimeRef = React.useRef<number>(0);
    const isMutatingRef = React.useRef<boolean>(false);

    /**
     * WYSHKIT 2026: Resilient Cart Hydration
     * Implementation of Section 4 Pattern 4 (Network Resilience)
     */
    const fetchDraftOrder = async (retries = 0): Promise<Cart | null> => {
        setLoading(true);
        const maxRetries = 5;
        const baseDelay = 1000;

        try {
            const result = await draftOrderActions.getCart();
            const cart = result.cart ?? { items: [], partner_id: null, subtotal: 0, total: 0, item_count: 0 };

            startTransition(() => {
                setDraftOrder(cart);
            });
            setLoading(false);
            return cart;
        } catch (error) {
            if (retries < maxRetries) {
                const delay = baseDelay * Math.pow(2, retries) + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchDraftOrder(retries + 1);
            }
            setLoading(false);
            return null;
        }
    };

    // Initial fetch
    useEffect(() => {
        if (!authLoading) {
            fetchDraftOrder();
        }
    }, [authLoading]);

    // Realtime Sync
    useEffect(() => {
        if (authLoading) return;

        const filter = user
            ? `user_id=eq.${user.id}`
            : guestSessionId
                ? `session_id=eq.${guestSessionId}`
                : null;
        if (filter === null) return;

        const supabase = createClient();
        const channel = supabase
            .channel('cart_updates')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'cart_items',
                    filter,
                },
                () => {
                    const timeSinceLastAction = Date.now() - lastActionTimeRef.current;
                    if (isMutatingRef.current || timeSinceLastAction < 3000) return;
                    fetchDraftOrder();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, authLoading, guestSessionId]);

    const addToDraftOrder = async (
        item_id: string,
        variant_id: string | null,
        personalization: SelectedPersonalization,
        selected_addons?: SelectedAddon[],
        quantity: number = 1,
        optimistic_data?: { item_name?: string; item_image?: string; unit_price?: number; partner_id?: string; partner_name?: string }
    ) => {
        lastActionTimeRef.current = Date.now();
        isMutatingRef.current = true;

        if (optimistic_data) {
            startTransition(() => {
                addOptimisticCart({
                    item_id,
                    variant_id,
                    personalization,
                    selected_addons,
                    quantity,
                    ...optimistic_data,
                });
            });
        }

        try {
            let result;
            const update_item_id = optimistic_data && 'update_item_id' in optimistic_data ? (optimistic_data as any).update_item_id : undefined;

            if (update_item_id) {
                result = await draftOrderActions.updateCartItem(update_item_id, {
                    variant_id: variant_id,
                    personalization,
                    selected_addons: selected_addons,
                    quantity
                });
            } else {
                result = await draftOrderActions.addToCart({
                    item_id: item_id,
                    variant_id: variant_id,
                    personalization,
                    selected_addons: selected_addons,
                    quantity
                });
            }

            if (result && (result as any).error === 'PARTNER_MISMATCH') {
                triggerHaptic(HapticPattern.ERROR);
                setPendingItem({ item_id, variant_id, personalization, selected_addons, quantity, optimistic_data });
                setShowReplaceCartDialog(true);
                return { success: false, error: 'PARTNER_MISMATCH' };
            }

            const cart = (result as { cart?: Cart; success?: boolean })?.cart;
            if (cart && !('error' in result)) {
                startTransition(() => setDraftOrder(cart));
            }
            if (result.error) {
                return { success: false, error: result.error };
            }

            return { success: true };
        } finally {
            isMutatingRef.current = false;
        }
    };

    const handleReplaceCart = async () => {
        if (!pendingItem) return;

        triggerHaptic(HapticPattern.ACTION);
        setShowReplaceCartDialog(false);

        // WYSHKIT 2026: Zero-Flicker Transition
        // Immediately clear local state and add the pending item optimistically
        startTransition(() => {
            setDraftOrder({ items: [], partner_id: null, subtotal: 0, total: 0, item_count: 0 });
            addOptimisticCart({
                item_id: pendingItem.item_id,
                variant_id: pendingItem.variant_id,
                personalization: pendingItem.personalization,
                selected_addons: pendingItem.selected_addons,
                quantity: pendingItem.quantity,
                ...pendingItem.optimistic_data,
            });
        });

        try {
            await clearDraftOrder();
            await addToDraftOrder(
                pendingItem.item_id,
                pendingItem.variant_id,
                pendingItem.personalization,
                pendingItem.selected_addons,
                pendingItem.quantity,
                pendingItem.optimistic_data
            );
            setPendingItem(null);
        } catch (error) {
            logger.error('Failed to replace cart', error as Error);
            fetchDraftOrder(); // Rollback on failure
        }
    };

    const removeFromDraftOrder = async (itemId: string, variantId?: string | null) => {
        lastActionTimeRef.current = Date.now();
        isMutatingRef.current = true;

        const normalizedVariantId = variantId ?? null;
        const cartItem = draftOrder.items.find(
            (i: DraftLineItem) => i.item_id === itemId && (i.selected_variant_id ?? null) === normalizedVariantId
        );
        if (!cartItem) {
            isMutatingRef.current = false;
            return;
        }

        startTransition(async () => {
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
                isMutatingRef.current = false;
            }
        });
    };

    const updateQuantity = async (itemId: string, variantId: string | null, quantity: number) => {
        lastActionTimeRef.current = Date.now();
        isMutatingRef.current = true;

        const normalizedVariantId = variantId ?? null;
        const cartItem = draftOrder.items.find(
            (i: DraftLineItem) => i.item_id === itemId && (i.selected_variant_id ?? null) === normalizedVariantId
        );
        if (!cartItem) {
            isMutatingRef.current = false;
            return;
        }

        startTransition(async () => {
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
                isMutatingRef.current = false;
            }
        });
    };

    const clearDraftOrder = async () => {
        lastActionTimeRef.current = Date.now();
        isMutatingRef.current = true;
        setDraftOrder({ items: [], partner_id: null, subtotal: 0, total: 0, item_count: 0 });

        startTransition(async () => {
            try {
                await draftOrderActions.clearDraftOrder();
            } catch (err) {
                logger.error('CartProvider clear failed', err as Error);
            } finally {
                isMutatingRef.current = false;
            }
        });
    };

    const value = {
        draftOrder: optimisticCart,
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
