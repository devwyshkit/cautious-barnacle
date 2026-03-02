'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, MapPin, CreditCard, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/components/customer/CartProvider';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';
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

interface CheckoutClientProps {
    initialData: CheckoutData;
}

function CheckoutClientInner({ initialData }: CheckoutClientProps) {
    const router = useRouter();
    const { user: authUser } = useAuth();
    const { clearDraftOrder } = useCart();
    const addressCtx = useCheckoutAddress();

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

    const canPay = !!checkoutData.selected_address_id && !!checkoutData.pricing && !paymentFlow.isProcessing;
    const payTotal = checkoutData.pricing?.total ?? 0;

    return (
        <div className="max-w-lg mx-auto min-h-[100dvh] flex flex-col">
            {/* Simple back header — not sticky, no clutter */}
            <header className="flex items-center gap-3 px-4 pt-5 pb-3">
                <button
                    onClick={() => router.back()}
                    className="size-9 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-sm active:scale-95 transition-all"
                    aria-label="Go back"
                >
                    <ArrowLeft className="size-4 text-[var(--text-secondary)]" />
                </button>
                <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Checkout</h1>
            </header>

            <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-3">

                {/* ITEMS SECTION - Anchoring Commitment */}
                <section className="bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[var(--surface-muted)]">
                        <ShieldCheck className="size-3.5 text-[var(--primary)]" />
                        <span className="text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase">Your Order</span>
                    </div>
                    <div className="px-4 py-3 space-y-3">
                        {checkoutData.products.map(product => (
                            <div key={product.id} className="flex items-center gap-3">
                                <div className="relative size-12 rounded-[var(--radius-md)] bg-[var(--surface-muted)] overflow-hidden shrink-0">
                                    <Image
                                        src={product.product_image || '/images/logo.png'}
                                        alt={product.product_name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-bold text-[var(--text-primary)] truncate">{product.product_name}</p>
                                        <Link
                                            href={`/vendor/${product.vendor_id}/product/${product.product_id}?edit=true&cartProductId=${product.id}&variantId=${product.variant_id || ''}&quantity=${product.quantity}&addons=${product.selected_addons?.map((a: any) => a.id).join(',') || ''}&returnUrl=/checkout`}
                                            className="text-xs font-bold text-[var(--primary)] uppercase tracking-tight px-2 py-1 bg-[var(--well-destructive)] rounded-[var(--radius-md)] hover:opacity-80 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-xs text-[var(--text-secondary)]">Qty {product.quantity}</span>
                                        {product.is_personalized && (
                                            <span className="flex items-center gap-0.5 text-xs font-bold text-[var(--warning)] bg-[var(--well-warning)] border border-[var(--warning)]/20 px-1.5 py-0.5 rounded-full">
                                                <Sparkles className="size-2" /> Personalized
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(product.line_total)}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* DELIVERY SECTION */}
                <section className="bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[var(--surface-muted)]">
                        <MapPin className="size-3.5 text-[var(--primary)]" />
                        <span className="text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase">Delivery</span>
                    </div>
                    <div className="px-4 py-3">
                        <AddressSlot
                            initialAddresses={checkoutData.addresses}
                            currentAddress={checkoutData.addresses?.find(a => a.id === checkoutData.selected_address_id)}
                            disabled={paymentFlow.isProcessing}
                            etaMinutes={checkoutData.eta_minutes || 45}
                        />
                        <div className="mt-3">
                            <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                                Instructions <span className="font-semibold normal-case text-[var(--text-tertiary)]">(optional)</span>
                            </label>

                            {/* WYSHKIT 2026: Anticipatory Presets (Zero Shadow UX) */}
                            <div className="flex flex-wrap gap-2 mt-2 mb-3">
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
                                        className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors active:scale-95"
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

                {/* COUPON SECTION - Progressive Disclosure */}
                <CouponSlot
                    initialCoupon={checkoutData.applied_coupon}
                    disabled={paymentFlow.isProcessing}
                />

                {/* BILL SECTION */}
                <section className="bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[var(--surface-muted)]">
                        <FileText className="size-3.5 text-[var(--primary)]" />
                        <span className="text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase">Bill</span>
                    </div>

                    {/* Pricing Breakdown */}
                    {checkoutData.pricing && (
                        <div className="px-4 py-3 space-y-2">
                            <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                                <span>Products</span>
                                <span>{formatCurrency(checkoutData.pricing.subtotal)}</span>
                            </div>
                            {checkoutData.pricing.delivery_fee > 0 && (
                                <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                                    <span>Delivery</span>
                                    <span>{formatCurrency(checkoutData.pricing.delivery_fee)}</span>
                                </div>
                            )}
                            {checkoutData.pricing.platform_fee > 0 && (
                                <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                                    <span>Platform fee</span>
                                    <span>{formatCurrency(checkoutData.pricing.platform_fee)}</span>
                                </div>
                            )}
                            {checkoutData.pricing.gst > 0 && (
                                <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                                    <span>GST</span>
                                    <span>{formatCurrency(checkoutData.pricing.gst)}</span>
                                </div>
                            )}
                            {checkoutData.pricing.discount > 0 && (
                                <div className="flex justify-between text-xs font-bold text-[var(--success)]">
                                    <span>Discount</span>
                                    <span>- {formatCurrency(checkoutData.pricing.discount)}</span>
                                </div>
                            )}
                            {checkoutData.pricing.wallet_discount > 0 && (
                                <div className="flex justify-between text-xs font-bold text-[var(--success)]">
                                    <span>Wallet</span>
                                    <span>- {formatCurrency(checkoutData.pricing.wallet_discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t border-[var(--border)]">
                                <span className="text-sm font-bold text-[var(--text-primary)]">To pay</span>
                                <span className="text-base font-bold text-[var(--text-primary)]">{formatCurrency(checkoutData.pricing.total)}</span>
                            </div>
                            {checkoutData.pricing.wyshkit_money_earned > 0 && (
                                <p className="text-xs font-bold text-[var(--success)] text-right">
                                    🎁 Earn {formatCurrency(checkoutData.pricing.wyshkit_money_earned)} WyshKit Money after delivery
                                </p>
                            )}
                        </div>
                    )}
                </section>

                {/* PAYMENT SECTION */}
                <section className="bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[var(--surface-muted)]">
                        <CreditCard className="size-3.5 text-[var(--primary)]" />
                        <span className="text-xs font-bold text-[var(--text-secondary)] tracking-widest">Payment</span>
                    </div>
                    <div className="px-4 py-3 space-y-4">
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

                {/* Disclaimer */}
                <p className="text-xs text-[var(--text-tertiary)] text-center px-4 leading-relaxed">
                    100% advance payment. Personalized products cannot be returned once production starts.
                </p>
            </div>

            {/* Fixed Slide to Pay — healthy friction */}
            <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-4 pb-safe bg-[var(--surface)]/90 backdrop-blur-xl border-t border-[var(--border)] pt-3 pb-5">
                <SlideToPay
                    onPay={() => {
                        if (!authUser) {
                            router.push('/auth?returnUrl=/checkout');
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

export function CheckoutClient({ initialData }: CheckoutClientProps) {
    return (
        <CheckoutAddressProvider>
            <CheckoutClientInner initialData={initialData} />
        </CheckoutAddressProvider>
    );
}
