'use client';

import { useState } from 'react';
import { Ticket, ChevronDown, ChevronUp, Loader2, Check, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { applyCouponAction } from '@/lib/actions/checkout/checkout';
import { toast } from 'sonner';

interface CouponSlotProps {
    initialCoupon?: { code: string; discount: number } | null;
    disabled?: boolean;
}

export function CouponSlot({ initialCoupon, disabled }: CouponSlotProps) {
    const [code, setCode] = useState(initialCoupon?.code || '');
    const [expanded, setExpanded] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    const handleApply = async () => {
        if (!code.trim()) return;
        setIsApplying(true);
        try {
            const result = await applyCouponAction(code.trim());
            if (result.success) {
                toast.success('Coupon applied successfully');
                setExpanded(false);
            } else {
                toast.error(result.error || 'Invalid coupon code');
            }
        } catch (err) {
            toast.error('Failed to apply coupon');
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemove = async () => {
        setIsApplying(true);
        try {
            const result = await applyCouponAction(null);
            if (result.success) {
                toast.success('Coupon removed');
                setCode('');
            }
        } catch (err) {
            toast.error('Failed to remove coupon');
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <section className={cn("bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--surface-border)] overflow-hidden transition-all duration-300", disabled && "opacity-50 pointer-events-none")}>
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[var(--surface-muted)]/50 transition-colors"
                type="button"
                disabled={disabled}
            >
                <div className="flex items-center gap-2.5">
                    <Ticket className={cn("size-4", initialCoupon ? "text-[var(--success)]" : "text-[var(--text-tertiary)]")} />
                    <div className="text-left">
                        <p className="text-xs font-bold tracking-tight text-[var(--text-primary)]">
                            {initialCoupon ? `Coupon Applied: ${initialCoupon.code}` : 'Have a promo code?'}
                        </p>
                        {initialCoupon && (
                            <p className="text-xs font-bold text-[var(--success)] tracking-tight">
                                Recommended for you
                            </p>
                        )}
                    </div>
                </div>
                {expanded ? <ChevronUp className="size-3.5 text-[var(--text-tertiary)]" /> : <ChevronDown className="size-3.5 text-[var(--text-tertiary)]" />}
            </button>

            {expanded && (
                <div className="px-4 pb-4 pt-1 animate-in slide-in-from-top-2 duration-300 flex gap-2">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        disabled={disabled || isApplying}
                        placeholder="Enter code"
                        className="flex-1 h-10 bg-[var(--surface)] rounded-[var(--radius-md)] px-4 text-xs font-bold border border-[var(--border)] outline-none focus:border-[var(--text-tertiary)] transition-all uppercase"
                    />
                    <button
                        onClick={initialCoupon ? handleRemove : handleApply}
                        disabled={disabled || isApplying || !code.trim()}
                        className={cn(
                            "h-10 px-4 rounded-[var(--radius-md)] text-xs font-bold transition-all active:scale-95 disabled:opacity-50",
                            initialCoupon
                                ? "bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                                : "bg-[var(--text-primary)] text-[var(--text-inverse)] hover:bg-[var(--foreground)]"
                        )}
                    >
                        {isApplying ? <Loader2 className="size-3.5 animate-spin" /> : (initialCoupon ? 'Remove' : 'Apply')}
                    </button>
                </div>
            )}
        </section>
    );
}
