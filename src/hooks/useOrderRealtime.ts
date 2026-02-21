'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRealtime } from '@/providers/RealtimeProvider';
import { OrderStatus } from '@/lib/types/order-status';
import { OrderItemDetail, OrderDetail } from '@/lib/types/order';

export type RequirementStatus = 'pending' | 'submitted' | 'accepted' | 'clarification_needed' | 'approved' | 'rejected' | null;

interface OrderUpdate {
  id: string;
  status: string;
  order_number?: string;
  payment_status: string | null;
  updated_at: string;
  has_personalization?: boolean;
  personalization_input?: Record<string, unknown> | null;
  personalization_status?: string | null;
  change_request_count?: number | null;
  max_change_requests?: number | null;
  awb_number?: string | null;
  courier_partner?: string | null;
  delivery_address?: Record<string, unknown> | null;
  items?: Record<string, unknown>[] | null;
  discount?: number;
  cashback_amount?: number;
  total?: number;
  subtotal?: number;
  details_submitted_at?: string | null;
  partner_name?: string;
  design_deadline_at?: string | null;
  delivery_fee?: number | null;
  tax_amount?: number | null;
  platform_fee?: number | null;
  personalization_charges?: number | null;
  order_items?: OrderItemDetail[];
}

interface TimelineEvent {
  id: string;
  order_id: string;
  type: string;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface PreviewSubmission {
  id: string;
  order_item_id?: string; // Relational Mapping
  preview_url: string;
  status: 'pending' | 'approved' | 'change_requested';
  partner_notes: string | null;
  submitted_at: string;
}

interface UseOrderRealtimeOptions {
  orderId: string;
  onStatusChange?: (newStatus: string, oldStatus: string | null) => void;
  onRequirementStatusChange?: (
    newStatus: RequirementStatus,
    oldStatus: RequirementStatus | null
  ) => void;
  onTimelineEvent?: (event: TimelineEvent) => void;
  onPreviewUploaded?: (preview: PreviewSubmission) => void;
}

/**
 * WYSHKIT 2026: Hook to monitor a specific order's lifecycle.
 * Consolidates multiple listeners onto the shared physical channel from RealtimeProvider.
 */
export function useOrderRealtime({
  orderId,
  onStatusChange,
  onRequirementStatusChange,
  onTimelineEvent,
  onPreviewUploaded,
}: UseOrderRealtimeOptions) {
  const { channel, isConnected } = useRealtime(); // WYSHKIT 2026: Shared Pulse
  const [order, setOrder] = useState<OrderUpdate | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [previews, setPreviews] = useState<PreviewSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const fetchInitialData = useCallback(async (retryCount = 0) => {
    const supabase = createClient();
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 150; // Swiggy 2026: Snappy polling for fresh orders

    try {
      if (retryCount > 0) setIsPolling(true);

      const [orderRes, timelineRes, previewsRes, itemsRes] = await Promise.all([
        supabase.from('orders').select('id, status, order_number, payment_status, updated_at, has_personalization, personalization_input, personalization_status, change_request_count, max_change_requests, awb_number, courier_partner, delivery_address, items, discount, cashback_amount, total, subtotal, design_deadline_at, delivery_fee, tax_amount, platform_fee, personalization_charges, partner_name:partners(name)').eq('id', orderId).maybeSingle(),
        supabase.from('order_status_history').select('id, order_id, type, title, description, metadata, created_at').eq('order_id', orderId).order('created_at', { ascending: false }),
        supabase.from('preview_submissions').select('id, order_item_id, preview_url, status, partner_notes, submitted_at').eq('order_id', orderId).order('submitted_at', { ascending: false }),
        supabase.from('order_items').select('id, item_id, item_name, quantity, unit_price, total_price, item_image_url, is_personalized, personalization_config, personalization_details, status, selected_addons').eq('order_id', orderId)
      ]);

      if (orderRes.data) {
        const orderData = orderRes.data as unknown as OrderUpdate;
        const rawOrder = orderRes.data as any;
        if (rawOrder.partners?.name) orderData.partner_name = rawOrder.partners.name;

        if (itemsRes.data) orderData.order_items = itemsRes.data as unknown as OrderItemDetail[];
        setOrder(orderData);
        if (timelineRes.data) setTimelineEvents(timelineRes.data as unknown as TimelineEvent[]);
        if (previewsRes.data) setPreviews(previewsRes.data as unknown as PreviewSubmission[]);
        setError(null);
        setIsPolling(false);
        return orderData;
      }

      if (!orderRes.data && retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(1.2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchInitialData(retryCount + 1);
      }

      if (orderRes.error) setError(orderRes.error.message);
      else if (!orderRes.data) setError('Order not found');

      setIsPolling(false);
      return null;
    } catch (err) {
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchInitialData(retryCount + 1);
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
      setIsPolling(false);
      return null;
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    fetchInitialData();

    // WYSHKIT 2026: Reconnection Resilience
    // When the shared pulse reconnects, force a full data pull to bridge the offline gap.
    if (isConnected) {
      fetchInitialData();
    }

    // WYSHKIT 2026: Use a DEDICATED channel for this specific order.
    // This allows for proper cleanup on unmount without affecting other subscribers.
    const supabase = createClient();
    const orderChannel = supabase.channel(`order-pulse-${orderId}`);

    // 1. Order Status (INSERT & UPDATE)
    // INSERT catches the order if it was created AFTER the user landed on the page.
    orderChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
      (payload) => {
        const newData = payload.new as OrderUpdate;
        setOrder((prev) => {
          if (prev && newData.status !== prev.status) {
            import('@/lib/utils/haptic').then(({ triggerHaptic, HapticPattern }) => {
              triggerHaptic(HapticPattern.SUCCESS);
            });
            onStatusChange?.(newData.status, prev.status);
            // Swiggy 2026: Force refetch on status transition to ensure relational data (previews, items) is fresh
            fetchInitialData();
          }
          // If it was an INSERT, we also want to fetch the other related data (items, previews)
          if (payload.eventType === 'INSERT') {
            fetchInitialData();
          }
          return { ...prev, ...newData };
        });
      }
    );

    // 2. Timeline
    orderChannel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'order_status_history', filter: `order_id=eq.${orderId}` },
      (payload) => {
        const newEvent = payload.new as TimelineEvent;
        setTimelineEvents((prev) => {
          if (prev.some(e => e.id === newEvent.id)) return prev;
          onTimelineEvent?.(newEvent);
          return [newEvent, ...prev];
        });
      }
    );

    // 3. Previews
    orderChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'preview_submissions', filter: `order_id=eq.${orderId}` },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          const newPreview = payload.new as PreviewSubmission;
          setPreviews((prev) => {
            if (prev.some(p => p.id === newPreview.id)) return prev;
            onPreviewUploaded?.(newPreview);
            return [newPreview, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          const updatedPreview = payload.new as PreviewSubmission;
          setPreviews((prev) => prev.map(p => p.id === updatedPreview.id ? updatedPreview : p));
        }
      }
    );

    // 4. Order Items
    orderChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'order_items', filter: `order_id=eq.${orderId}` },
      (payload) => {
        // WYSHKIT 2026: Optimistic Update for Zero Latency
        if (payload.eventType === 'UPDATE' && payload.new) {
          const updatedItem = payload.new as OrderItemDetail;
          setOrder((prev) => {
            if (!prev || !prev.order_items) return prev;
            return {
              ...prev,
              order_items: prev.order_items.map((item) =>
                item.id === updatedItem.id ? { ...item, ...updatedItem } : item
              ),
            };
          });
        }
        // Resilience: Always refetch to ensure we catch side-effects (aggregates/triggers)
        fetchInitialData();
      }
    );

    orderChannel.subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, [orderId, fetchInitialData, onStatusChange, onRequirementStatusChange, onTimelineEvent, onPreviewUploaded]);

  return {
    order,
    timelineEvents,
    previews,
    isConnected,
    error,
    refetch: fetchInitialData,
  };
}
