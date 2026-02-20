"use client";

import React, { createContext, useContext, useState, useEffect, useTransition, useOptimistic } from "react";
import { Cart, SelectedPersonalization } from "@/lib/types/cart";
import { useAuth } from "@/hooks/useAuth";
import * as draftOrderActions from "@/lib/actions/draft-order";
import { createClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logging/logger";
import { calculateItemPrice } from "@/lib/utils/pricing";
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

interface CartContextType {
    draftOrder: Cart;
    loading: boolean;
    isPending: boolean;
    isGuest: boolean;
    addToDraftOrder: (
        itemId: string,
        variantId: string | null,
        personalization: SelectedPersonalization,
        selectedAddons?: any[],
        quantity?: number,
        optimisticData?: { itemName?: string; itemImage?: string; unitPrice?: number; partnerId?: string; partnerName?: string }
    ) => Promise<any>;
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
    const [draftOrder, setDraftOrder] = useState<Cart>(initialCart || { items: [], partnerId: null, subtotal: 0, total: 0, itemCount: 0 });
    const [loading, setLoading] = useState(!initialCart);
    const [isPending, startTransition] = useTransition();

    // WYSHKIT 2026: Global Replace Cart Dialog state
    const [showReplaceCartDialog, setShowReplaceCartDialog] = useState(false);
    const [pendingItem, setPendingItem] = useState<{
        itemId: string;
        variantId: string | null;
        personalization: SelectedPersonalization;
        selectedAddons?: any[];
        quantity: number;
        optimisticData?: any;
    } | null>(null);

    // WYSHKIT 2026: Optimistic cart updates
    const [optimisticCart, addOptimisticCart] = useOptimistic(
        draftOrder,
        (state: Cart, newItem: { itemId: string; variantId: string | null; personalization: SelectedPersonalization; selectedAddons?: any[]; quantity: number; itemName?: string; itemImage?: string; unitPrice?: number; partnerId?: string; partnerName?: string }) => {

            const newItemAddonsKey = (newItem.selectedAddons || []).map(a => a.id).sort().join(',');
            const newItemPersKey = newItem.personalization?.enabled
                ? `enabled:${newItem.personalization.option_id || 'default'}`
                : 'disabled';

            const existingItemIndex = state.items.findIndex(
                i => i.itemId === newItem.itemId &&
                    (i.selectedVariantId ?? null) === newItem.variantId &&
                    ((i.selectedAddons || []).map(a => a.id).sort().join(',') === newItemAddonsKey) &&
                    (i.personalization?.enabled === newItem.personalization?.enabled &&
                        (i.personalization?.option_id ?? null) === (newItem.personalization?.option_id ?? null))
            );

            let newItems;
            if (existingItemIndex >= 0) {
                newItems = state.items.map((item, idx) => {
                    if (idx === existingItemIndex) {
                        const updatedQuantity = item.quantity + newItem.quantity;
                        const updatedItem = { ...item, quantity: updatedQuantity };
                        return {
                            ...updatedItem,
                            totalPrice: calculateItemPrice(updatedItem as any)
                        };
                    }
                    return item;
                });
            } else {
                const tempId = `optimistic-${newItem.itemId}-${newItem.variantId || 'base'}-${Date.now()}`;
                const newItemObj = {
                    id: tempId,
                    itemId: newItem.itemId,
                    itemName: newItem.itemName || 'Loading...',
                    itemImage: newItem.itemImage || '/images/logo.png',
                    quantity: newItem.quantity,
                    unitPrice: newItem.unitPrice || 0,
                    totalPrice: 0,
                    selectedVariantId: newItem.variantId,
                    personalization: newItem.personalization,
                    selectedAddons: newItem.selectedAddons,
                    partnerName: newItem.partnerName,
                    partnerId: newItem.partnerId,
                };

                newItems = [
                    ...state.items,
                    {
                        ...newItemObj,
                        totalPrice: calculateItemPrice(newItemObj as any)
                    },
                ];
            }

            const newItemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
            const newSubtotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);

            return {
                ...state,
                items: newItems,
                itemCount: newItemCount,
                subtotal: newSubtotal,
                total: newSubtotal,
                partnerId: newItem.partnerId || state.partnerId,
            };
        }
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
            const cart = result.cart ?? { items: [], partnerId: null, subtotal: 0, total: 0, itemCount: 0 };

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
        itemId: string,
        variantId: string | null,
        personalization: SelectedPersonalization,
        selectedAddons?: any[],
        quantity: number = 1,
        optimisticData?: { itemName?: string; itemImage?: string; unitPrice?: number; partnerId?: string; partnerName?: string }
    ) => {
        lastActionTimeRef.current = Date.now();
        isMutatingRef.current = true;

        if (optimisticData) {
            startTransition(() => {
                addOptimisticCart({
                    itemId,
                    variantId,
                    personalization,
                    selectedAddons,
                    quantity,
                    ...optimisticData,
                });
            });
        }

        try {
            let result;
            const updateItemId = optimisticData && 'updateItemId' in optimisticData ? (optimisticData as any).updateItemId : undefined;

            if (updateItemId) {
                result = await draftOrderActions.updateCartItem(updateItemId, {
                    variantId,
                    personalization,
                    selectedAddons,
                    quantity
                });
            } else {
                result = await draftOrderActions.addToCart({ itemId, variantId, personalization, selectedAddons, quantity });
            }

            if (result && (result as any).error === 'PARTNER_MISMATCH') {
                triggerHaptic(HapticPattern.ERROR);
                setPendingItem({ itemId, variantId, personalization, selectedAddons, quantity, optimisticData });
                setShowReplaceCartDialog(true);
                return result;
            }

            const cart = (result as { cart?: Cart; success?: boolean })?.cart;
            if (cart && !('error' in result)) {
                startTransition(() => setDraftOrder(cart));
            } else {
                await fetchDraftOrder();
            }
            return result;
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
            setDraftOrder({ items: [], partnerId: null, subtotal: 0, total: 0, itemCount: 0 });
            addOptimisticCart({
                itemId: pendingItem.itemId,
                variantId: pendingItem.variantId,
                personalization: pendingItem.personalization,
                selectedAddons: pendingItem.selectedAddons,
                quantity: pendingItem.quantity,
                ...pendingItem.optimisticData,
            });
        });

        try {
            await clearDraftOrder();
            await addToDraftOrder(
                pendingItem.itemId,
                pendingItem.variantId,
                pendingItem.personalization,
                pendingItem.selectedAddons,
                pendingItem.quantity,
                pendingItem.optimisticData
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
            i => i.itemId === itemId && (i.selectedVariantId ?? null) === normalizedVariantId
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
            i => i.itemId === itemId && (i.selectedVariantId ?? null) === normalizedVariantId
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
        setDraftOrder({ items: [], partnerId: null, subtotal: 0, total: 0, itemCount: 0 });

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
