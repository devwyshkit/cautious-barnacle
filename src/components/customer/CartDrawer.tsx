'use client';

import React from 'react';
import { useCart } from '@/components/customer/CartProvider';
import { useUI } from '@/providers/UIProvider';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { ShoppingBag, X, ChevronRight, Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/pricing';
import { useRouter } from 'next/navigation';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import Image from 'next/image';

export function CartDrawer() {
    const { isCartDrawerOpen, closeCartDrawer } = useUI();
    const { draftOrder, updateQuantity, removeFromDraftOrder } = useCart();
    const router = useRouter();

    const products = draftOrder?.products || [];
    const isEmpty = products.length === 0;

    const handleCheckout = () => {
        triggerHaptic(HapticPattern.ACTION);
        closeCartDrawer();
        router.push('/checkout');
    };

    return (
        <ResponsiveSurface
            open={isCartDrawerOpen}
            onOpenChange={closeCartDrawer}
            title="Your Cart"
            description={isEmpty ? "Your cart is empty" : `Checking out from ${products[0]?.vendor_name}`}
            className="md:max-w-md"
        >
            <div className="flex flex-col h-full">
                {isEmpty ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
                        <div className="size-16 rounded-full bg-[var(--surface-muted)] flex items-center justify-center">
                            <ShoppingBag className="size-8 text-[var(--text-tertiary)]" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Your cart is empty</h3>
                            <p className="text-sm text-[var(--text-secondary)]">Add some items from your favorite local vendors to get started.</p>
                        </div>
                        <button
                            onClick={closeCartDrawer}
                            className="px-6 py-2.5 rounded-[var(--radius-lg)] bg-[var(--text-primary)] text-[var(--text-inverse)] text-sm font-bold active:scale-95 transition-all"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
                            {products.map((product) => (
                                <div key={product.id} className="flex gap-4 group">
                                    <div className="relative size-16 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] overflow-hidden shrink-0 border border-[var(--border)]">
                                        {product.product_image ? (
                                            <Image src={product.product_image} alt={product.product_name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="size-6 text-[var(--text-tertiary)]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-0.5">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-bold text-[var(--text-primary)] leading-tight line-clamp-1">{product.product_name}</h4>
                                                <button
                                                    onClick={() => removeFromDraftOrder(product.product_id, product.variant_id, product.personalization, product.selected_addons)}
                                                    className="p-1 -mr-1 text-[var(--text-tertiary)] hover:text-[var(--destructive)] transition-colors"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-[10px] font-medium text-[var(--text-tertiary)] tabular-nums">{formatCurrency(product.unit_price)} per piece</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center bg-[var(--surface-muted)] rounded-full border border-[var(--border)] p-1">
                                                <button
                                                    onClick={() => updateQuantity(product.product_id, product.variant_id ?? null, Math.max(0, product.quantity - 1), product.personalization, product.selected_addons)}
                                                    className="size-6 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-all"
                                                >
                                                    <Minus className="size-3" />
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold text-[var(--text-primary)]">{product.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(product.product_id, product.variant_id ?? null, product.quantity + 1, product.personalization, product.selected_addons)}
                                                    className="size-6 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-all"
                                                >
                                                    <Plus className="size-3" />
                                                </button>
                                            </div>
                                            <p className="text-sm font-bold text-[var(--text-primary)] tabular-nums">{formatCurrency(product.line_total)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-[var(--surface)] border-t border-[var(--border)]">
                            <button
                                onClick={handleCheckout}
                                className="w-full h-14 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-[var(--radius-xl)] flex items-center justify-between px-6 font-bold text-sm active:scale-[0.98] transition-all shadow-[var(--shadow-lg)] group"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-base">Checkout</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm opacity-90">{formatCurrency(draftOrder?.total || 0)}</span>
                                    <ChevronRight className="size-5 stroke-[3] group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </ResponsiveSurface>
    );
}
