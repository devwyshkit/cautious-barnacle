'use client';

import { useState, useActionState } from 'react';
import { Ticket, X, Loader2, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { applyCouponAction } from '@/lib/actions/checkout/checkout';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/pricing';

interface CouponSlotProps {
    appliedCoupon: {
        code: string;
        discount: number;
    } | null;
}

/**
 * WYSHKIT 2026: Coupon Slot — Collapsed by default (Swiggy/Amazon pattern)
 * Prevents "coupon anxiety" caused by always-visible empty promo-code boxes.
 * Users who have no coupon should not be reminded they might be missing one.
 */
export function CouponSlot({ appliedCoupon }: CouponSlotProps) {
    const [code, setCode] = useState('');
    const [expanded, setExpanded] = useState(false);

    const [applyState, applyAction, isApplying] = useActionState(async (prevState: { success: boolean; message: string } | null, formData: FormData) => {
        const promoCode = formData.get('promoCode') as string;
        if (!promoCode) {
            toast.error('Please enter a coupon code.');
            return { success: false, message: 'No promo code entered' };
        }

        const result = await applyCouponAction(promoCode);
        if (result.success) {
            setCode('');
            setExpanded(false);
            toast.success('Coupon applied!');
            return { success: true, message: 'Coupon applied successfully' };
        } else {
            toast.error('Invalid coupon code.');
            return { success: false, message: 'Invalid coupon' };
        }
    }, null);

    const [removeState, removeAction, isRemoving] = useActionState(async () => {
        await applyCouponAction(null);
        toast.info('Coupon removed');
        return { success: true, message: 'Coupon removed successfully' };
    }, null);

    return (
        <div className="py-2">
            {appliedCoupon ? (
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                            <Ticket className="size-5" />
                        </div>
                        <div>
                            <p className="text-[13px] font-black text-emerald-900 tracking-tight">
                                {appliedCoupon.code} Applied
                            </p>
                            <p className="text-xs font-bold text-emerald-600/70 tracking-wider mt-0.5">
                                Saved {formatCurrency(appliedCoupon.discount)}
                            </p>
                        </div>
                    </div>
                    <form action={removeAction}>
                        <button
                            type="submit"
                            disabled={isRemoving}
                            className="size-8 rounded-full hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors"
                        >
                            {isRemoving ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="rounded-2xl border border-zinc-100 overflow-hidden">
                    {/* Collapsed trigger — prevents coupon anxiety */}
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors"
                    >
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Ticket className="size-4" />
                            <span className="text-xs font-bold tracking-tight">Have a promo code?</span>
                        </div>
                        <ChevronDown className={cn("size-4 text-zinc-300 transition-transform duration-200", expanded && "rotate-180")} />
                    </button>

                    {expanded && (
                        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                            <form action={applyAction} className="flex gap-2">
                                <Input
                                    name="promoCode"
                                    placeholder="Enter code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    autoFocus
                                    className="h-10 flex-1 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-0 px-3 text-[13px] font-bold tracking-wider placeholder:normal-case placeholder:tracking-normal"
                                />
                                <Button
                                    type="submit"
                                    disabled={!code || isApplying}
                                    className="h-10 rounded-xl px-5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold shrink-0"
                                >
                                    {isApplying ? <Loader2 className="size-4 animate-spin" /> : 'Apply'}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
