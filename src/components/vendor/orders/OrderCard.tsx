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
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

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
  [ORDER_STATUS.PLACED]: 'bg-[var(--well-destructive)] text-[var(--well-destructive-text)] border-[var(--well-destructive-border)]',
  [ORDER_STATUS.CONFIRMED]: 'bg-[var(--well-success)] text-[var(--well-success-text)] border-[var(--well-success-border)]',
  [ORDER_STATUS.IN_PRODUCTION]: 'bg-[var(--well-neutral)] text-[var(--well-neutral-text)] border-[var(--well-neutral-border)]',
  [ORDER_STATUS.PACKED]: 'bg-[var(--well-success)] text-[var(--well-success-text)] border-[var(--well-success-border)]',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'bg-[var(--well-info)] text-[var(--well-info-text)] border-[var(--well-info-border)]',
  [ORDER_STATUS.DELIVERED]: 'bg-[var(--well-success)] text-[var(--well-success-text)] border-[var(--well-success-border)]',
};

export function OrderCard({ order, onAccept, onReject, onStatusUpdate, isUpdating }: OrderCardProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedOrderProductId, setSelectedOrderProductId] = useState<string | null>(null);
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

  const statusColor = STATUS_COLORS[order.status as OrderStatus] || 'bg-[var(--surface-muted)] text-[var(--text-secondary)]';

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
      triggerHaptic(HapticPattern.ACTION);
      onReject(order.id, rejectReason);
      setShowRejectDialog(false);
      setRejectReason('');
    }
  };

  const handleUpdateStatus = (status: OrderStatus) => {
    triggerHaptic(HapticPattern.ACTION);
    onStatusUpdate(order.id, status);
  };

  const handleAcceptOrder = () => {
    triggerHaptic(HapticPattern.SUCCESS);
    if (isExpress) {
      onStatusUpdate(order.id, ORDER_STATUS.IN_PRODUCTION);
    } else {
      onAccept(order.id);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* WYSHKIT 2026: Revision Feedback Block (Momentum Saver) */}
          {order.personalization_status === 'revision_requested' && order.latest_preview?.customer_feedback && (
            <div className="p-4 bg-[var(--well-warning)] border-b border-[var(--well-warning-border)] animate-in slide-in-from-top-1 duration-500">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-full bg-[var(--background)] flex items-center justify-center shrink-0 shadow-[var(--shadow-sm)]">
                  <AlertTriangle className="size-4 text-[var(--well-warning-text)]" />
                </div>
                <div>
                  <p className="text-xs font-black text-[var(--text-primary)] tracking-tight leading-none mb-1 uppercase">Correction Requested</p>
                  <p className="text-sm font-bold text-[var(--text-primary)] leading-tight">
                    &quot;{order.latest_preview.customer_feedback}&quot;
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium italic">
                    Upload a corrected preview to proceed.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-[var(--radius-md)] bg-[var(--surface-muted)] flex items-center justify-center">
                  <Package className="size-5 text-[var(--text-secondary)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      #{order.order_number}
                    </p>
                    <Badge variant="outline" className={cn('text-xs', statusColor)}>
                      {getOrderStatusDisplay(order.status)}
                    </Badge>
                    {isNewOrder && timeLeft !== null && (
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs font-mono tabular-nums rounded-[var(--radius-xs)]',
                          isUrgent
                            ? 'bg-[var(--well-destructive)] text-[var(--well-destructive-text)] border-[var(--well-destructive-border)] animate-pulse'
                            : 'bg-[var(--well-warning)] text-[var(--well-warning-text)] border-[var(--well-warning-border)]'
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
                          'text-xs rounded-[var(--radius-xs)]',
                          isDeadlineUrgent
                            ? 'bg-[var(--well-destructive)] text-[var(--well-destructive-text)] border-[var(--well-destructive-border)]'
                            : 'bg-[var(--well-info)] text-[var(--well-info-text)] border-[var(--well-info-border)]'
                        )}
                      >
                        <AlertTriangle className="size-3 mr-1" />
                        Customer: {formatHoursLeft(designDeadlineLeft)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary)] mt-0.5">
                    <Clock className="size-3" />
                    <span className="text-xs">
                      {formatDistanceToNow(new Date(order.created_at!), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-base font-semibold text-[var(--text-primary)]">
                ₹{Number(order.total).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="space-y-2 py-3 border-t border-[var(--border)]">
              {isExpress && order.status === ORDER_STATUS.PLACED && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--well-success)] text-[var(--well-success-text)] rounded-[var(--radius-md)] border border-[var(--well-success-border)] mb-2 animate-in slide-in-from-top-1 duration-300">
                  <Zap className="size-3 fill-[var(--well-success-text)]" />
                  <span className="text-xs font-black tracking-tight uppercase">Express Fulfill</span>
                  <span className="text-[10px] font-bold opacity-70 ml-auto uppercase">Automatic</span>
                </div>
              )}
              {order.order_products?.map((product: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[var(--text-primary)]">
                      {product.quantity}× {product.product_name}
                    </p>
                    {product.selected_variant_options && (
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium italic">
                        {Object.entries(product.selected_variant_options as Record<string, string>)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(' · ')}
                      </p>
                    )}
                    {product.is_personalized && (
                      <Badge variant="outline" className="mt-1 text-[10px] font-black uppercase bg-[var(--well-info)] text-[var(--well-info-text)] border-[var(--well-info-border)] rounded-[var(--radius-xs)]">
                        Personalization
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {/* WYSHKIT 2026: Calculate total from unit price */}
                    ₹{Number((product.unit_price || 0) * product.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            {order.delivery_address && (
              <div className="flex items-start gap-2 py-3 border-t border-[var(--border)]">
                <MapPin className="size-4 text-[var(--text-tertiary)] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {typeof order.delivery_address === 'string'
                    ? order.delivery_address
                    : (order.delivery_address as { formatted?: string })?.formatted || 'Address not available'}
                </p>
              </div>
            )}
          </div>

          {/* WYSHKIT 2026: Personalization Details Section (Canonical Product-Level) */}
          {order.order_products?.some((i: any) => i.personalization_entry || i.personalization_details) && (
            <div className="mx-4 mb-4 p-4 rounded-[var(--radius-lg)] bg-[var(--well-warning)] border border-[var(--well-warning-border)] space-y-3">
              <p className="text-xs font-black text-[var(--well-warning-text)] tracking-tight uppercase">Customer Design Details</p>
              <div className="space-y-4">
                {order.order_products.filter((i: any) => i.is_personalized).map((product: any, idx: number) => {
                  const data = (product.personalization_entry || product.personalization_details || {}) as any;
                  if (Object.keys(data).length === 0) return null;

                  return (
                    <div key={product.id || idx} className="space-y-2">
                      <p className="text-xs font-bold text-[var(--well-warning-text)]">{product.product_name || 'Personalization'}</p>
                      {data.text && (
                        <p className="text-sm text-[var(--text-primary)] bg-[var(--surface)]/50 p-2 rounded-[var(--radius-md)] border border-[var(--well-warning-border)] font-medium">&quot;{data.text}&quot;</p>
                      )}
                      {data.image_url && (
                        <div className="relative aspect-square w-24 rounded-[var(--radius-md)] overflow-hidden border border-[var(--well-warning-border)] group shadow-[var(--shadow-sm)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={data.image_url} alt="Customer upload" className="size-full object-cover" />
                          <div className="absolute inset-0 bg-[var(--foreground)]/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                            <a
                              href={data.image_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[var(--text-inverse)] text-xs font-bold underline"
                            >
                              VIEW FULL
                            </a>
                            {/* Actions for this product */}
                            {(order.status === ORDER_STATUS.CONFIRMED || order.status === ORDER_STATUS.PLACED) && (
                              <Button
                                size="sm"
                                className="h-6 px-2 text-xs bg-[var(--surface)] text-[var(--text-primary)] border-none hover:bg-[var(--surface-muted)]"
                                onClick={() => {
                                  setSelectedOrderProductId(product.id);
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
                            <Badge key={a} variant="secondary" className="text-[10px] font-bold uppercase bg-[var(--well-warning-border)] text-[var(--well-warning-text)] border-none rounded-[var(--radius-xs)]">{a}</Badge>
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
            <div className="flex border-t border-[var(--border)]">
              <Button
                variant="ghost"
                className="flex-1 rounded-none h-12 text-[var(--destructive)] hover:text-[var(--destructive)] hover:bg-[var(--well-destructive)] font-bold uppercase tracking-tight"
                onClick={() => setShowRejectDialog(true)}
                disabled={isUpdating}
              >
                <X className="size-4 mr-2" />
                Reject
              </Button>
              <div className="w-px bg-[var(--border)]" />
              <Button
                variant="ghost"
                className={cn(
                  "flex-1 rounded-none h-12 text-[var(--well-success-text)] hover:text-[var(--well-success-text)] hover:bg-[var(--well-success)] font-black uppercase tracking-tight",
                  isExpress && "bg-[var(--well-success)] animate-in fade-in duration-500"
                )}
                onClick={handleAcceptOrder}
                disabled={isUpdating}
              >
                {isExpress ? (
                  <>
                    <Zap className="size-4 mr-2 fill-[var(--well-success-text)]" />
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
                onClick={() => (action as any).isUpload ? setShowPreviewModal(true) : handleUpdateStatus((action as any).nextStatus!)}
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
                className="w-full h-12 bg-[var(--well-warning)] text-[var(--well-warning-text)] border border-[var(--well-warning-border)] hover:bg-[var(--well-warning)]/80 italic font-bold rounded-[var(--radius-md)]"
                disabled
              >
                <Clock className="size-4 mr-2 animate-pulse" />
                Waiting for Customer Details...
              </Button>
              <p className="text-xs text-center text-[var(--well-warning-text)]/70 mt-2 font-medium">
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
        orderProductId={selectedOrderProductId || ''}
        orderNumber={order.order_number!}
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedOrderProductId(null);
        }}
        onSuccess={() => {
          setShowPreviewModal(false);
          setSelectedOrderProductId(null);
          // Status update is handled inside PreviewUploader via lib/actions
        }}
      />
    </>
  );
}
