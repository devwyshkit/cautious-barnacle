'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/customer/CartProvider';
import { Button } from '@/components/ui/button';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { logger } from '@/lib/logging/logger';

interface AddToCartButtonProps {
    product_id: string;
    product_name: string;
    product_slug?: string | null;
    product_image?: string | null;
    unit_price: number;
    vendor_id: string;
    vendor_name: string;
    vendor_slug?: string | null;
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
    product_slug,
    product_image,
    unit_price,
    vendor_id,
    vendor_name,
    vendor_slug,
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

        const vSlug = vendor_slug;
        const pSlug = product_slug;

        const optimistic_data = {
            product_name,
            product_image: product_image || '/images/logo.png',
            unit_price,
            vendor_id: vendor_id || '',
            vendor_name: vendor_name || 'Store',
            vendor_slug: vSlug,
            product_slug: pSlug
        };

        if (has_personalization && !justAdded) {
            triggerHaptic(HapticPattern.ACTION);

            // WYSHKIT 2026: Law 11 P0 Hardening
            // Intercepted routes REQUIRE exact slug matching. UUID fallbacks will break interception.
            if (!vSlug || !pSlug) {
                logger.error(`[WYSHKIT 2026 P0] Slug-First Violation: Missing slugs for intercepted navigation. Interception will fail.`, undefined, {
                    vendor: vSlug,
                    product: pSlug,
                    product_id
                });
                // Fallback to ID for functionality, but Law 11 is violated.
                const vRef = vSlug || vendor_id;
                const pRef = pSlug || product_id;
                router.push(`/vendor/${vRef}/product/${pRef}`);
                return;
            }

            router.push(`/vendor/${vSlug}/product/${pSlug}`);
            return;
        }

        setLocalPending(true);
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
            if (result?.error && result.error !== 'VENDOR_MISMATCH') {
                triggerHaptic(HapticPattern.ERROR);
                import('sonner').then(({ toast }) => toast.error(result.error));
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
                "h-8 px-3 rounded-[var(--radius-md)] transition-all z-10 font-bold text-xs min-w-[60px]",
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
                    <span>Added</span>
                </div>
            ) : showCustomize ? (
                <div className="flex items-center gap-1">
                    <Sparkles className="size-3" />
                    <span>Options</span>
                </div>
            ) : (
                <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                    <Plus className="size-3.5 stroke-[3]" />
                    <span>Add</span>
                </div>
            )}
        </Button>
    );
}
