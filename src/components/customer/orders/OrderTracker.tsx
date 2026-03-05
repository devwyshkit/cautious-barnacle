'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Confetti } from '@/components/ui/Confetti';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import {
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  MapPin,
  Camera,
  MessageSquare,
  Timer,
  ShoppingBag,
  Info,
  Sparkles,
  RefreshCw,
  X,
  Phone,
  ArrowLeft
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';
import { useOrderRealtime } from '@/hooks/useOrderRealtime';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { OrderDetail, PreviewSubmission, OrderProductDetail } from '@/lib/types/order';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { SurfaceErrorBoundaryWithRouter } from '@/components/error/SurfaceErrorBoundary';
import { hasProductPersonalization } from '@/lib/utils/personalization';
import dynamic from 'next/dynamic';
import { OrderTrackerSkeleton } from './OrderTrackerSkeleton';

const PersonalizationForm = dynamic(() => import('./PersonalizationForm').then(mod => mod.PersonalizationForm), {
  loading: () => <div className="h-48 w-full bg-[var(--surface-muted)]/50 rounded-[var(--radius-md)] animate-pulse" />
});

const FeedbackStep = dynamic(() => import('./FeedbackStep').then(mod => mod.FeedbackStep), {
  ssr: false
});

const StatusCard = dynamic(() => import('./tracking/StatusCard').then(mod => mod.StatusCard));
const OrderTimeline = dynamic(() => import('./tracking/OrderTimeline').then(mod => mod.OrderTimeline));
const DeliveryInfo = dynamic(() => import('./tracking/DeliveryInfo').then(mod => mod.DeliveryInfo));
const OrderProductsList = dynamic(() => import('./tracking/OrderProductsList').then(mod => mod.OrderProductsList));
const BillSummary = dynamic(() => import('./tracking/BillSummary').then(mod => mod.BillSummary));
const PersonalizationStatus = dynamic(() => import('./tracking/PersonalizationStatus').then(mod => mod.PersonalizationStatus));
const TrackingMap = dynamic(() => import('./tracking/TrackingMap').then(mod => mod.TrackingMap), {
  loading: () => <div className="h-[200px] w-full bg-[var(--surface-muted)]/50 rounded-[var(--radius-xl)] animate-pulse" />
});

const PreviewApproval = dynamic(() => import('./PreviewApproval').then(mod => mod.PreviewApproval), {
  loading: () => <div className="h-96 w-full bg-[var(--surface-muted)]/50 rounded-[var(--radius-md)] animate-pulse" />
});

interface OrderTrackerProps {
  orderId: string;
}

/**
 * WYSHKIT 2026: The "Order Heartbeat" Component (REFACTORED)
 * Uses God-Level view v_order_detail via useOrderRealtime.
 */
export function OrderTracker({ orderId }: OrderTrackerProps) {
  const { order, timelineEvents, previews, orderProducts, isConnected, error, refetch } = useOrderRealtime({ orderId });
  const router = useRouter();
  const searchParams = useSearchParams();

  const showSuccess = searchParams.get('success') === 'true';
  const showPersonalizationParam = searchParams.get('personalization') === 'true';

  const [showCelebration, setShowCelebration] = useState(showSuccess);
  const [proactivePersonalizationOpen, setProactivePersonalizationOpen] = useState(showPersonalizationParam);
  const [hasAutoOpened, setHasAutoOpened] = useState(showPersonalizationParam);
  const [isPersonalizationSubmittedOptimistic, setIsPersonalizationSubmittedOptimistic] = useState(false);
  const [selectedPreviewProduct, setSelectedPreviewProduct] = useState<OrderProductDetail | null>(null);

  const personalizedProductsPending = useMemo(() => {
    return (orderProducts || []).filter((product) => {
      if (!product.is_personalized) return false;
      const s = (product.status || 'PENDING_PERSONALIZATION').toUpperCase();
      const blocked = ['SUBMITTED', 'DETAILS_RECEIVED', 'MOCKUP_READY', 'MOCKUP_APPROVED', 'IN_PRODUCTION', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
      return !blocked.includes(s) && !product.personalization_details;
    });
  }, [orderProducts]);

  useEffect(() => {
    if (order && showSuccess && personalizedProductsPending.length > 0 && !hasAutoOpened) {
      setProactivePersonalizationOpen(true);
      setHasAutoOpened(true);
    }
  }, [order, showSuccess, personalizedProductsPending.length, hasAutoOpened]);

  useEffect(() => {
    if (showSuccess) {
      triggerHaptic(HapticPattern.SUCCESS);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // WYSHKIT 2026: Intrusive toasts removed. Connection status is now a subtle inline pill in StatusCard.

  const handlePersonalizationSubmitted = () => {
    toast.success("Details sent ✓ Preview in ~2 hours.");
    setIsPersonalizationSubmittedOptimistic(true);
    setProactivePersonalizationOpen(false);
    // WYSHKIT 2026: Force a local refetch if channel is slow
    setTimeout(() => refetch(), 1500);
  };

  const events = useMemo(() => (timelineEvents || []).map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    createdAt: e.created_at,
    type: e.type
  })), [timelineEvents]);

  const itemPreviews = useMemo(() => (previews || []).reduce((acc: Record<string, PreviewSubmission>, p) => {
    if (p.order_product_id && !acc[p.order_product_id]) {
      acc[p.order_product_id] = p;
    }
    return acc;
  }, {}), [previews]);

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 rounded-[var(--radius-md)] border border-rose-100">
        <AlertCircle className="size-12 text-[var(--primary)] mx-auto mb-4" />
        <p className="text-[var(--text-secondary)] text-sm mb-8">Something went wrong while tracking your order</p>
        <button onClick={() => refetch()} className="px-6 py-2 bg-[var(--primary)] text-[var(--text-inverse)] rounded-full font-bold">
          Try Again
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <SurfaceErrorBoundaryWithRouter surfaceName="Order Tracker">
        <OrderTrackerSkeleton />
      </SurfaceErrorBoundaryWithRouter>
    );
  }

  // WYSHKIT 2026: Simplified visibility logic for the personalization overlay
  const showPersonalizationForm = !isPersonalizationSubmittedOptimistic && proactivePersonalizationOpen && personalizedProductsPending.length > 0;

  return (
    <SurfaceErrorBoundaryWithRouter surfaceName="Order Tracker">
      <div className="mx-auto bg-[var(--surface-muted)]/30 pb-safe transition-all duration-500 max-w-4xl">
        <div className="flex flex-col gap-4 p-4 pb-20 md:p-8 md:gap-6">
          <SurfaceErrorBoundaryWithRouter surfaceName="Success & Auth Overlay">
            {(showSuccess || showPersonalizationForm) && (
              <div className="animate-in slide-in-from-bottom-6 duration-700 ease-out bg-[var(--surface)] rounded-[var(--radius-md)] p-1 border border-[var(--border)] shadow-sm shadow-[var(--shadow-sm)]/50 overflow-hidden relative">
                {showSuccess && !showPersonalizationForm && (
                  <div className="gradient-vibrant p-7 text-[var(--text-inverse)] rounded-[var(--radius-3xl)] mb-1 relative overflow-hidden">
                    {showCelebration && <Confetti />}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles className="size-20 text-[var(--text-inverse)] rotate-12" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className="size-9 rounded-[var(--radius-md)] bg-[var(--success)] flex items-center justify-center shadow-lg shadow-[var(--success)]/20">
                          <CheckCircle2 className="size-5 text-[var(--text-inverse)]" />
                        </div>
                        <h3 className="text-lg font-bold tracking-tight">Payment Successful</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[var(--success)]" />
                        <p className="text-xs text-[var(--text-tertiary)] font-bold tracking-tight">Order Confirmed • Preparing now</p>
                      </div>
                    </div>
                  </div>
                )}

                {(showPersonalizationForm || (showPersonalizationParam && !order)) && (
                  <div className="p-4 pt-2">
                    <PersonalizationForm
                      orderId={order?.id || orderId}
                      products={personalizedProductsPending.length > 0 ? (personalizedProductsPending as OrderProductDetail[]) : (order ? [] : [{ id: 'pending', product_name: 'Order Loading...', is_personalized: true } as unknown as OrderProductDetail])}
                      designDeadline={order?.promised_delivery_at || undefined}
                      isAutoOpenedForSuccess={showSuccess || showPersonalizationParam}
                      onSubmitted={handlePersonalizationSubmitted}
                    />
                  </div>
                )}
              </div>
            )}
          </SurfaceErrorBoundaryWithRouter>

          <SurfaceErrorBoundaryWithRouter surfaceName="Order Physical Hero">
            {/* WYSHKIT 2026: The Physical Hero Pattern (Map-First) */}
            {order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED && (
              <div className="animate-in fade-in zoom-in-95 duration-700">
                <TrackingMap order={order as OrderDetail} className="h-[280px] md:h-[320px] shadow-lg shadow-[var(--shadow-sm)]/10" />
              </div>
            )}
          </SurfaceErrorBoundaryWithRouter>

          <SurfaceErrorBoundaryWithRouter surfaceName="Order Status">
            <StatusCard order={order as OrderDetail} orderProducts={orderProducts} isConnected={isConnected} className="-mt-12 md:-mt-16 z-10 mx-2 md:mx-4" />
          </SurfaceErrorBoundaryWithRouter>

          {/* WYSHKIT 2026: Inline Preview Thread (P1) */}
          {(() => {
            const productsWithPreviews = orderProducts.filter(p => p.status === 'preview_ready');
            if (productsWithPreviews.length === 0) return null;

            return (
              <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
                {productsWithPreviews.map(product => (
                  <SurfaceErrorBoundaryWithRouter key={product.id} surfaceName={`Preview Approval: ${product.id}`}>
                    <div className="bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden shadow-sm">
                      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-muted)]/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-4 text-[var(--primary)]" />
                          <span className="text-xs font-bold text-[var(--text-primary)] tracking-tight">Design Preview: {product.product_name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-[var(--success)] bg-[var(--well-success)] px-2 py-0.5 rounded-full uppercase tracking-widest">Action Needed</span>
                      </div>
                      <PreviewApproval
                        preview={itemPreviews[product.id]}
                        orderProduct={product}
                        onApprove={async () => {
                          const { approve_preview } = await import('@/lib/actions/commerce/orders');
                          const result = await approve_preview(itemPreviews[product.id].id, order.id!);
                          if (result.success) {
                            toast.success('Product approved! Production has started.');
                            triggerHaptic(HapticPattern.SUCCESS);
                          } else {
                            toast.error(result.error ?? 'Failed to approve');
                            triggerHaptic(HapticPattern.ERROR);
                          }
                          return result;
                        }}
                        onRequestChange={async (feedback: string) => {
                          const { request_change } = await import('@/lib/actions/commerce/orders');
                          const result = await request_change(itemPreviews[product.id].id, order.id!, feedback);
                          if (result.success) {
                            toast.success('Feedback sent. Vendor will upload a new preview.');
                            triggerHaptic(HapticPattern.SUCCESS);
                          } else {
                            toast.error(result.error ?? 'Failed to send feedback');
                            triggerHaptic(HapticPattern.ERROR);
                          }
                          return result;
                        }}
                        isApproving={false} // Managed internally by PreviewApproval state or by parent refetch
                        maxChanges={(order as unknown as OrderDetail).max_change_requests ?? 2}
                        changeCount={(order as unknown as OrderDetail).change_request_count ?? 0}
                      />
                    </div>
                  </SurfaceErrorBoundaryWithRouter>
                ))}
              </div>
            );
          })()}


          {!showPersonalizationForm && (
            <SurfaceErrorBoundaryWithRouter surfaceName="Personalization Status">
              <PersonalizationStatus
                order={order as OrderDetail}
                previews={previews}
                timeline={events}
                isOptimisticSubmitted={isPersonalizationSubmittedOptimistic}
                onOpenPersonalization={() => setProactivePersonalizationOpen(true)}
                onOpenPreview={(product) => setSelectedPreviewProduct(product)}
              />
            </SurfaceErrorBoundaryWithRouter>
          )}

          <SurfaceErrorBoundaryWithRouter surfaceName="Products List">
            <OrderProductsList
              order={order as OrderDetail}
              productPreviews={itemPreviews}
              onPersonalizationSubmitted={handlePersonalizationSubmitted}
              selectedPreviewProduct={selectedPreviewProduct}
              setSelectedPreviewProduct={setSelectedPreviewProduct}
            />
          </SurfaceErrorBoundaryWithRouter>

          {order.status === ORDER_STATUS.DELIVERED && (() => {
            const deliveryTime = new Date(order.updated_at || '').getTime();
            const now = Date.now();
            const isPersonalized = order.has_personalization;
            const delayMinutes = isPersonalized ? 30 : 10;
            const isDelayOver = (now - deliveryTime) >= (delayMinutes * 60 * 1000);

            if (!isDelayOver) return null;

            return (
              <FeedbackStep
                orderId={orderId}
                products={orderProducts.map((product) => ({
                  id: product.product_id,
                  orderProductId: product.id,
                  name: product.product_name,
                  is_personalized: product.is_personalized,
                  mockup_url: itemPreviews[product.id]?.preview_url
                }))}
                onComplete={() => { }}
              />
            );
          })()}

          <div className="space-y-4">
            <DeliveryInfo order={order as OrderDetail} />
            <BillSummary order={order as OrderDetail} />
          </div>

          <SurfaceErrorBoundaryWithRouter surfaceName="Order Timeline">
            <OrderTimeline events={events} />
          </SurfaceErrorBoundaryWithRouter>

          <div className="mt-4 text-center">
            <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight mb-4">Need help?</p>
            <div className="flex gap-2">
              {process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP && (
                <button
                  onClick={() => {
                    triggerHaptic(HapticPattern.ACTION);
                    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP}`, '_blank');
                  }}
                  className="flex-1 h-10 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-secondary)] active:scale-95 transition-all hover:bg-[var(--surface-muted)]"
                >
                  <MessageSquare className="size-4" />
                  Chat
                </button>
              )}
              {process.env.NEXT_PUBLIC_SUPPORT_PHONE && (
                <button
                  onClick={() => {
                    triggerHaptic(HapticPattern.ACTION);
                    window.location.href = `tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE}`;
                  }}
                  className="flex-1 h-10 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-secondary)] active:scale-95 transition-all hover:bg-[var(--surface-muted)]"
                >
                  <Phone className="size-4" />
                  Call
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SurfaceErrorBoundaryWithRouter>
  );
}

