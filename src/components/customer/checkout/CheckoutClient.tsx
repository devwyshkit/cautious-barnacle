'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, MapPin, CreditCard, FileText } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/components/customer/CartProvider';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';
import { CheckoutData } from '@/lib/actions/checkout/checkout';
import { CheckoutAddressProvider, useCheckoutAddress } from './CheckoutAddressContext';
import { AddressSlot } from './slots/AddressSlot';
import { WalletSlot } from './slots/WalletSlot';
import { GstinSection } from './GstinSection';
import { EstimateButton } from './EstimateButton';
import { SlideToPay } from './SlideToPay';
import { formatCurrency } from '@/lib/utils/pricing';
import { Sparkles } from 'lucide-react';

interface CheckoutClientProps {
    initialData: CheckoutData;
}

function CheckoutClientInner({ initialData }: CheckoutClientProps) {
    const router = useRouter();
    const { user: authUser } = useAuth();
    const { clearDraftOrder } = useCart();
    const addressCtx = useCheckoutAddress();

    const [checkoutData, setCheckoutData] = useState<CheckoutData>(initialData);
    const [businessName, setBusinessName] = useState<string | null>(null);

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
        <div className="max-w-lg mx-auto min-h-screen flex flex-col">
            {/* Simple back header — not sticky, no clutter */}
            <header className="flex items-center gap-3 px-4 pt-5 pb-3">
                <button
                    onClick={() => router.back()}
                    className="size-9 rounded-full bg-white border border-zinc-100 flex items-center justify-center shadow-sm active:scale-95 transition-all"
                    aria-label="Go back"
                >
                    <ArrowLeft className="size-4 text-zinc-600" />
                </button>
                <h1 className="text-lg font-black text-zinc-950 tracking-tight">Checkout</h1>
            </header>

            <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-3">

                {/* DELIVERY SECTION */}
                <section className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-zinc-50">
                        <MapPin className="size-3.5 text-[var(--primary)]" />
                        <span className="text-[11px] font-black text-zinc-500 tracking-widest">Delivery</span>
                    </div>
                    <div className="px-4 py-3">
                        <AddressSlot
                            initialAddresses={checkoutData.addresses}
                            currentAddress={checkoutData.addresses?.find((a: any) => a.id === checkoutData.selected_address_id)}
                            disabled={paymentFlow.isProcessing}
                        />
                        <div className="mt-3">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                Instructions <span className="font-semibold normal-case text-zinc-300">(optional)</span>
                            </label>
                            <textarea
                                value={addressCtx?.deliveryInstructions ?? ''}
                                onChange={(e) => addressCtx?.setDeliveryInstructions(e.target.value)}
                                disabled={paymentFlow.isProcessing}
                                placeholder="e.g. Ring bell, leave at gate..."
                                className="w-full mt-1.5 h-16 px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-100 text-sm font-medium focus:bg-white focus:border-zinc-300 transition-all resize-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                </section>

                {/* BILL SECTION */}
                <section className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-zinc-50">
                        <FileText className="size-3.5 text-[var(--primary)]" />
                        <span className="text-[11px] font-black text-zinc-500 tracking-widest">Bill</span>
                    </div>

                    {/* Products */}
                    <div className="px-4 py-3 space-y-3 border-b border-zinc-50">
                        {checkoutData.products.map((product: any) => (
                            <div key={product.id} className="flex items-center gap-3">
                                <div className="relative size-12 rounded-xl bg-zinc-100 overflow-hidden shrink-0">
                                    <Image
                                        src={product.product_image || '/images/logo.png'}
                                        alt={product.product_name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-zinc-900 truncate">{product.product_name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-xs text-zinc-500">Qty {product.quantity}</span>
                                        {product.is_personalized && (
                                            <span className="flex items-center gap-0.5 text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">
                                                <Sparkles className="size-2" /> Personalized
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm font-black text-zinc-900">{formatCurrency(product.line_total)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Pricing Breakdown */}
                    {checkoutData.pricing && (
                        <div className="px-4 py-3 space-y-2">
                            <div className="flex justify-between text-xs font-bold text-zinc-500">
                                <span>Products</span>
                                <span>{formatCurrency(checkoutData.pricing.subtotal)}</span>
                            </div>
                            {checkoutData.pricing.delivery_fee > 0 && (
                                <div className="flex justify-between text-xs font-bold text-zinc-500">
                                    <span>Delivery</span>
                                    <span>{formatCurrency(checkoutData.pricing.delivery_fee)}</span>
                                </div>
                            )}
                            {checkoutData.pricing.platform_fee > 0 && (
                                <div className="flex justify-between text-xs font-bold text-zinc-500">
                                    <span>Platform fee</span>
                                    <span>{formatCurrency(checkoutData.pricing.platform_fee)}</span>
                                </div>
                            )}
                            {checkoutData.pricing.gst > 0 && (
                                <div className="flex justify-between text-xs font-bold text-zinc-500">
                                    <span>GST (18%)</span>
                                    <span>{formatCurrency(checkoutData.pricing.gst)}</span>
                                </div>
                            )}
                            {checkoutData.pricing.discount > 0 && (
                                <div className="flex justify-between text-xs font-bold text-emerald-600">
                                    <span>Discount</span>
                                    <span>- {formatCurrency(checkoutData.pricing.discount)}</span>
                                </div>
                            )}
                            {checkoutData.pricing.wallet_discount > 0 && (
                                <div className="flex justify-between text-xs font-bold text-emerald-600">
                                    <span>Wallet</span>
                                    <span>- {formatCurrency(checkoutData.pricing.wallet_discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                                <span className="text-sm font-black text-zinc-900">To pay</span>
                                <span className="text-base font-black text-zinc-900">{formatCurrency(checkoutData.pricing.total)}</span>
                            </div>
                            {checkoutData.pricing.cashback_amount > 0 && (
                                <p className="text-[11px] font-bold text-emerald-600 text-right">
                                    🎁 Earn {formatCurrency(checkoutData.pricing.cashback_amount)} cashback after delivery
                                </p>
                            )}
                        </div>
                    )}
                </section>

                {/* PAYMENT SECTION */}
                <section className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-zinc-50">
                        <CreditCard className="size-3.5 text-[var(--primary)]" />
                        <span className="text-[11px] font-black text-zinc-500 tracking-widest">Payment</span>
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
                            onGstinChange={(val) => setCheckoutData(prev => ({ ...prev, gstin: val }))}
                            onBusinessNameChange={setBusinessName}
                            disabled={paymentFlow.isProcessing}
                        />
                        {checkoutData.pricing && checkoutData.gstin && (
                            <EstimateButton
                                products={checkoutData.products}
                                pricing={checkoutData.pricing}
                                gstin={checkoutData.gstin}
                                businessName={businessName || undefined}
                            />
                        )}
                    </div>
                </section>

                {/* Disclaimer */}
                <p className="text-[11px] text-zinc-400 text-center px-4 leading-relaxed">
                    100% advance payment. Personalized products cannot be returned once production starts.
                </p>
            </div>

            {/* Fixed Slide to Pay — healthy friction */}
            <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-4 pb-safe bg-white/90 backdrop-blur-xl border-t border-zinc-100 pt-3 pb-5">
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
