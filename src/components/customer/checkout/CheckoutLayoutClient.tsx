'use client';

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Truck, Check, ShoppingBag, RefreshCw, Info, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Confetti } from "@/components/ui/Confetti";
import { cn } from "@/lib/utils";
import { triggerHaptic, HapticPattern } from "@/lib/utils/haptic";
import { CheckoutData } from "@/lib/actions/checkout/checkout";
import { toast } from "sonner";
import { useCart } from "@/components/customer/CartProvider";
import { Button } from "@/components/ui/button";
import { CartSlot } from "./slots/CartSlot";
import { AddressSlot } from "./slots/AddressSlot";
import { formatCurrency } from "@/lib/utils/pricing";
import { CouponSlot } from "./slots/CouponSlot";
import { CheckoutAddressProvider, useCheckoutAddress } from "./CheckoutAddressContext";

import { useOptimistic, useTransition, useMemo } from "react";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import { BlocksEngine, BlockData } from "@/components/ui/BlocksEngine";
import { GstinSection } from "./GstinSection";
import { EstimateButton } from "./EstimateButton";
import { SlideToPay } from "@/components/customer/checkout/SlideToPay";

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
  const { items, pricing: serverPricing } = data;
  const selectedAddressId = data.selected_address_id;
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

  const isTestMode = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '').startsWith('rzp_test_');

  const pricing = serverPricing;

  // Move pricing check into JSX to allow isSuccess overlay to render even with null pricing
  // if (!pricing) return null;


  return (
    <div className="h-[100dvh] flex flex-col bg-white relative font-sans">
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-700">
          <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-emerald-50 to-transparent pointer-events-none" />
          <div className="relative">
            {/* Swiggy 2026: Success Ripple Effect */}
            <div className="absolute inset-0 size-24 bg-emerald-500/10 rounded-full animate-ping duration-1000" />
            <div className="size-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm shadow-emerald-500/20 relative z-10 border-4 border-white">
              <Check className="size-12 text-white" strokeWidth={3} />
            </div>
          </div>

          <div className="mt-10 space-y-4 relative z-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Order Confirmed!</h2>
              <p className="text-sm font-bold text-zinc-400 tracking-wider">Taking you to your order...</p>
            </div>

            <div className="flex flex-col items-center gap-3 pt-4">
              <Loader2 className="size-6 text-zinc-300 animate-spin" />
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
            className="rounded-2xl px-8 h-12 bg-zinc-900 text-white font-bold tracking-wider text-xs"
          >
            Browse items
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* WYSHKIT 2026: Always show Header and Main Content if items exist */}
          <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-5 md:px-0 glass-morphism shrink-0">
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
            <div className="flex flex-col py-6 space-y-6 max-w-2xl mx-auto w-full">
              <BlocksEngine
                blocks={[
                  {
                    id: 'cart-items',
                    type: 'CHECKOUT_ITEMS',
                    data: items,
                  },
                  {
                    id: 'address-section',
                    type: 'CHECKOUT_ADDRESS',
                    data: data.addresses,
                    metadata: { selected_id: selectedAddressId }
                  },
                  {
                    id: 'bill-summary',
                    type: 'CHECKOUT_SUMMARY',
                    data: [],
                    metadata: { pricing: pricing }
                  }
                ]}
              />

              <div className="px-5 md:px-0 space-y-6">
                <GstinSection
                  initialGstin={gstin}
                  onGstinChange={setGstin}
                  onBusinessNameChange={setBusinessName}
                />

                <EstimateButton
                  items={items}
                  pricing={pricing || {} as any}
                  businessName={businessName || undefined}
                  gstin={gstin}
                  billingAddress={data.addresses?.find(a => a.id === selectedAddressId)}
                  customerName={authUser?.user_metadata?.full_name}
                />
              </div>

              {/* Security badge (Unified) */}
              <div className="px-3 py-8 flex items-center justify-center gap-2 opacity-60">
                <ShieldCheck className="size-3 text-zinc-600" />
                <span className="text-[11px] font-bold text-zinc-600 tracking-wider">Secured by Razorpay</span>
              </div>
            </div>
          </main>

          {/* WYSHKIT 2026: Footer - Adjusted for null pricing */}
          <footer className="sticky bottom-0 glass-morphism z-20 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
            <div className="max-w-2xl mx-auto w-full px-4 md:px-0">
              <div className="flex items-center justify-between gap-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-zinc-950 tabular-nums leading-none">
                    {pricing ? formatCurrency(pricing.total) : '—'}
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold">
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
                      <span className="text-xs font-bold text-white/70">Securely checkout after login</span>
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
                          <span className="text-xs font-black text-rose-600 tracking-wider">Pricing Engine Offline</span>
                        </div>
                        <span className="text-[11px] font-bold text-rose-500/70">Tap to retry calculation</span>
                      </div>
                    </button>
                  ) : (
                    <div className="flex-1">
                      <div className="hidden md:block">
                        <button
                          onClick={handlePayment}
                          disabled={isProcessing || isSuccess}
                          className={cn(
                            "w-full h-16 rounded-[24px] flex items-center justify-center transition-all active:scale-95 shadow-xl hover:shadow-sm",
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
  return (
    <CheckoutAddressProvider>
      <CheckoutLayoutClientInner {...props} />
      {children}
    </CheckoutAddressProvider>
  );
}
