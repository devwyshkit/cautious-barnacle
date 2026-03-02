'use client';

import React from 'react';
import { ShoppingBag, X, Plus, Minus, ArrowRight, Sparkles, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/customer/CartProvider';
import { formatCurrency } from '@/lib/utils/pricing';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

/**
 * WYSHKIT 2026: CartDrawer - The Review Checkpoint
 * 
 * "Healthy Friction": Forces a quick review of items, quantities, and personalization
 * before entering the commitment flow (Checkout).
 */
export function CartDrawer() {
    const router = useRouter();
    const {
        draftOrder,
        isDrawerOpen,
        setDrawerOpen,
        updateQuantity,
        removeFromDraftOrder
    } = useCart();

    const products = draftOrder?.products || [];
    const hasProducts = products.length > 0;

    const handleCheckout = () => {
        triggerHaptic(HapticPattern.ACTION);
        setDrawerOpen(false);
        router.push('/checkout');
    };

    return (
        <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent className="max-w-lg mx-auto">
                <DrawerHeader className="border-b border-[var(--surface-muted)] pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                                <ShoppingBag className="size-4 text-[var(--primary)]" />
                            </div>
                            <DrawerTitle className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                                Your Bag
                            </DrawerTitle>
                        </div>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon" className="rounded-full size-8">
                                <X className="size-4 text-[var(--text-secondary)]" />
                            </Button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto px-[var(--space-4)] py-[var(--space-6)]">
                    {!hasProducts ? (
                        <div className="flex flex-col items-center justify-center py-[var(--space-20)] text-center space-y-[var(--space-4)]">
                            <div className="size-[var(--space-16)] rounded-full bg-[var(--surface-muted)] flex items-center justify-center">
                                <ShoppingBag className="size-[var(--space-8)] text-[var(--text-tertiary)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Your bag is empty</h3>
                                <p className="text-sm text-[var(--text-secondary)]">Add some magic from local stores!</p>
                            </div>
                            <Button
                                onClick={() => setDrawerOpen(false)}
                                variant="outline"
                                className="rounded-full px-[var(--space-8)] font-bold"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-[var(--space-6)]">
                            {/* Vendor Anchor */}
                            <div className="flex items-center gap-[var(--space-2)] px-[var(--space-1)]">
                                <span className="text-[var(--text-xxs)] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Ordering from</span>
                                <span className="text-xs font-bold text-[var(--primary)]">{products[0]?.vendor_name}</span>
                            </div>

                            {/* Entry List */}
                            <div className="space-y-[var(--space-5)]">
                                {products.map((entry) => (
                                    <div key={entry.id} className="flex gap-[var(--space-4)]">
                                        <div className="relative size-[var(--space-16)] rounded-[var(--radius-2xl)] bg-[var(--surface-muted)] overflow-hidden shrink-0">
                                            <Image
                                                src={entry.product_image || '/images/logo.png'}
                                                alt={entry.product_name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-[var(--space-0-5)]">
                                            <div>
                                                <div className="flex justify-between items-start gap-[var(--space-2)]">
                                                    <h4 className="text-sm font-bold text-[var(--text-primary)] leading-tight truncate">
                                                        {entry.product_name}
                                                    </h4>
                                                    <span className="text-sm font-bold text-[var(--text-primary)] whitespace-nowrap">
                                                        {formatCurrency(entry.line_total)}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-[var(--space-2)] mt-[var(--space-1)]">
                                                    {entry.variant_name && (
                                                        <span className="text-[var(--text-xxs)] font-bold text-[var(--text-secondary)] bg-[var(--surface-muted)] px-[var(--space-1-5)] py-[var(--space-0-5)] rounded">
                                                            {entry.variant_name}
                                                        </span>
                                                    )}
                                                    {entry.is_personalized && (
                                                        <span className="flex items-center gap-[var(--space-0-5)] text-[var(--text-xxs)] font-bold text-[var(--well-warning-text)] bg-[var(--well-warning)] px-[var(--space-1-5)] py-[var(--space-0-5)] rounded border border-[var(--warning-border)]">
                                                            <Sparkles className="size-[var(--space-2)]" /> Personalized
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-[var(--space-2)]">
                                                <div className="flex items-center bg-[var(--surface-muted)] rounded-[var(--radius-lg)] p-0.5 border border-[var(--border)]">
                                                    <button
                                                        onClick={() => {
                                                            triggerHaptic(HapticPattern.ACTION);
                                                            if (entry.quantity > 1) {
                                                                updateQuantity(entry.product_id, entry.variant_id || null, entry.quantity - 1);
                                                            } else {
                                                                removeFromDraftOrder(entry.product_id, entry.variant_id);
                                                            }
                                                        }}
                                                        className="size-7 flex items-center justify-center hover:bg-[var(--surface)] rounded-md transition-colors"
                                                    >
                                                        {entry.quantity === 1 ? <Trash2 className="size-3.5 text-[var(--destructive)]" /> : <Minus className="size-3.5 text-[var(--text-primary)]" />}
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold text-[var(--text-primary)]">
                                                        {entry.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            triggerHaptic(HapticPattern.ACTION);
                                                            updateQuantity(entry.product_id, entry.variant_id || null, entry.quantity + 1);
                                                        }}
                                                        className="size-7 flex items-center justify-center hover:bg-[var(--surface)] rounded-md transition-colors"
                                                    >
                                                        <Plus className="size-3.5 text-[var(--text-primary)]" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Brief Bill Summary */}
                            <div className="pt-[var(--space-6)] border-t border-[var(--surface-muted)] space-y-[var(--space-2)]">
                                <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(draftOrder?.subtotal || 0)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                                    <span>Taxes & Charges</span>
                                    <span className="text-[var(--text-tertiary)] font-medium">Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between items-center pt-[var(--space-2)]">
                                    <span className="text-sm font-bold text-[var(--text-primary)]">Subtotal</span>
                                    <span className="text-lg font-bold text-[var(--text-primary)]">
                                        {formatCurrency(draftOrder?.subtotal || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DrawerFooter className="px-[var(--space-4)] pb-[var(--space-8)] pt-[var(--space-2)]">
                    {hasProducts && (
                        <Button
                            onClick={handleCheckout}
                            className="w-full h-[var(--space-14)] rounded-[var(--radius-2xl)] bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] text-base font-bold shadow-[var(--shadow-lg)] transition-all active:scale-[0.98] group"
                        >
                            <span className="flex-1">Checkout</span>
                            <div className="flex items-center gap-[var(--space-2)] bg-[var(--surface-muted)]/20 px-[var(--space-4)] py-[var(--space-2)] rounded-[var(--radius-xl)] group-hover:bg-[var(--primary-foreground)]/20 transition-colors text-[var(--primary-foreground)]">
                                <span className="tabular-nums">{formatCurrency(draftOrder?.subtotal || 0)}</span>
                                <ArrowRight className="size-[var(--space-4)]" />
                            </div>
                        </Button>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
