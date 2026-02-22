'use client';

import React from 'react';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { useCart } from './CartProvider';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { cn } from '@/lib/utils';

export function CartDrawer() {
    const { draftOrder, isCartOpen, setCartOpen, updateQuantity, removeFromDraftOrder } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        triggerHaptic(HapticPattern.ACTION);
        setCartOpen(false);
        router.push('/checkout');
    };

    const handleUpdateQuantity = (itemId: string, variantId: string | null, newQty: number) => {
        triggerHaptic(HapticPattern.ACTION);
        if (newQty <= 0) {
            removeFromDraftOrder(itemId, variantId);
        } else {
            updateQuantity(itemId, variantId, newQty);
        }
    };

    return (
        <ResponsiveSurface
            open={isCartOpen}
            onOpenChange={setCartOpen}
            title="Your Cart"
            description={`From ${draftOrder?.items?.[0]?.partner_name || 'Local Store'}`}
            className="md:max-w-xl"
        >
            <div className="flex-1 overflow-y-auto max-h-[60vh] py-4 space-y-6 scrollbar-none">
                {draftOrder.items.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="size-20 rounded-[2.5rem] bg-zinc-50 flex items-center justify-center mb-4">
                            <ShoppingBag className="size-8 text-zinc-300" />
                        </div>
                        <h3 className="text-lg font-black text-zinc-900 leading-tight">Your cart is empty</h3>
                        <p className="text-sm font-medium text-zinc-500 mt-1">Add something premium to get started</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {draftOrder.items.map((item) => (
                            <div key={item.id} className="flex gap-4 group">
                                <div className="relative size-20 rounded-2xl bg-zinc-100 overflow-hidden ring-1 ring-zinc-200">
                                    <Image
                                        src={item.item_image || '/images/logo.png'}
                                        alt={item.item_name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[15px] font-black text-zinc-900 truncate tracking-tight">{item.item_name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-sm font-bold text-zinc-500">₹{item.unit_price}</span>
                                        {item.variant_name && (
                                            <>
                                                <span className="text-zinc-300">•</span>
                                                <span className="text-xs font-semibold text-zinc-400 capitalize">{item.variant_name}</span>
                                            </>
                                        )}
                                    </div>

                                    {item.is_personalized && (
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                                                <Sparkles className="size-2.5 text-amber-600" />
                                                <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter">Personalized</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center bg-zinc-100 rounded-xl p-0.5">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.item_id, item.selected_variant_id, item.quantity - 1)}
                                                className="size-7 flex items-center justify-center text-zinc-400 hover:text-zinc-900 active:scale-90 transition-all"
                                            >
                                                {item.quantity === 1 ? <Trash2 className="size-3.5" /> : <Minus className="size-3.5" />}
                                            </button>
                                            <span className="w-8 text-center text-xs font-black tabular-nums">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.item_id, item.selected_variant_id, item.quantity + 1)}
                                                className="size-7 flex items-center justify-center text-zinc-400 hover:text-zinc-900 active:scale-90 transition-all"
                                            >
                                                <Plus className="size-3.5" />
                                            </button>
                                        </div>
                                        <span className="text-sm font-black text-zinc-900">₹{item.total_price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-4 pb-8 bg-white">
                <div className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Subtotal</span>
                        <span className="text-lg font-black text-zinc-900">₹{draftOrder.total}</span>
                    </div>
                    <Button
                        disabled={draftOrder.items.length === 0}
                        onClick={handleCheckout}
                        className="w-full h-14 rounded-2xl bg-[#D91B24] hover:bg-[#D91B24]/90 text-white font-black text-base shadow-xl shadow-rose-900/20 group"
                    >
                        <span>Checkout now</span>
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <p className="text-[10px] text-center font-bold text-zinc-400 uppercase tracking-[0.1em]">
                        Taxes and delivery calculated at checkout
                    </p>
                </div>
            </div>
        </ResponsiveSurface>
    );
}
