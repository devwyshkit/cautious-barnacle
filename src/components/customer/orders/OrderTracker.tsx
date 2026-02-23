'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Confetti } from '@/components/ui/Confetti';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import {
  Clock,
  CheckCircle2,
  Package,
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
  FileText,
  RefreshCw,
  X,
  Phone
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';
import { useOrderRealtime } from '@/hooks/useOrderRealtime';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { OrderDetail } from '@/lib/types/order';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { IdentityForm } from './IdentityForm';
import { PreviewApproval } from './PreviewApproval';
import { approve_preview, request_change } from '@/lib/actions/commerce/orders';
import { generateEstimatePDF, generateTaxInvoicePDF } from '@/lib/services/pdf-service';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { FeedbackStep } from './FeedbackStep';
import { formatCurrency } from '@/lib/utils/pricing';
import { SurfaceErrorBoundaryWithRouter } from '@/components/error/SurfaceErrorBoundary';
import { hasItemPersonalization } from '@/lib/utils/personalization';

import { StatusCard } from './tracking/StatusCard';
import { OrderTimeline } from './tracking/OrderTimeline';
import { DeliveryInfo } from './tracking/DeliveryInfo';
import { OrderItemsList } from './tracking/OrderItemsList';
import { BillSummary } from './tracking/BillSummary';
import { CreativeBrief } from './tracking/CreativeBrief';

interface OrderTrackerProps {
  orderId: string;
}

/**
 * WYSHKIT 2026: The "Order Heartbeat" Component (REFACTORED)
 */
export function OrderTracker({ orderId }: OrderTrackerProps) {
  const { order, timelineEvents, previews, isConnected, error, refetch } = useOrderRealtime({ orderId });
  const router = useRouter();
  const searchParams = useSearchParams();

  const showSuccess = searchParams.get('success') === 'true';
  const showIdentityParam = searchParams.get('identity') === 'true';

  const [showCelebration, setShowCelebration] = useState(showSuccess);
  const [proactivePersonalizationOpen, setProactivePersonalizationOpen] = useState(showIdentityParam);
  const [hasAutoOpened, setHasAutoOpened] = useState(showIdentityParam);
  const [isIdentitySubmittedOptimistic, setIsIdentitySubmittedOptimistic] = useState(false);

  const personalizedItemsPending = useMemo(() => {
    return (order?.order_items || []).filter((item: any) => {
      if (!item.is_personalized) return false;
      const s = (item.status || 'pending').toLowerCase();
      const blocked = ['submitted', 'details_received', 'preview_ready', 'approved', 'in_production', 'packed', 'shipped', 'delivered', 'cancelled'];
      return !blocked.includes(s) && !item.personalization_details;
    });
  }, [order?.order_items]);

  useEffect(() => {
    if (order && showSuccess && personalizedItemsPending.length > 0 && !hasAutoOpened) {
      setProactivePersonalizationOpen(true);
      setHasAutoOpened(true);
    }
  }, [order, showSuccess, personalizedItemsPending.length, hasAutoOpened]);

  useEffect(() => {
    if (showSuccess) {
      triggerHaptic(HapticPattern.SUCCESS);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handlePersonalizationSubmitted = () => {
    toast.success("Details shared with partner!");
    setIsIdentitySubmittedOptimistic(true);
    setProactivePersonalizationOpen(false);
    // WYSHKIT 2026: Force a local refetch if channel is slow, 
    // but the setIsIdentitySubmittedOptimistic(true) handles the immediate UI toggle.
    setTimeout(() => refetch(), 1500);
  };

  const events = useMemo(() => (timelineEvents || []).map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    createdAt: e.created_at,
    type: e.type
  })), [timelineEvents]);

  const itemPreviews = useMemo(() => (previews || []).reduce((acc: any, p: any) => {
    if (p.order_item_id && !acc[p.order_item_id]) {
      acc[p.order_item_id] = p;
    }
    return acc;
  }, {}), [previews]);

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 rounded-xl border border-rose-100">
        <AlertCircle className="size-12 text-[var(--primary)] mx-auto mb-4" />
        <p className="text-zinc-600 text-sm mb-8">Something went wrong while tracking your order</p>
        <button onClick={() => refetch()} className="px-6 py-2 bg-[var(--primary)] text-white rounded-full font-bold">
          Try Again
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <SurfaceErrorBoundaryWithRouter surfaceName="Order Tracker" showHomeButton>
        <div className="mx-auto bg-zinc-50/50 pb-safe transition-all duration-500 overflow-y-auto scrollbar-hide max-w-md min-h-screen">
          <div className="flex flex-col gap-6 p-4">
            {showIdentityParam ? (
              <div className="animate-in slide-in-from-bottom-6 duration-700 ease-out bg-white rounded-xl p-1 border border-zinc-100 glass-morphism shadow-sm shadow-zinc-200/50 overflow-hidden relative">
                <div className="flex flex-col gap-6 p-4">
                  <div className="space-y-6 animate-pulse">
                    <div className="h-10 w-24 bg-zinc-100/50 rounded-full" />
                    <div className="h-32 w-full bg-white/30 rounded-xl border border-zinc-100" />
                    <div className="h-48 w-full bg-white/50 rounded-xl border border-zinc-100" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="h-[180px] w-full bg-white border border-zinc-100 rounded-xl animate-pulse" />
                <div className="h-[120px] w-full bg-white border border-zinc-100 rounded-xl animate-pulse" />
                <div className="h-[300px] w-full bg-white border border-zinc-100 rounded-xl animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </SurfaceErrorBoundaryWithRouter>
    );
  }

  // WYSHKIT 2026: Simplified visibility logic for the identity overlay
  const showIdentityForm = !isIdentitySubmittedOptimistic && proactivePersonalizationOpen && personalizedItemsPending.length > 0;

  return (
    <SurfaceErrorBoundaryWithRouter surfaceName="Order Tracker" showHomeButton>
      <div className="mx-auto bg-zinc-50/50 pb-safe transition-all duration-500 overflow-y-auto scrollbar-hide overscroll-contain max-w-md min-h-screen">
        {!isConnected && (
          <div className="glass-morphism bg-[var(--primary)] text-white text-xs font-bold tracking-tight py-3 px-4 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300 z-50 sticky top-0">
            <RefreshCw className="size-3 animate-spin" />
            Reconnecting to order pulse...
          </div>
        )}
        <div className="flex flex-col gap-4 p-4 pb-20">
          <SurfaceErrorBoundaryWithRouter surfaceName="Success & Identity Overlay">
            {(showSuccess || showIdentityForm) && (
              <div className="animate-in slide-in-from-bottom-6 duration-700 ease-out bg-white rounded-xl p-1 border border-zinc-100 shadow-sm shadow-zinc-200/50 overflow-hidden relative">
                {showSuccess && !showIdentityForm && (
                  <div className="gradient-vibrant p-7 text-white rounded-[30px] mb-1 relative overflow-hidden">
                    {showCelebration && <Confetti />}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles className="size-20 text-white rotate-12" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className="size-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <CheckCircle2 className="size-5 text-white" />
                        </div>
                        <h3 className="text-lg font-black tracking-tight">Payment Successful</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        <p className="text-xs text-zinc-400 font-black tracking-tight">Order Confirmed • Preparing now</p>
                      </div>
                    </div>
                  </div>
                )}

                {!showSuccess && showIdentityForm && (
                  <div className="flex items-center justify-between p-6 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-900/10">
                        <Sparkles className="size-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-base font-black tracking-tight text-zinc-900">Add personalisation details</h3>
                        <p className="text-xs font-bold text-zinc-400 tracking-tight">We need a few details to personalise your item</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setProactivePersonalizationOpen(false)}
                      className="size-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 active:scale-90 transition-all border border-zinc-100"
                    >
                      <X className="size-5 text-zinc-400" />
                    </button>
                  </div>
                )}

                {(showIdentityForm || (showIdentityParam && !order)) && (
                  <div className="p-4 pt-2">
                    <IdentityForm
                      orderId={order?.id || orderId}
                      items={personalizedItemsPending.length > 0 ? personalizedItemsPending : (order ? [] : [{ id: 'pending', item_name: 'Order Loading...', is_personalized: true }])}
                      designDeadline={order ? (order as any).design_deadline_at : undefined}
                      isAutoOpenedForSuccess={showSuccess || showIdentityParam}
                      onSubmitted={handlePersonalizationSubmitted}
                    />
                  </div>
                )}
              </div>
            )}
          </SurfaceErrorBoundaryWithRouter>

          <SurfaceErrorBoundaryWithRouter surfaceName="Order Status">
            <StatusCard order={order as OrderDetail} />
          </SurfaceErrorBoundaryWithRouter>

          {!showIdentityForm && (
            <SurfaceErrorBoundaryWithRouter surfaceName="Creative Brief">
              <CreativeBrief
                order={order as OrderDetail}
                previews={previews || []}
                timeline={events}
                isOptimisticSubmitted={isIdentitySubmittedOptimistic}
                onOpenPersonalization={() => setProactivePersonalizationOpen(true)}
              />
            </SurfaceErrorBoundaryWithRouter>
          )}

          <SurfaceErrorBoundaryWithRouter surfaceName="Items List">
            <OrderItemsList
              order={order as OrderDetail}
              itemPreviews={itemPreviews}
              onPersonalizationSubmitted={handlePersonalizationSubmitted}
            />
          </SurfaceErrorBoundaryWithRouter>

          {order.status === ORDER_STATUS.DELIVERED && (
            <FeedbackStep
              orderId={orderId}
              items={order.order_items?.map((item: any) => ({
                id: item.item_id,
                name: item.item_name
              })) || []}
              onComplete={() => { }}
            />
          )}

          <div className="space-y-4">
            <DeliveryInfo order={order as OrderDetail} />
            <BillSummary order={order as OrderDetail} />
          </div>

          <SurfaceErrorBoundaryWithRouter surfaceName="Order Timeline">
            <OrderTimeline events={events} />
          </SurfaceErrorBoundaryWithRouter>

          <div className="mt-4 text-center">
            <p className="text-xs font-bold text-zinc-300 tracking-tight mb-4">Need help?</p>
            <div className="flex gap-2">
              {process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP && (
                <button
                  onClick={() => {
                    triggerHaptic(HapticPattern.ACTION);
                    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP}`, '_blank');
                  }}
                  className="flex-1 h-14 rounded-xl bg-white border border-zinc-100 flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 active:scale-95 transition-all hover:bg-zinc-50"
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
                  className="flex-1 h-14 rounded-xl bg-white border border-zinc-100 flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 active:scale-95 transition-all hover:bg-zinc-50"
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
