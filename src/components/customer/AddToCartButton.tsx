'use client';

import { useState, useEffect, useTransition } from 'react';
import { Plus, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/customer/CartProvider';
import { Button } from '@/components/ui/button';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

interface AddToCartButtonProps {
    item_id: string;
    item_name: string;
    item_image?: string | null;
    unit_price: number;
    partner_id: string;
    partner_name: string;
    className?: string;
}

/**
 * WYSHKIT 2026: AddToCartButton (One Thing Pattern)
 * Minimalist interaction focusing on the "Add" intent.
 */
export function AddToCartButton({
    item_id,
    item_name,
    item_image,
    unit_price,
    partner_id,
    partner_name,
    className,
}: AddToCartButtonProps) {
    const { addToDraftOrder, isPending } = useCart();
    const [justAdded, setJustAdded] = useState(false);

    // We can't easily get the specific pending state for this button from the provider
    // but startTransition in provider will set isPending globally.
    // For many buttons, we might want local loading state.
    const [localPending, setLocalPending] = useState(false);

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setLocalPending(true);
        const optimistic_data = {
            item_name,
            item_image: item_image || '/images/logo.png',
            unit_price,
            partner_id,
            partner_name
        };

        const result = await addToDraftOrder(
            item_id,
            null,
            { enabled: false },
            [],
            1,
            optimistic_data
        );

        setLocalPending(false);

        if (result?.success) {
            triggerHaptic(HapticPattern.SUCCESS);
            setJustAdded(true);
        } else {
            if (result?.error !== 'PARTNER_MISMATCH') {
                triggerHaptic(HapticPattern.ERROR);
            }
        }
    };

    useEffect(() => {
        if (justAdded) {
            const timer = setTimeout(() => setJustAdded(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [justAdded]);

    return (
        <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            disabled={localPending || isPending}
            className={cn(
                "h-8 px-3 rounded-lg transition-all z-10 font-black text-[10px] tracking-tight min-w-[70px]",
                justAdded
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 border-none shadow-emerald-100"
                    : "bg-white text-zinc-950 hover:bg-zinc-50 shadow-sm border border-zinc-200",
                "active:scale-95",
                className
            )}
        >
            {localPending ? (
                <Loader2 className="size-3 animate-spin" />
            ) : justAdded ? (
                <div className="flex items-center gap-1">
                    <Check className="size-3 stroke-[3]" />
                    <span className="uppercase italic">Added</span>
                </div>
            ) : (
                <div className="flex items-center gap-1 text-zinc-900">
                    <Plus className="size-3 stroke-[3]" />
                    <span className="uppercase">Add</span>
                </div>
            )}
        </Button>
    );
}
