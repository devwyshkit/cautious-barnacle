'use client';

import React from 'react';
import { useUI } from '@/providers/UIProvider';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { Button } from '@/components/ui/button';
import { AlertCircle, ShoppingBag, Trash2 } from 'lucide-react';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

export function CartSwitchSheet() {
    const { isCartSwitchSheetOpen, closeCartSwitchSheet } = useUI();

    const handleClearAndAdd = () => {
        triggerHaptic(HapticPattern.ACTION);
        // TODO: Connect to cart switch action
        closeCartSwitchSheet();
    };

    return (
        <ResponsiveSurface
            open={isCartSwitchSheetOpen}
            onOpenChange={closeCartSwitchSheet}
            title="Replace Cart?"
            description="Your cart already has items from another vendor."
            className="md:max-w-sm"
        >
            <div className="p-6 space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="size-16 bg-[var(--warning-muted)] rounded-full flex items-center justify-center">
                        <ShoppingBag className="size-8 text-[var(--warning)]" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-base font-bold text-[var(--text-primary)]">Start a new cart?</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed px-2">
                            Wyshkit only supports ordering from one vendor at a time. Adding this will clear your existing cart.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        className="w-full h-12 rounded-[var(--radius-xl)] bg-[var(--destructive)] text-[var(--destructive-foreground)] font-bold text-sm flex items-center gap-2"
                        onClick={handleClearAndAdd}
                    >
                        <Trash2 className="size-4" />
                        Clear & Add New Product
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-12 rounded-[var(--radius-xl)] border-[var(--border)] font-bold text-sm"
                        onClick={closeCartSwitchSheet}
                    >
                        Keep Existing Cart
                    </Button>
                </div>
            </div>
        </ResponsiveSurface>
    );
}
