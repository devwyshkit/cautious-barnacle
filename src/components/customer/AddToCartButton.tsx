'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Plus, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/customer/CartProvider';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

interface AddToCartButtonProps {
    item_id: string;
    item_name: string;
    item_image?: string | null;
    unit_price?: number;
    partner_id?: string | null;
    partner_name?: string;
    is_identity_available?: boolean;
    has_variants?: boolean;
    stock_quantity?: number;
    className?: string;
}

/**
 * WYSHKIT 2026: AddToCartButton - Instant Add with Optimistic Updates
 * Swiggy 2026 Pattern: User stays where they are, cart updates instantly
 */
export function AddToCartButton({
    item_id,
    item_name,
    item_image,
    unit_price,
    partner_id,
    partner_name,
    is_identity_available,
    has_variants,
    stock_quantity,
    className,
}: AddToCartButtonProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { addToDraftOrder, clearDraftOrder, isPending } = useCart();

    const [isAdding, setIsAdding] = useState(false);
    const [justAdded, setJustAdded] = useState(false);

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        triggerHaptic(HapticPattern.ACTION);

        // WYSHKIT 2026: If item needs selection (identity addition OR variants), navigate to store sheet
        if (is_identity_available || has_variants) {
            if (partner_id) {
                // Swiggy Pattern: Portal Navigation
                // Redirect user to the item detail sheet to make selections
                router.push(`/partner/${partner_id}/item/${item_id}${pathname === '/search' ? '?context=search' : ''}`, { scroll: false });
            }
            return;
        }

        setIsAdding(true);

        setJustAdded(true);
        triggerHaptic(HapticPattern.SUCCESS);

        const revertTimer = setTimeout(() => setJustAdded(false), 1500);

        try {
            const optimistic_data = {
                item_name: item_name || 'Item',
                item_image: item_image || '/images/logo.png',
                unit_price: unit_price || 0,
                partner_id: partner_id || undefined,
                partner_name: partner_name || undefined
            };

            const result = await addToDraftOrder(item_id, null, { enabled: false }, [], 1, optimistic_data);

            if (result && (result as any).error === 'PARTNER_MISMATCH') {
                clearTimeout(revertTimer);
                setJustAdded(false);
                return;
            } else if (result && 'error' in result) {
                throw new Error(result.error);
            }
        } catch (error: any) {
            clearTimeout(revertTimer);
            setJustAdded(false);
            triggerHaptic(HapticPattern.ERROR);
            toast.error(error.message || 'Failed to add item');
        } finally {
            setIsAdding(false);
        }
    };

    const isOutOfStock = typeof stock_quantity === 'number' && stock_quantity <= 0;
    const isDisabled = isAdding || isPending || isOutOfStock;

    if (isOutOfStock && !has_variants) {
        return (
            <div className={cn(
                "h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center",
                className
            )}>
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Sold Out</span>
            </div>
        );
    }

    return (
        <Button
            size="default"
            onClick={handleQuickAdd}
            aria-label={`Add ${item_name} to cart`}
            data-testid="add-to-cart-quick"
            disabled={isDisabled}
            className={cn(
                "h-11 px-4 rounded-xl transition-all z-10 font-black text-[11px] uppercase tracking-widest",
                justAdded
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 border-none"
                    : isOutOfStock ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200" : "bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm border border-zinc-100",
                "active:scale-95",
                className
            )}
        >
            {isAdding ? (
                <Loader2 className="size-4 animate-spin" />
            ) : justAdded ? (
                <div className="flex items-center gap-1.5">
                    <Check className="size-4" />
                    <span>Added</span>
                </div>
            ) : (
                <div className="flex items-center gap-1.5">
                    <Plus className="size-4" />
                    <span>Add</span>
                </div>
            )}
        </Button>
    );
}
