'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/customer/CartProvider';
import { Button } from '@/components/ui/button';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

interface AddToCartButtonProps {
    product_id: string;
    product_name: string;
    product_image?: string | null;
    unit_price: number;
    vendor_id: string;
    vendor_name: string;
    className?: string;
    has_personalization?: boolean;
}

/**
 * WYSHKIT 2026: AddToCartButton (One Thing Pattern)
 * Minimalist interaction focusing on the "Add" intent.
 * Hardened: Personalization check prevents bypass.
 */
export function AddToCartButton({
    product_id,
    product_name,
    product_image,
    unit_price,
    vendor_id,
    vendor_name,
    className,
    has_personalization = false,
}: AddToCartButtonProps) {
    const router = useRouter();
    const { addToDraftOrder, isPending } = useCart();
    const [justAdded, setJustAdded] = useState(false);
    const [localPending, setLocalPending] = useState(false);

    const handleAction = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (has_personalization && !justAdded) {
            triggerHaptic(HapticPattern.ACTION);
            router.push(`/vendor/${vendor_id}/product/${product_id}`);
            return;
        }

        setLocalPending(true);
        const optimistic_data = {
            product_name,
            product_image: product_image || '/images/logo.png',
            unit_price,
            vendor_id: vendor_id || '',
            vendor_name: vendor_name || 'Store'
        };

        const result = await addToDraftOrder(
            product_id,
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
            if (result?.error !== 'VENDOR_MISMATCH') {
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

    const showCustomize = has_personalization && !justAdded;

    return (
        <Button
            type="button"
            size="sm"
            onClick={handleAction}
            disabled={localPending || isPending}
            className={cn(
                "h-8 px-3 rounded-[var(--radius-md)] transition-all z-10 font-bold text-xs tracking-tight min-w-[70px]",
                justAdded
                    ? "bg-[var(--success)] text-[var(--background)] hover:bg-[var(--success)]/90 border-none shadow-[var(--shadow-sm)]"
                    : showCustomize
                        ? "bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90 border-none"
                        : "bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] shadow-[var(--shadow-sm)] border border-[var(--border)]",
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
            ) : showCustomize ? (
                <div className="flex items-center gap-1">
                    <Sparkles className="size-3" />
                    <span className="uppercase">Select</span>
                </div>
            ) : (
                <div className="flex items-center gap-1 text-[var(--text-primary)]">
                    <Plus className="size-3 stroke-[3]" />
                    <span className="uppercase">Add</span>
                </div>
            )}
        </Button>
    );
}
