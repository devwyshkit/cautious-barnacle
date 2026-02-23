'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';
import { useRealtime } from '@/providers/RealtimeProvider';
import { OrderStatus } from '@/lib/types/order-status';
import { OrderItemDetail, OrderDetail, PreviewSubmission } from '@/lib/types/order';

export type RequirementStatus = 'pending' | 'submitted' | 'accepted' | 'clarification_needed' | 'approved' | 'rejected' | null;

interface OrderUpdate extends Partial<OrderDetail> {
  id: string;
  status: Database["public"]["Enums"]["order_status"];
  updated_at: string;
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

interface UseOrderRealtimeOptions {
  orderId: string;
  onStatusChange?: (newStatus: string, oldStatus: string | null) => void;
  onRequirementStatusChange?: (newStatus: RequirementStatus, oldStatus: RequirementStatus | null) => void;
  onTimelineEvent?: (event: TimelineEvent) => void;
  onPreviewUploaded?: (preview: PreviewSubmission) => void;
}

/**
 * WYSHKIT 2026: Single-trip order hook.
 * Uses v_order_detail view (1 query) instead of 4 separate fetches.
 * Realtime listeners trigger targeted re-fetches on logical events only.
 */
export function useOrderRealtime({
  orderId,
  onStatusChange,
  onRequirementStatusChange,
  onTimelineEvent,
  onPreviewUploaded,
}: UseOrderRealtimeOptions) {
  const { isConnected } = useRealtime();
  const [order, setOrder] = useState<OrderUpdate | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [previews, setPreviews] = useState<PreviewSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // WYSHKIT 2026: Track previous isConnected to only re-fetch on RECONNECT, not on initial mount.
  const prevConnectedRef = useRef<boolean | null>(null);

  /**
   * WYSHKIT 2026: Single-trip fetch using v_order_detail view.
   * All related data (items, timeline, previews) come in one round trip via JSON aggregation.
   */
  const fetchOrderData = useCallback(async (retryCount = 0) => {
    const supabase = createClient();
    const MAX_RETRIES = 5;

    try {
      if (retryCount > 0) setIsPolling(true);

      // WYSHKIT 2026: v_order_detail is created by migration 20260221163000.
      // Types are cast until `supabase gen types` is re-run post-migration.
      const { data, error: fetchError } = await (supabase as any)
        .from('v_order_detail')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (fetchError) {
        if (retryCount < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 150 * Math.pow(1.2, retryCount)));
          return fetchOrderData(retryCount + 1);
        }
        setError(fetchError.message);
        setIsPolling(false);
        return null;
      }

      if (!data && retryCount < MAX_RETRIES) {
        // New orders may not be visible in the view immediately: retry
        await new Promise(r => setTimeout(r, 150 * Math.pow(1.2, retryCount)));
        return fetchOrderData(retryCount + 1);
      }

      if (data) {
        const orderData = data as unknown as OrderUpdate;
        setOrder(orderData);
        setTimelineEvents((data as any).timeline ?? []);
        setPreviews((data as any).previews ?? []);
        setError(null);
      } else {
        setError('Order not found');
      }

      setIsPolling(false);
      return data;
    } catch (err) {
      if (retryCount < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 150));
        return fetchOrderData(retryCount + 1);
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
      setIsPolling(false);
      return null;
    }
  }, [orderId]);

  // Initial fetch
  useEffect(() => {
    if (!orderId) return;
    fetchOrderData();
  }, [orderId, fetchOrderData]);

  // WYSHKIT 2026: Re-fetch ONLY on reconnection (transition from false → true).
  // Do NOT re-fetch on first render to prevent double-fire.
  useEffect(() => {
    if (prevConnectedRef.current === false && isConnected === true) {
      fetchOrderData();
    }
    prevConnectedRef.current = isConnected;
  }, [isConnected, fetchOrderData]);

  // Realtime subscriptions — dedicated channel per order
  useEffect(() => {
    if (!orderId) return;

    const supabase = createClient();
    const orderChannel = supabase.channel(`order-pulse-${orderId}`);

    // 1. Orders table — status transitions trigger full re-fetch for consistency
    orderChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
      (payload) => {
        const newData = payload.new as OrderUpdate;
        setOrder(prev => {
          if (prev && newData.status !== prev.status) {
            import('@/lib/utils/haptic').then(({ triggerHaptic, HapticPattern }) => {
              triggerHaptic(HapticPattern.SUCCESS);
            });
            onStatusChange?.(newData.status, prev.status);
            // Full re-fetch on status change to refresh timeline, previews, and items
            fetchOrderData();
          }
          if (payload.eventType === 'INSERT') {
            fetchOrderData();
          }
          return { ...prev, ...newData };
        });
      }
    );

    // 2. Timeline — optimistic prepend + notify callback; no need to re-fetch
    orderChannel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'order_status_history', filter: `order_id=eq.${orderId}` },
      (payload) => {
        const newEvent = payload.new as TimelineEvent;
        setTimelineEvents(prev => {
          if (prev.some(e => e.id === newEvent.id)) return prev;
          onTimelineEvent?.(newEvent);
          return [newEvent, ...prev];
        });
      }
    );

    // 3. Previews — optimistic insert/update
    orderChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'order_personalization', filter: `order_id=eq.${orderId}` },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          const newPreview = payload.new as PreviewSubmission;
          setPreviews(prev => {
            if (prev.some(p => p.id === newPreview.id)) return prev;
            onPreviewUploaded?.(newPreview);
            return [newPreview, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          const updated = payload.new as PreviewSubmission;
          setPreviews(prev => prev.map(p => p.id === updated.id ? updated : p));
        }
      }
    );

    // 4. Order items — optimistic update only (full re-fetch on status change covers the rest)
    orderChannel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'order_items', filter: `order_id=eq.${orderId}` },
      (payload) => {
        const updatedItem = payload.new as OrderItemDetail;
        setOrder(prev => {
          if (!prev || !prev.order_items) return prev;
          return {
            ...prev,
            order_items: prev.order_items.map(item =>
              item.id === updatedItem.id ? { ...item, ...updatedItem } : item
            ),
          };
        });
      }
    );

    // 5. Dispatch Heartbeat — targeted re-fetch on logistical movement
    orderChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'dispatch_attempts', filter: `order_id=eq.${orderId}` },
      () => {
        // Logistical attempts are critical; full re-fetch ensures v_order_detail is fresh
        fetchOrderData();
      }
    );

    orderChannel.subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, [orderId, fetchOrderData, onStatusChange, onRequirementStatusChange, onTimelineEvent, onPreviewUploaded]);

  return {
    order,
    timelineEvents,
    previews,
    isConnected,
    error,
    isPolling,
    refetch: fetchOrderData,
  };
}
