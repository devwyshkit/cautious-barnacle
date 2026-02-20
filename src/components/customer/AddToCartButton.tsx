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
    itemId: string;
    itemName: string;
    itemImage?: string;
    unitPrice?: number;
    partnerId?: string;
    partnerName?: string;
    isIdentityAvailable?: boolean;
    hasVariants?: boolean;
    stockQuantity?: number;
    className?: string;
}

/**
 * WYSHKIT 2026: AddToCartButton - Instant Add with Optimistic Updates
 * Swiggy 2026 Pattern: User stays where they are, cart updates instantly
 */
export function AddToCartButton({
    itemId,
    itemName,
    itemImage,
    unitPrice,
    partnerId,
    partnerName,
    isIdentityAvailable,
    hasVariants,
    stockQuantity,
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
        if (isIdentityAvailable || hasVariants) {
            if (partnerId) {
                // Swiggy Pattern: Portal Navigation
                // Redirect user to the item detail sheet to make selections
                router.push(`/partner/${partnerId}/item/${itemId}${pathname === '/search' ? '?context=search' : ''}`, { scroll: false });
            }
            return;
        }

        setIsAdding(true);
        const startCoords = { x: e.clientX, y: e.clientY };

        setJustAdded(true);
        triggerHaptic(HapticPattern.SUCCESS);

        const revertTimer = setTimeout(() => setJustAdded(false), 1500);

        try {
            const optimisticData = {
                itemName: itemName || 'Item',
                itemImage: itemImage || '/images/logo.png',
                unitPrice: unitPrice || 0,
                partnerId: partnerId || undefined,
                partnerName: partnerName || undefined
            };

            const result = await addToDraftOrder(itemId, null, { enabled: false }, [], 1, optimisticData);

            if (result && (result as any).error === 'PARTNER_MISMATCH') {
                clearTimeout(revertTimer);
                setJustAdded(false);
                return;
            } else if (result && 'error' in result) {
                throw new Error(result.error);
            }
        } catch (error) {
            clearTimeout(revertTimer);
            setJustAdded(false);
            triggerHaptic(HapticPattern.ERROR);
            toast.error('Failed to add item');
        } finally {
            setIsAdding(false);
        }
    };

    const isOutOfStock = typeof stockQuantity === 'number' && stockQuantity <= 0;
    const isDisabled = isAdding || isPending || isOutOfStock;

    if (isOutOfStock && !hasVariants) {
        return (
            <div className={cn(
                "h-8 px-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center",
                className
            )}>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sold Out</span>
            </div>
        );
    }

    return (
        <Button
            size="sm"
            onClick={handleQuickAdd}
            aria-label={`Add ${itemName} to cart`}
            data-testid="add-to-cart-quick"
            disabled={isDisabled}
            className={cn(
                "h-8 px-3 rounded-xl transition-all z-10 font-black text-[10px] uppercase tracking-widest",
                justAdded
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 border-none"
                    : isOutOfStock ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200" : "bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm border border-zinc-100",
                "active:scale-95",
                className
            )}
        >
            {isAdding ? (
                <Loader2 className="size-3.5 animate-spin" />
            ) : justAdded ? (
                <div className="flex items-center gap-1.5">
                    <Check className="size-3.5" />
                    <span>Added</span>
                </div>
            ) : (
                <div className="flex items-center gap-1.5">
                    <Plus className="size-3.5" />
                    <span>Add</span>
                </div>
            )}
        </Button>
    );
}
