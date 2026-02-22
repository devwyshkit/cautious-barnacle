import { useState, useActionState, useEffect } from 'react';
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
 * WYSHKIT 2026: AddToCartButton (One Thing Pattern)
 * Swiggy 2026 Pattern: useActionState replaces multiple useState + try/catch blocks.
 * Eradicates manual loading/error management.
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
    const { addToDraftOrder, clearDraftOrder } = useCart();
    const [justAdded, setJustAdded] = useState(false);

    // ELITE: useActionState handles the entire lifecycle (Action -> Pending -> State)
    const [state, dispatch, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        triggerHaptic(HapticPattern.ACTION);

        if (is_identity_available || has_variants) {
            if (partner_id) {
                router.push(`/partner/${partner_id}/item/${item_id}${pathname === '/search' ? '?context=search' : ''}`, { scroll: false });
            }
            return { success: true, navigated: true };
        }

        const optimistic_data = {
            item_name: item_name || 'Item',
            item_image: item_image || '/images/logo.png',
            unit_price: unit_price || 0,
            partner_id: partner_id || undefined,
            partner_name: partner_name || undefined
        };

        const result = await addToDraftOrder(item_id, null, { enabled: false }, [], 1, optimistic_data);

        if (result?.success) {
            triggerHaptic(HapticPattern.SUCCESS);
            setJustAdded(true);
            return { success: true };
        } else {
            if (result?.error !== 'PARTNER_MISMATCH') {
                triggerHaptic(HapticPattern.ERROR);
                toast.error(result?.error || 'Failed to add item');
            }
            return { success: false, error: result?.error };
        }
    }, null);

    useEffect(() => {
        if (justAdded) {
            const timer = setTimeout(() => setJustAdded(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [justAdded]);

    const isOutOfStock = typeof stock_quantity === 'number' && stock_quantity <= 0;
    const isDisabled = isPending || (isOutOfStock && !has_variants);

    if (isOutOfStock && !has_variants) {
        return (
            <div className={cn(
                "h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center",
                className
            )}>
                <span className="text-[11px] font-black text-zinc-400 tracking-wider">Sold Out</span>
            </div>
        );
    }

    return (
        <form action={dispatch}>
            <Button
                type="submit"
                size="default"
                disabled={isDisabled}
                className={cn(
                    "h-11 px-4 rounded-xl transition-all z-10 font-black text-[11px] tracking-wider w-full",
                    justAdded
                        ? "bg-emerald-500 text-white hover:bg-emerald-600 border-none"
                        : isOutOfStock ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200" : "bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm border border-zinc-100",
                    "active:scale-95",
                    className
                )}
            >
                {isPending ? (
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
        </form>
    );
}
