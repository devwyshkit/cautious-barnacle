'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow, differenceInSeconds } from 'date-fns';
import { Package, Clock, ChevronRight, X, Check, MapPin, Phone, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ORDER_STATUS, getOrderStatusDisplay, type OrderStatus } from '@/lib/types/order-status';
import type { VendorOrder } from '@/lib/actions/commerce/orders';
import { cn } from '@/lib/utils';

import { PreviewUploader } from '../personalization/PreviewUploader';

const ACCEPT_SLA_MINUTES = 5;
const DESIGN_DEADLINE_HOURS = 24;

interface OrderCardProps {
  order: VendorOrder;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string, reason: string) => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  isUpdating: boolean;
}

const REJECT_REASONS = [
  'Product out of stock',
  'Store too busy',
  'Unable to fulfill personalization',
  'Closing soon',
  'Other',
];

// WYSHKIT 2026: Status actions - Enforce "Preparing" phase for ALL orders
// Use a function to determine actions dynamically
const getAvailableAction = (order: VendorOrder) => {
  if (order.status === ORDER_STATUS.PLACED) return null;

  if (order.status === ORDER_STATUS.CONFIRMED) {
    if (!order.has_personalization) {
      return { label: 'Start Preparing', nextStatus: ORDER_STATUS.IN_PRODUCTION };
    }

    // For personalized orders in CONFIRMED state:
    if (order.personalization_status === 'submitted' || order.personalization_status === 'revision_requested') {
      return { label: 'Upload Preview', isUpload: true };
    }

    if (order.personalization_status === 'approved') {
      return { label: 'Start Preparing', nextStatus: ORDER_STATUS.IN_PRODUCTION };
    }

    return null; // Awaiting user details or pending
  }

  if (order.status === ORDER_STATUS.IN_PRODUCTION) {
    return { label: 'Mark Ready', nextStatus: ORDER_STATUS.PACKED };
  }

  if (order.status === ORDER_STATUS.PACKED) {
    return { label: 'Mark Dispatched', nextStatus: ORDER_STATUS.RIDER_ASSIGNED };
  }

  return null;
};

const STATUS_COLORS: Partial<Record<OrderStatus, string>> = {
  [ORDER_STATUS.PLACED]: 'bg-red-50 text-red-700 border-red-200',
  [ORDER_STATUS.CONFIRMED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [ORDER_STATUS.IN_PRODUCTION]: 'bg-purple-50 text-purple-700 border-purple-200',
  [ORDER_STATUS.PACKED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'bg-blue-50 text-blue-700 border-blue-200',
  [ORDER_STATUS.DELIVERED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function OrderCard({ order, onAccept, onReject, onStatusUpdate, isUpdating }: OrderCardProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [designDeadlineLeft, setDesignDeadlineLeft] = useState<number | null>(null);

  const isNewOrder = order.status === ORDER_STATUS.PLACED;
  const isAwaitingDetails = order.has_personalization &&
    (order.status === ORDER_STATUS.PLACED || order.personalization_status === 'submitted');

  // WYSHKIT 2026: Logic simplified because state machine is now unified
  // All orders (personalized or not) go through IN_PRODUCTION

  // Rule: If CONFIRMED + Personalized, we must wait for customer.
  const isAwaitingCustomerDetails = order.status === ORDER_STATUS.CONFIRMED && order.has_personalization;

  const isExpress = !order.has_personalization;
  const action = getAvailableAction(order);

  const statusColor = STATUS_COLORS[order.status as OrderStatus] || 'bg-zinc-100 text-zinc-700';

  useEffect(() => {
    if (!isNewOrder || !order.created_at) return;

    const calculateTimeLeft = () => {
      const orderTime = new Date(order.created_at!);
      const deadline = new Date(orderTime.getTime() + ACCEPT_SLA_MINUTES * 60 * 1000);
      const secondsLeft = differenceInSeconds(deadline, new Date());
      return Math.max(0, secondsLeft);
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        onReject(order.id, 'Auto-rejected: Order not accepted within SLA');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isNewOrder, order.created_at, order.id, onReject]);

  useEffect(() => {
    if (!isAwaitingDetails || !order.created_at) return;

    const calculateDeadline = () => {
      // WYSHKIT 2026: Design deadline is 24h from creation
      const orderTime = new Date(order.created_at!);
      const deadline = new Date(orderTime.getTime() + DESIGN_DEADLINE_HOURS * 60 * 60 * 1000);
      const secondsLeft = differenceInSeconds(deadline, new Date());
      return Math.max(0, secondsLeft);
    };

    setDesignDeadlineLeft(calculateDeadline());

    const timer = setInterval(() => {
      setDesignDeadlineLeft(calculateDeadline());
    }, 60000);

    return () => clearInterval(timer);
  }, [isAwaitingDetails, order.created_at]);

  const formatTimeLeft = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHoursLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const isUrgent = timeLeft !== null && timeLeft <= 60;
  const isDeadlineUrgent = designDeadlineLeft !== null && designDeadlineLeft <= 3600;

  const handleReject = () => {
    if (rejectReason) {
      onReject(order.id, rejectReason);
      setShowRejectDialog(false);
      setRejectReason('');
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* WYSHKIT 2026: Revision Feedback Block (Momentum Saver) */}
          {order.personalization_status === 'revision_requested' && order.latest_preview?.customer_feedback && (
            <div className="p-4 bg-orange-50 border-b border-orange-100 animate-in slide-in-from-top-1 duration-500">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="size-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-orange-900 tracking-tight leading-none mb-1">Action Required: Correction Requested</p>
                  <p className="text-sm font-bold text-orange-800 leading-tight">
                    "{order.latest_preview.customer_feedback}"
                  </p>
                  <p className="text-xs text-orange-600 mt-2 font-medium italic">
                    Upload a corrected preview to proceed.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                  <Package className="size-5 text-zinc-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-900">
                      #{order.order_number}
                    </p>
                    <Badge variant="outline" className={cn('text-xs', statusColor)}>
                      {getOrderStatusDisplay(order.status)}
                    </Badge>
                    {isNewOrder && timeLeft !== null && (
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs font-mono tabular-nums',
                          isUrgent
                            ? 'bg-red-100 text-red-700 border-red-300 animate-pulse'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        )}
                      >
                        <Clock className="size-3 mr-1" />
                        {formatTimeLeft(timeLeft)}
                      </Badge>
                    )}
                    {isAwaitingDetails && designDeadlineLeft !== null && (
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          isDeadlineUrgent
                            ? 'bg-orange-100 text-orange-700 border-orange-300'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        )}
                      >
                        <AlertTriangle className="size-3 mr-1" />
                        Customer: {formatHoursLeft(designDeadlineLeft)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500 mt-0.5">
                    <Clock className="size-3" />
                    <span className="text-xs">
                      {formatDistanceToNow(new Date(order.created_at!), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-base font-semibold text-zinc-900">
                ₹{Number(order.total).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="space-y-2 py-3 border-t border-zinc-100">
              {isExpress && order.status === ORDER_STATUS.PLACED && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 mb-2 animate-in slide-in-from-top-1 duration-300">
                  <Zap className="size-3 fill-emerald-600" />
                  <span className="text-xs font-black tracking-tight">Express Fulfill</span>
                  <span className="text-[11px] font-medium opacity-70 ml-auto">No personalization needed</span>
                </div>
              )}
              {order.order_products?.map((product: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-zinc-900">
                      {product.quantity}× {product.product_name}
                    </p>
                    {/* WYSHKIT 2026: Variant options not available in current OrderItem schema. TODO: Add join or JSON column. */}
                    {/* {product.selected_variant_options && (
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {Object.values(product.selected_variant_options as Record<string, string>).join(' · ')}
                      </p>
                    )} */}
                    {product.is_personalized && (
                      <Badge variant="outline" className="mt-1 text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Personalization
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600">
                    {/* WYSHKIT 2026: Calculate total from unit price */}
                    ₹{Number((product.unit_price || 0) * product.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            {order.delivery_address && (
              <div className="flex items-start gap-2 py-3 border-t border-zinc-100">
                <MapPin className="size-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-zinc-600 line-clamp-2">
                  {typeof order.delivery_address === 'string'
                    ? order.delivery_address
                    : (order.delivery_address as { formatted?: string })?.formatted || 'Address not available'}
                </p>
              </div>
            )}
          </div>

          {/* WYSHKIT 2026: Personalization Details Section (Canonical Product-Level) */}
          {order.order_products?.some((i: any) => i.personalization_entry || i.personalization_details) && (
            <div className="mx-4 mb-4 p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-3">
              <p className="text-xs font-black text-amber-900 tracking-tight">Customer Design Details</p>
              <div className="space-y-4">
                {order.order_products.filter((i: any) => i.is_personalized).map((product: any, idx: number) => {
                  const data = (product.personalization_entry || product.personalization_details || {}) as any;
                  if (Object.keys(data).length === 0) return null;

                  return (
                    <div key={product.id || idx} className="space-y-2">
                      <p className="text-xs font-bold text-amber-800">{product.product_name || 'Personalization'}</p>
                      {data.text && (
                        <p className="text-sm text-amber-900 bg-white/50 p-2 rounded-lg border border-amber-100 font-medium">"{data.text}"</p>
                      )}
                      {data.image_url && (
                        <div className="relative aspect-square w-24 rounded-lg overflow-hidden border border-amber-200 group">
                          <img src={data.image_url} alt="Customer upload" className="size-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                            <a
                              href={data.image_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-white text-xs font-bold underline"
                            >
                              VIEW FULL
                            </a>
                            {/* Actions for this product */}
                            {(order.status === ORDER_STATUS.CONFIRMED || order.status === ORDER_STATUS.PLACED) && (
                              <Button
                                size="sm"
                                className="h-6 px-2 text-[11px] bg-white text-zinc-900 border-none hover:bg-zinc-100"
                                onClick={() => {
                                  setSelectedOrderItemId(product.id);
                                  setShowPreviewModal(true);
                                }}
                              >
                                UPLOAD PREVIEW
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      {data.addons && Array.isArray(data.addons) && (
                        <div className="flex flex-wrap gap-1">
                          {data.addons.map((a: string) => (
                            <Badge key={a} variant="secondary" className="text-[11px] bg-amber-100 text-amber-700 border-none">{a}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isNewOrder ? (
            <div className="flex border-t border-zinc-100">
              <Button
                variant="ghost"
                className="flex-1 rounded-none h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowRejectDialog(true)}
                disabled={isUpdating}
              >
                <X className="size-4 mr-2" />
                Reject
              </Button>
              <div className="w-px bg-zinc-100" />
              <Button
                variant="ghost"
                className={cn(
                  "flex-1 rounded-none h-12 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold",
                  isExpress && "bg-emerald-50 animate-in fade-in duration-500"
                )}
                onClick={() => isExpress ? onStatusUpdate(order.id, ORDER_STATUS.IN_PRODUCTION) : onAccept(order.id)}
                disabled={isUpdating}
              >
                {isExpress ? (
                  <>
                    <Zap className="size-4 mr-2 fill-emerald-600" />
                    Accept & Start
                  </>
                ) : (
                  <>
                    <Check className="size-4 mr-2" />
                    Accept
                  </>
                )}
              </Button>
            </div>
          ) : action ? (
            <div className="p-4 pt-0">
              <Button
                className="w-full"
                onClick={() => (action as any).isUpload ? setShowPreviewModal(true) : onStatusUpdate(order.id, (action as any).nextStatus!)}
                disabled={isUpdating}
              >
                {action.label}
                <ChevronRight className="size-4 ml-2" />
              </Button>
            </div>
          ) : null}

          {/* WYSHKIT 2026: Waiting for Customer State (Blind Spot Fix) */}
          {isAwaitingCustomerDetails && (
            <div className="p-4 pt-0">
              <Button
                variant="secondary"
                className="w-full h-12 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 italic"
                disabled
              >
                <Clock className="size-4 mr-2 animate-pulse" />
                Waiting for Customer Details...
              </Button>
              <p className="text-xs text-center text-amber-600/70 mt-2 font-medium">
                Customer has 24 hours to submit design details.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ResponsiveSurface
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Reject order"
        description="Select a reason for rejecting this order. The customer will be notified."
      >
        <div className="space-y-4 pt-4">
          <Select value={rejectReason} onValueChange={setRejectReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {REJECT_REASONS.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason}
              className="w-full sm:w-auto"
            >
              Reject order
            </Button>
          </div>
        </div>
      </ResponsiveSurface>
      <PreviewUploader
        orderId={order.id}
        orderItemId={selectedOrderItemId || ''}
        orderNumber={order.order_number!}
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedOrderItemId(null);
        }}
        onSuccess={() => {
          setShowPreviewModal(false);
          setSelectedOrderItemId(null);
          // Status update is handled inside PreviewUploader via lib/actions
        }}
      />
    </>
  );
}
