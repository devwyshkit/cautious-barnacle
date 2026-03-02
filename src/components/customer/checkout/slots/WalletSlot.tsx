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
    disabled?: boolean;
}

/**
 * WYSHKIT 2026: Wallet Slot Component
 * 
 * WYSHKIT 2026 Pattern: Stateless & Seamless
 * - Mutations via Server Actions + router.refresh()
 */
export function WalletSlot({ walletInfo, useWalletBalance, pricing, disabled }: WalletSlotProps) {
    const [state, toggleAction, isPending] = useActionState(async () => {
        await toggleWalletAction(!useWalletBalance);
        return { success: true };
    }, null);

    if (!walletInfo || walletInfo.balance <= 0 || !pricing) return null;

    return (
        <div className="py-2">
            <div className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                useWalletBalance
                    ? "bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--text-inverse)] shadow-lg shadow-[var(--shadow-sm)]"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] shadow-sm"
            )}>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "size-10 rounded-xl flex items-center justify-center transition-colors",
                        useWalletBalance ? "bg-[var(--surface)]/10" : "bg-[var(--surface)] border border-[var(--border)] shadow-sm"
                    )}>
                        <Wallet className={cn("size-5", useWalletBalance ? "text-[var(--text-inverse)]" : "text-[var(--text-secondary)]")} />
                    </div>
                    <div>
                        <p className="text-sm font-bold tracking-tight">
                            Wyshkit Money
                        </p>
                        <p className={cn(
                            "text-xs font-bold tracking-tight mt-0.5",
                            useWalletBalance ? "text-[var(--text-inverse)]/60" : "text-[var(--text-tertiary)]"
                        )}>
                            Balance: {formatCurrency(walletInfo.balance)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {useWalletBalance && (
                        <span className="text-xs font-bold text-[var(--text-inverse)]/90">
                            -{formatCurrency(pricing.wallet_discount)}
                        </span>
                    )}
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin text-[var(--text-tertiary)]" />
                    ) : (
                        <Switch
                            checked={useWalletBalance}
                            onCheckedChange={() => toggleAction()}
                            disabled={isPending || disabled}
                            className={cn(
                                "data-[state=checked]:bg-[var(--success)]",
                                !useWalletBalance && "bg-[var(--border)]"
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
