'use client';

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Truck, Check, ShoppingBag, RefreshCw, Info, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Confetti } from "@/components/ui/Confetti";
import { cn } from "@/lib/utils";
import { triggerHaptic, HapticPattern } from "@/lib/utils/haptic";
import { CheckoutData } from "@/lib/actions/checkout";
import { toast } from "sonner";
import { useCart } from "@/components/customer/CartProvider";
import { Button } from "@/components/ui/button";
import { CartSlot } from "./slots/CartSlot";
import { AddressSlot } from "./slots/AddressSlot";
import { formatCurrency } from "@/lib/utils/pricing";
import { CouponSlot } from "./slots/CouponSlot";
import { WalletSlot } from "./slots/WalletSlot";
import { CheckoutAddressProvider, useCheckoutAddress } from "./CheckoutAddressContext";
// WYSHKIT 2026: IdentityForm removed — handled exclusively by OrderTracker (zero redundancy)
import { SlideToPay } from "@/components/features/checkout/SlideToPay";
import { GstinSection } from "./GstinSection";
import { EstimateButton } from "./EstimateButton";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import { hasItemPersonalization } from "@/lib/utils/personalization";
// import { UpsellGrid } from "@/components/features/UpsellGrid";

interface CheckoutLayoutClientProps {
  data: CheckoutData;
}

/**
 * WYSHKIT 2026: Checkout Layout Client Component
 * Orchestrates Parallel Routes slots with Stateless Data
 * 
 * Swiggy 2026 Pattern: Responsive Width Constraints
 * - Data injected via props (no context waterfall)
 * - Local UI state only
 */
function CheckoutLayoutClientInner({
  data,
}: CheckoutLayoutClientProps) {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { clearDraftOrder, addToDraftOrder } = useCart();
  const addressContext = useCheckoutAddress();
  const selectedAddressId = addressContext?.selectedAddressId ?? null;
  const isValidAddress = selectedAddressId && selectedAddressId !== 'guest_location';

  const [gstin, setGstin] = useState<string>((data.gstin as string) || '');
  const [businessName, setBusinessName] = useState<string | null>(null);

  const {
    isProcessing,
    isSuccess,
    uploadOrder,
    setUploadOrder,
    setIsSuccess,
    handlePayment,
    trackingOrderId
  } = usePaymentFlow({
    data,
    selectedAddressId,
    deliveryInstructions: addressContext?.deliveryInstructions,
    clearDraftOrder,
    authUser
  });

  const { items, pricing } = data;
  const isTestMode = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '').startsWith('rzp_test_');


  // Move pricing check into JSX to allow isSuccess overlay to render even with null pricing
  // if (!pricing) return null;


  return (
    <div className="h-[100dvh] flex flex-col bg-white relative font-sans">
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-500">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />
          <div className="relative">
            {/* Swiggy 2026: Success Ripple Effect */}
            <div className="absolute inset-0 size-24 bg-emerald-500/10 rounded-full animate-ping duration-1000" />
            <div className="size-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 relative z-10 border-4 border-white">
              <Check className="size-12 text-white" strokeWidth={3} />
            </div>
          </div>

          <div className="mt-10 space-y-4 relative z-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Order Confirmed</h2>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Preparing your tracker...</p>
            </div>

            <div className="flex flex-col items-center gap-3 pt-4">
              <Loader2 className="size-6 text-zinc-300 animate-spin" />
              <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
                <Sparkles className="size-4 text-amber-500 animate-pulse" />
                <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest leading-none">Redirecting to Design Hub</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WYSHKIT 2026: The main UI is only shown if pricing exists or if we are in success state */}
      {/* WYSHKIT 2026: Granular Error/Empty States to avoid redirect loop */}
      {!items.length && !isSuccess ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-4">
          <div className="size-20 bg-zinc-50 rounded-full flex items-center justify-center mb-2">
            <ShoppingBag className="size-10 text-zinc-300" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-900">Your cart is empty</h2>
            <p className="text-sm text-zinc-500 max-w-xs mx-auto">Looks like you haven't added anything yet. Start browsing to find something you'll love.</p>
          </div>
          <Button
            onClick={() => router.push('/')}
            className="rounded-2xl px-8 h-12 bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs"
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* WYSHKIT 2026: Always show Header and Main Content if items exist */}
          <header className="flex items-center justify-between h-16 px-5 md:px-0 bg-white shrink-0">
            <div className="w-full max-w-2xl mx-auto flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="size-9 flex items-center justify-center text-zinc-900 active:scale-95 transition-all"
              >
                <ChevronLeft className="size-6" />
              </button>
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-zinc-900 leading-tight tracking-tight">{data.partner_name || 'Checkout'}</h2>
                <p className="text-[11px] font-bold text-zinc-400 leading-tight">{data.partner_city || 'Local Store'}</p>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="flex flex-col px-5 md:px-0 py-4 divide-y divide-zinc-100 max-w-2xl mx-auto w-full">
              <section className="pb-6">
                <CartSlot initialHydratedItems={data.items} />
              </section>

              {/* Redundant Upsells removed for Swiggy 2026 Purification */}

              {/* WYSHKIT 2026: Address always visible so user can select/add one */}
              <Suspense fallback={<div className="py-8 flex items-center justify-center"><Loader2 className="size-5 animate-spin text-zinc-400" /></div>}>
                <section className="py-6 space-y-4">
                  <AddressSlot
                    initialAddresses={data.addresses}
                    currentAddress={data.addresses?.find(a => a.id === selectedAddressId) || undefined}
                  />
                  {isValidAddress && (
                    <p className="text-xs text-[var(--primary)] font-bold uppercase tracking-tight">
                      Ready in ~{data.partner_prep_mins || 30} mins
                    </p>
                  )}
                  {isValidAddress && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="delivery-instructions" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          Delivery instructions (optional)
                        </label>
                        <span className="text-[10px] font-bold text-zinc-400 tabular-nums">
                          {(addressContext?.deliveryInstructions ?? '').length}/200
                        </span>
                      </div>
                      <textarea
                        id="delivery-instructions"
                        placeholder="e.g. Leave at door, Ring bell twice"
                        maxLength={200}
                        value={addressContext?.deliveryInstructions ?? ''}
                        onChange={(e) => addressContext?.setDeliveryInstructions(e.target.value)}
                        className="w-full h-20 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]/30 resize-none"
                        rows={2}
                      />
                    </div>
                  )}
                </section>
              </Suspense>

              {authUser && (
                <section className="py-4 space-y-4">
                  <CouponSlot appliedCoupon={data.applied_coupon} />
                  <WalletSlot
                    walletInfo={data.wallet_info}
                    useWalletBalance={data.use_wallet}
                    pricing={data.pricing}
                  />
                </section>
              )}


              {/* WYSHKIT 2026: Bill Summary - Shows loader or summary */}
              <section className="py-6">
                {!pricing ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                    <Loader2 className="size-6 text-zinc-300 animate-spin" />
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Calculating bill...</p>
                      <p className="text-[10px] text-zinc-400 px-10">Select an address to see final delivery fees and taxes.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <span className="text-sm font-bold text-zinc-900">Bill Summary</span>
                      <span className="text-lg font-black text-zinc-950 tabular-nums">{formatCurrency(pricing.total)}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-zinc-600">
                        <span>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
                        <span className="tabular-nums font-semibold text-zinc-950">{formatCurrency(pricing.subtotal)}</span>
                      </div>
                      {pricing.personalization_charges > 0 && (
                        <div className="flex justify-between text-sm text-zinc-600">
                          <span>Personalization</span>
                          <span className="tabular-nums font-semibold text-zinc-950">{formatCurrency(pricing.personalization_charges)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-zinc-600">
                        <span className="flex items-center gap-1.5">
                          <Truck className="size-4" />
                          Delivery
                          {isValidAddress && pricing.delivery_fee === 0 && <span className="text-[10px] text-emerald-600 font-bold px-1.5 py-0.5 bg-emerald-50 rounded-md">FREE</span>}
                        </span>
                        <span className="tabular-nums font-semibold text-zinc-950">
                          {!isValidAddress ? '—' : (pricing.delivery_fee === 0 ? 'FREE' : formatCurrency(pricing.delivery_fee))}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-zinc-600">
                        <span>Platform fee</span>
                        <span className="tabular-nums font-semibold text-zinc-950">
                          {!isValidAddress ? '—' : formatCurrency(pricing.platform_fee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-zinc-600">
                        <span>GST</span>
                        <span className="tabular-nums font-semibold text-zinc-950">
                          {!isValidAddress ? '—' : formatCurrency(pricing.gst)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-zinc-950">Sum to pay</span>
                        <span className="text-xl font-black text-zinc-950 tabular-nums">{formatCurrency(pricing.total)}</span>
                      </div>
                      {((pricing.discount || 0) + (pricing.wallet_discount || 0)) > 0 && (
                        <p className="text-xs font-semibold text-emerald-600 mt-1">
                          You saved {formatCurrency((pricing.discount || 0) + (pricing.wallet_discount || 0))}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 space-y-3">
                      <div className="pt-6 space-y-4">
                        <GstinSection
                          initialGstin={gstin}
                          onGstinChange={setGstin}
                          onBusinessNameChange={setBusinessName}
                        />

                        <EstimateButton
                          items={items}
                          pricing={pricing}
                          businessName={businessName || undefined}
                          gstin={gstin}
                          billingAddress={data.addresses?.find(a => a.id === selectedAddressId)}
                          customerName={authUser?.user_metadata?.full_name}
                        />

                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100/80">
                          <div className="flex items-start gap-3">
                            <Info className="size-4 text-zinc-400 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-zinc-500 leading-normal font-medium italic">
                              Personalized items are crafted within 2 hours. 100% advance payment required. Hyperlocal delivery within 30-60 mins of completion.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Security badge (Unified) */}
              <div className="px-3 py-8 flex items-center justify-center gap-2 opacity-60">
                <ShieldCheck className="size-3 text-zinc-600" />
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Secured by Razorpay</span>
              </div>
            </div>
          </main>

          {/* WYSHKIT 2026: Footer - Adjusted for null pricing */}
          {/* WYSHKIT 2026: Footer - Adjusted for null pricing */}
          <footer className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-zinc-100 z-20">
            <div className="max-w-2xl mx-auto w-full px-4 md:px-0">
              <div className="flex items-center justify-between gap-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-zinc-950 tabular-nums">
                    {pricing ? formatCurrency(pricing.total) : '—'}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-semibold">
                    {pricing ? 'Bill details above' : 'Waiting for address'}
                  </span>
                </div>

                <div className="flex-1">
                  {!authUser ? (
                    <button
                      onClick={() => router.push('/auth?returnUrl=/checkout')}
                      className="w-full h-16 bg-zinc-950 rounded-[24px] flex flex-col items-center justify-center border border-zinc-900 active:scale-95 transition-all shadow-xl shadow-zinc-900/10"
                    >
                      <span className="text-sm font-black text-white">Login to continue</span>
                      <span className="text-[10px] font-bold text-white/70">Securely checkout after login</span>
                    </button>
                  ) : !isValidAddress ? (
                    <div className="w-full h-16 bg-zinc-100 rounded-[24px] flex items-center justify-center border border-zinc-200">
                      <span className="text-xs font-semibold text-zinc-400">Select delivery address</span>
                    </div>
                  ) : !pricing ? (
                    <button
                      onClick={() => {
                        triggerHaptic(HapticPattern.WARNING);
                        router.refresh();
                      }}
                      className="w-full h-16 bg-rose-50 rounded-[24px] flex items-center justify-center border border-rose-100 px-4 text-center hover:bg-rose-100 transition-colors group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <RefreshCw className="size-3 text-rose-600 group-active:animate-spin" />
                          <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Pricing Engine Offline</span>
                        </div>
                        <span className="text-[9px] font-bold text-rose-500/70 uppercase">Tap to retry calculation</span>
                      </div>
                    </button>
                  ) : (
                    <div className="flex-1">
                      <div className="hidden md:block">
                        <button
                          onClick={handlePayment}
                          disabled={isProcessing || isSuccess}
                          className={cn(
                            "w-full h-16 rounded-[24px] flex items-center justify-center transition-all active:scale-95 shadow-xl hover:shadow-2xl",
                            isProcessing || isSuccess
                              ? "bg-zinc-100 border border-zinc-200 text-zinc-400"
                              : "bg-zinc-900 border border-zinc-900 text-white hover:bg-zinc-800"
                          )}
                        >
                          {isProcessing ? (
                            <Loader2 className="size-5 animate-spin" />
                          ) : (
                            <span className="text-sm font-bold">Place Order • {formatCurrency(pricing.total)}</span>
                          )}
                        </button>
                      </div>
                      <div className="md:hidden">
                        <SlideToPay
                          amount={pricing.total}
                          onPay={() => {
                            triggerHaptic(HapticPattern.WARNING);
                            handlePayment();
                          }}
                          isProcessing={isProcessing}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* WYSHKIT 2026: Test Card Hint HIDDEN for Production Feel */}
              {/* {isTestMode && authUser && selectedAddressId && ( ... )} */}
            </div>
          </footer>
        </div>
      )}

    </div>
  );
}

export function CheckoutLayoutClient({ children, ...props }: CheckoutLayoutClientProps & { children?: React.ReactNode }) {
  const defaultAddressId = props.data.addresses?.find((a) => a.is_default)?.id ?? props.data.addresses?.[0]?.id ?? null;
  return (
    <CheckoutAddressProvider defaultAddressId={defaultAddressId}>
      <CheckoutLayoutClientInner {...props} />
      {children}
    </CheckoutAddressProvider>
  );
}
