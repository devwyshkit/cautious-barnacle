'use client';

import { useActionState } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toggleWalletAction } from '@/lib/actions/checkout/checkout';
import type { WalletInfo } from '@/lib/actions/user/wallet';
import type { PricingBreakdown } from '../types';
import { formatCurrency } from '@/lib/utils/pricing';

interface WalletSlotProps {
    walletInfo: WalletInfo | null;
    useWalletBalance: boolean;
    pricing: PricingBreakdown | null;
    onOptimisticToggle?: (checked: boolean) => void;
}

/**
 * WYSHKIT 2026: Wallet Slot Component
 * 
 * Swiggy 2026 Pattern: Stateless & Seamless
 * - Mutations via Server Actions + router.refresh()
 */
export function WalletSlot({ walletInfo, useWalletBalance, pricing }: WalletSlotProps) {
    const [state, toggleAction, isPending] = useActionState(async () => {
        await toggleWalletAction(!useWalletBalance);
        return { success: true };
    }, null);

    if (!walletInfo || walletInfo.balance <= 0 || !pricing) return null;

    return (
        <div className="py-2">
            <div className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                useWalletBalance
                    ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200"
                    : "bg-zinc-50 border-zinc-100 text-zinc-900"
            )}>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "size-10 rounded-xl flex items-center justify-center transition-colors",
                        useWalletBalance ? "bg-white/10" : "bg-white border border-zinc-100 shadow-sm"
                    )}>
                        <Wallet className={cn("size-5", useWalletBalance ? "text-white" : "text-zinc-600")} />
                    </div>
                    <div>
                        <p className="text-[13px] font-black tracking-tight">
                            Wyshkit Money
                        </p>
                        <p className={cn(
                            "text-[10px] font-bold uppercase tracking-wider mt-0.5",
                            useWalletBalance ? "text-white/60" : "text-zinc-400"
                        )}>
                            Balance: {formatCurrency(walletInfo.balance)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {useWalletBalance && (
                        <span className="text-[11px] font-black text-white/90">
                            -{formatCurrency(pricing.wallet_discount)}
                        </span>
                    )}
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin text-zinc-400" />
                    ) : (
                        <Switch
                            checked={useWalletBalance}
                            onCheckedChange={() => toggleAction()}
                            disabled={isPending}
                            className={cn(
                                "data-[state=checked]:bg-emerald-500",
                                !useWalletBalance && "bg-zinc-200"
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
