'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, MapPin, CreditCard, FileText, Sparkles } from 'lucide-react';
import { AppText } from '@/components/ui/Typography';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/components/customer/CartProvider';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';
import { useRazorpay } from '@/hooks/useRazorpay';
import { CheckoutData } from '@/lib/actions/checkout/checkout';
import { triggerHaptic, HapticPattern } from "@/lib/utils/haptic";
import { CheckoutAddressProvider, useCheckoutAddress } from './CheckoutAddressContext';
import { AddressSlot } from './slots/AddressSlot';
import { WalletSlot } from './slots/WalletSlot';
import { CouponSlot } from './slots/CouponSlot';
import { GstinSection } from './GstinSection';
import { EstimateButton } from './EstimateButton';
import { SlideToPay } from './SlideToPay';
import { formatCurrency } from '@/lib/utils/pricing';
import { CartSlot } from './slots/CartSlot';

interface CheckoutClientProps {
    initialData: CheckoutData;
}

import { useUI } from '@/providers/UIProvider';

function CheckoutClientInner({ initialData }: CheckoutClientProps) {
    const router = useRouter();
    const { user: authUser } = useAuth();
    const { clearDraftOrder } = useCart();
    const addressCtx = useCheckoutAddress();
    const { openOTPSheet, openProductSheet } = useUI();
    const { loadRazorpay } = useRazorpay();

    // WYSHKIT 2026: Zero Shadow State 
    // We strictly use initialData (refreshed via router.refresh)
    const checkoutData = initialData;

    const paymentFlow = usePaymentFlow({
        data: checkoutData,
        selectedAddressId: checkoutData.selected_address_id,
        deliveryInstructions: addressCtx?.deliveryInstructions,
        clearDraftOrder: clearDraftOrder,
        authUser: authUser ?? null,
    });

    // WYSHKIT 2026: Pre-load Razorpay SDK on mount
    React.useEffect(() => {
        loadRazorpay();
    }, [loadRazorpay]);

    const canPay = !!checkoutData.selected_address_id && !!checkoutData.pricing && !paymentFlow.isProcessing;
    const payTotal = checkoutData.pricing?.total ?? 0;

    return (
        <div className="max-w-4xl mx-auto min-h-[100dvh] flex flex-col lg:flex-row lg:gap-10 lg:items-start lg:px-6">
            {/* Main Content Area (Left Column on Desktop) */}
            <div className="flex-1 w-full lg:max-w-2xl">
                <div className="flex-1 px-4 space-y-4 lg:px-0 pb-32 lg:pb-24 mt-6">
                    {/* ITEMS SECTION - Anchoring Commitment */}
                    <section className="bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
                        <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[var(--surface-muted)]">
                            <ShieldCheck className="size-3.5 text-[var(--primary)]" />
                            <AppText variant="caption" weight="bold" color="secondary">Your Order</AppText>
                        </div>
                        <div className="px-4 py-4">
                            <CartSlot
                                initialHydratedProducts={checkoutData.products}
                                editable={!paymentFlow.isProcessing}
                            />
                        </div>
                    </section>

                    {/* DELIVERY SECTION */}
                    <section className="bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
                        <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[var(--surface-muted)]">
                            <MapPin className="size-3.5 text-[var(--primary)]" />
                            <AppText variant="caption" weight="bold" color="secondary">Delivery Details</AppText>
                        </div>
                        <div className="px-4 py-4">
                            <AddressSlot
                                initialAddresses={checkoutData.addresses}
                                currentAddress={checkoutData.addresses?.find(a => a.id === checkoutData.selected_address_id)}
                                disabled={paymentFlow.isProcessing}
                                etaMinutes={checkoutData.eta_minutes}
                            />
                            <div className="mt-5">
                                <AppText variant="caption" weight="medium" color="tertiary" className="mb-2 block">
                                    Delivery Instructions <span className="opacity-60">(optional)</span>
                                </AppText>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {[
                                        { id: 'silence', label: '🤫 Silence Mode', hint: 'Dont ring bell' },
                                        { id: 'gate', label: '🚧 Gate Drop', hint: 'Leave at gate' },
                                        { id: 'careful', label: '💎 Fragile', hint: 'Handle with care' }
                                    ].map(preset => (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => {
                                                triggerHaptic(HapticPattern.ACTION);
                                                const current = addressCtx?.deliveryInstructions ?? '';
                                                if (current.includes(preset.hint)) return;
                                                addressCtx?.setDeliveryInstructions(current ? `${current}, ${preset.hint}` : preset.hint);
                                            }}
                                            className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-all active:scale-95"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={addressCtx?.deliveryInstructions ?? ''}
                                    onChange={(e) => addressCtx?.setDeliveryInstructions(e.target.value)}
                                    disabled={paymentFlow.isProcessing}
                                    placeholder="e.g. Ring bell, leave at gate..."
                                    className="w-full h-16 px-4 py-3 rounded-[var(--radius-xl)] bg-[var(--surface-muted)] border border-[var(--border)] text-sm font-medium focus:bg-[var(--surface)] focus:border-[var(--primary)] transition-all resize-none outline-none disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </section>

                    {/* COUPON SECTION - Mobile Only Disclosure (will be duplicated for desktop column if needed, or kept here) */}
                    <div className="lg:hidden">
                        <CouponSlot
                            initialCoupon={checkoutData.applied_coupon}
                            disabled={paymentFlow.isProcessing}
                        />
                    </div>

                    {/* Mobile-only Bill Summary (shown before payment bar) */}
                    <div className="lg:hidden space-y-4">
                        <section className="bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
                            <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[var(--surface-muted)]">
                                <FileText className="size-3.5 text-[var(--primary)]" />
                                <AppText variant="caption" weight="bold" color="secondary">Bill Summary</AppText>
                            </div>
                            <BillBreakdown pricing={checkoutData.pricing} />
                        </section>

                        <section className="bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
                            <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[var(--surface-muted)]">
                                <CreditCard className="size-3.5 text-[var(--primary)]" />
                                <AppText variant="caption" weight="bold" color="secondary">Payment Details</AppText>
                            </div>
                            <div className="px-4 py-4 space-y-4">
                                <WalletSlot
                                    walletInfo={checkoutData.wallet_info}
                                    useWalletBalance={checkoutData.use_wallet}
                                    pricing={checkoutData.pricing}
                                    disabled={paymentFlow.isProcessing}
                                />
                                <GstinSection
                                    initialGstin={checkoutData.gstin || ''}
                                    disabled={paymentFlow.isProcessing}
                                />
                            </div>
                        </section>
                    </div>

                    <p className="text-[10px] text-[var(--text-tertiary)] text-center px-4 leading-relaxed lg:text-left lg:px-0">
                        100% advance payment. Personalized products cannot be returned once production starts.
                    </p>
                </div>
            </div>

            {/* Right Column (Desktop Only) */}
            <aside className="hidden lg:flex flex-col w-[380px] pt-24 sticky top-0 gap-4">
                <CouponSlot
                    initialCoupon={checkoutData.applied_coupon}
                    disabled={paymentFlow.isProcessing}
                />

                <section className="bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[var(--surface-muted)]">
                        <FileText className="size-3.5 text-[var(--primary)]" />
                        <AppText variant="caption" weight="bold" color="secondary">Bill Summary</AppText>
                    </div>
                    <BillBreakdown pricing={checkoutData.pricing} />
                </section>

                <section className="bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[var(--surface-muted)]">
                        <CreditCard className="size-3.5 text-[var(--primary)]" />
                        <AppText variant="caption" weight="bold" color="secondary">Payment</AppText>
                    </div>
                    <div className="px-4 py-4 space-y-4">
                        <WalletSlot
                            walletInfo={checkoutData.wallet_info}
                            useWalletBalance={checkoutData.use_wallet}
                            pricing={checkoutData.pricing}
                            disabled={paymentFlow.isProcessing}
                        />
                        <GstinSection
                            initialGstin={checkoutData.gstin || ''}
                            disabled={paymentFlow.isProcessing}
                        />
                    </div>
                </section>

                {/* Desktop Payment Button */}
                <div className="mt-2">
                    <SlideToPay
                        onPay={() => {
                            if (!authUser) {
                                triggerHaptic(HapticPattern.WARNING);
                                openOTPSheet();
                                return;
                            }
                            paymentFlow.handlePayment();
                        }}
                        amount={payTotal}
                        isProcessing={paymentFlow.isProcessing}
                    />
                </div>
            </aside>

            {/* Fixed Slide to Pay — Mobile Only */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-4 pb-safe bg-[var(--surface)]/90 backdrop-blur-xl border-t border-[var(--border)] pt-3 pb-5 z-20">
                <SlideToPay
                    onPay={() => {
                        if (!authUser) {
                            triggerHaptic(HapticPattern.WARNING);
                            openOTPSheet();
                            return;
                        }
                        paymentFlow.handlePayment();
                    }}
                    amount={payTotal}
                    isProcessing={paymentFlow.isProcessing}
                />
            </div>
        </div>
    );
}

function BillBreakdown({ pricing }: { pricing: any }) {
    if (!pricing) return null;
    return (
        <div className="px-4 py-4 space-y-3">
            <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                <span>Items Subtotal</span>
                <span className="tabular-nums">{formatCurrency(pricing.subtotal)}</span>
            </div>
            {pricing.personalization_charges > 0 && (
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                        <span>Personalization</span>
                        <span className="tabular-nums">{formatCurrency(pricing.personalization_charges)}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--success)] uppercase tracking-wider">Details post-payment</span>
                </div>
            )}
            {pricing.delivery_fee > 0 && (
                <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                    <span>Delivery Fee</span>
                    <span className="tabular-nums">{formatCurrency(pricing.delivery_fee)}</span>
                </div>
            )}
            {pricing.discount > 0 && (
                <div className="flex justify-between text-xs font-bold text-[var(--success)]">
                    <span>Discount</span>
                    <span className="tabular-nums">- {formatCurrency(pricing.discount)}</span>
                </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
                <AppText variant="label" weight="bold" color="primary">Total to Pay</AppText>
                <AppText variant="body" weight="bold" color="primary" className="tabular-nums">{formatCurrency(pricing.total)}</AppText>
            </div>
        </div>
    );
}

export function CheckoutClient({ initialData }: CheckoutClientProps) {
    return (
        <CheckoutAddressProvider>
            <CheckoutClientInner initialData={initialData} />
        </CheckoutAddressProvider>
    );
}
