'use client';

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/client";
import { triggerHaptic, HapticPattern } from "@/lib/utils/haptic";
import { CheckoutData } from "@/lib/actions/checkout/checkout";
import { OrderDetail } from "@/lib/types/order";
import type { User } from "@supabase/supabase-js";
import { SelectedPersonalization, SelectedAddon } from "@/lib/types/personalization";

interface UsePaymentFlowProps {
    data: CheckoutData;
    selectedAddressId: string | null;
    deliveryInstructions?: string;
    clearDraftOrder: () => Promise<void>;
    authUser: User | null;
}

export function usePaymentFlow({
    data,
    selectedAddressId,
    deliveryInstructions,
    clearDraftOrder,
    authUser
}: UsePaymentFlowProps) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [uploadOrder, setUploadOrder] = useState<OrderDetail | null>(null);
    const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

    const successRef = useRef(false);
    const paymentInitiatedRef = useRef(false);
    const activeRazorpayOrderIdRef = useRef<string | null>(null);

    const handleOrderSuccess = useCallback(async (order: OrderDetail | null, orderId?: string, hasPersonalization?: boolean) => {
        // WYSHKIT 2026: Strict idempotency guard
        if (successRef.current) return;
        successRef.current = true;

        logger.info("Payment success intercepted", { orderId, hasPersonalization });

        setIsProcessing(false);
        setIsSuccess(true);

        const finalOrderId = orderId || order?.id;
        const finalHasPersonalization = hasPersonalization ?? order?.has_personalization;

        // SWIGGY 2026: Zero-Delay Redirect — no pre-fetching.
        // OrderTracker's useOrderRealtime handles data loading.
        // Clear cart in background, don't block redirect.
        clearDraftOrder().catch(e => logger.error("Failed to clear cart, proceeding anyway", { error: e }));

        if (finalOrderId) {
            const params = new URLSearchParams();
            params.set('success', 'true');
            if (finalHasPersonalization) params.set('identity', 'true');

            // SWIGGY 2026: Success Ripple Glory Time.
            // We allow the success overlay to breathe before redirecting.
            setTimeout(() => {
                router.replace(`/orders/${finalOrderId}?${params.toString()}`);
            }, 1500);
        } else {
            setTimeout(() => {
                router.replace('/orders');
            }, 1500);
        }
    }, [clearDraftOrder, router]);

    const handlePayment = useCallback(async () => {
        if (!authUser || !data.pricing) return;

        if (isProcessing || isSuccess || paymentInitiatedRef.current) {
            return;
        }

        try {
            paymentInitiatedRef.current = true;
            setIsProcessing(true);

            const { create_payment_order, verify_payment_signature } = await import('@/lib/actions/checkout/payment');

            const response = await create_payment_order(
                Math.round(data.pricing.total * 100),
                'INR',
                {
                    address_id: selectedAddressId || '',
                    draft_items: data.items,
                    pricing: data.pricing,
                    applied_coupon: data.applied_coupon || undefined,
                    use_wallet: data.use_wallet,
                    wallet_discount: data.pricing.wallet_discount || 0,
                    delivery_instructions: deliveryInstructions || undefined,
                    distance_km: data.distance_km || undefined,
                    gstin: data.gstin || undefined,
                }
            );

            if (response.error || !response.order) {
                throw new Error(response.error || 'Failed to create payment order');
            }

            const orderData = response.order;
            activeRazorpayOrderIdRef.current = orderData.id;
            setTrackingOrderId(orderData.id);

            let RazorpayConstructor = typeof window !== 'undefined' ? (window as any).Razorpay : null;
            if (!RazorpayConstructor) {
                for (let i = 0; i < 6; i++) {
                    await new Promise(r => setTimeout(r, 500));
                    RazorpayConstructor = (window as any).Razorpay;
                    if (RazorpayConstructor) break;
                }
            }

            if (RazorpayConstructor) {
                const options = {
                    key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: 'Wyshkit',
                    description: `Order from ${data.partner_name || 'Local Store'}`,
                    order_id: orderData.id,
                    handler: async (razorpayResponse: any) => {
                        try {
                            const verifyResponse = await verify_payment_signature(
                                razorpayResponse.razorpay_order_id,
                                razorpayResponse.razorpay_payment_id,
                                razorpayResponse.razorpay_signature,
                                {
                                    draft_id: orderData.sessionId
                                }
                            );

                            if (verifyResponse.error) {
                                logger.error('Payment verification action failed', { error: verifyResponse.error });
                                toast.error("Still verifying your order... please don't refresh.");
                            }
                            if (verifyResponse.success && !successRef.current) {
                                handleOrderSuccess(verifyResponse.order as unknown as OrderDetail || null, verifyResponse.order_id, verifyResponse.has_personalization ?? undefined);
                            }
                        } catch (err) {
                            toast.error(err instanceof Error ? err.message : 'Payment verification failed');
                            setIsProcessing(false);
                            paymentInitiatedRef.current = false;
                        }
                    },
                    prefill: {
                        name: authUser?.user_metadata?.full_name, phone: authUser?.phone
                    },
                    theme: { color: '#18181b' },
                    modal: {
                        ondismiss: () => {
                            setIsProcessing(false);
                            paymentInitiatedRef.current = false;
                        }
                    },
                    retry: {
                        enabled: false
                    }
                };

                const rzp = new RazorpayConstructor(options);
                rzp.open();
            } else {
                toast.error('Payment gateway not loaded. Please refresh and try again.');
                setIsProcessing(false);
                paymentInitiatedRef.current = false;
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Payment failed');
            setIsProcessing(false);
            paymentInitiatedRef.current = false;
        }
    }, [authUser, data, selectedAddressId, deliveryInstructions, isProcessing, isSuccess, handleOrderSuccess]);

    useEffect(() => {
        if (!trackingOrderId || successRef.current) return;

        const supabase = createClient();
        const channel = supabase
            .channel(`checkout-${trackingOrderId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `razorpay_order_id=eq.${trackingOrderId}`
                },
                async (payload) => {
                    const newOrder = payload.new as any;
                    if (newOrder && !successRef.current && newOrder.razorpay_order_id === trackingOrderId) {
                        const isValidSuccess =
                            newOrder.status === 'PLACED' ||
                            newOrder.status === 'CONFIRMED' ||
                            newOrder.status === 'PAID' ||
                            (newOrder.payment_status === 'PAID' || newOrder.payment_status === 'captured');

                        if (isValidSuccess) {
                            handleOrderSuccess(newOrder, newOrder.id, newOrder.has_personalization);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [trackingOrderId, handleOrderSuccess]);

    return {
        isProcessing,
        isSuccess,
        uploadOrder,
        setUploadOrder,
        setIsSuccess,
        handlePayment,
        trackingOrderId
    };
}
