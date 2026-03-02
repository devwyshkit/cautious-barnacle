'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';
import { useRealtime } from '@/providers/RealtimeProvider';
import { PreviewSubmission, OrderProductDetail } from '@/lib/types/order';

export type RequirementStatus = 'pending' | 'submitted' | 'accepted' | 'clarification_needed' | 'approved' | 'rejected' | null;

// WYSHKIT 2026: Direct mapping to God-Level View
type OrderDetailRow = Database['public']['Views']['v_order_detail']['Row'];

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
  onStatusChange?: (newStatus: Database["public"]["Enums"]["order_status"], oldStatus: Database["public"]["Enums"]["order_status"] | null) => void;
  onRequirementStatusChange?: (newStatus: RequirementStatus, oldStatus: RequirementStatus | null) => void;
  onTimelineEvent?: (event: TimelineEvent) => void;
  onPreviewUploaded?: (preview: PreviewSubmission) => void;
}

/**
 * WYSHKIT 2026: Single-trip order hook.
 * Uses v_order_detail view (1 query) instead of 4 separate fetches.
 * Realtime listeners trigger targeted re-fetches on logical events only.
 * No 'as any' math; full type authority.
 */
export function useOrderRealtime({
  orderId,
  onStatusChange,
  onTimelineEvent,
  onPreviewUploaded,
}: UseOrderRealtimeOptions) {
  const { isConnected } = useRealtime();
  const [order, setOrder] = useState<OrderDetailRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // WYSHKIT 2026: Track previous isConnected to only re-fetch on RECONNECT, not on initial mount.
  const prevConnectedRef = useRef<boolean | null>(null);

  /**
   * WYSHKIT 2026: Single-trip fetch using v_order_detail view.
   * All related data (products, timeline, previews) come in one round trip via JSON aggregation.
   */
  const fetchOrderData = useCallback(async (retryCount = 0) => {
    const supabase = createClient();
    const MAX_RETRIES = 5;

    try {
      if (retryCount > 0) setIsPolling(true);

      const { data, error: fetchError } = await supabase
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
        setOrder(data);
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
    const orderChannel = supabase.channel(`order:${orderId}`);

    // 1. Orders table — status transitions trigger full re-fetch for consistency
    orderChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
      (payload) => {
        const newData = payload.new as { status: Database["public"]["Enums"]["order_status"] };
        setOrder(prev => {
          if (prev && newData.status !== prev.status) {
            import('@/lib/utils/haptic').then(({ triggerHaptic, HapticPattern }) => {
              triggerHaptic(HapticPattern.SUCCESS);
            });
            onStatusChange?.(newData.status, prev.status);
            // Full re-fetch on status change to refresh timeline, previews, and products
            fetchOrderData();
          }
          if (payload.eventType === 'INSERT') {
            fetchOrderData();
          }
          return prev; // View will be updated by fetchOrderData
        });
      }
    );

    // 2. Timeline — INSERT triggers re-fetch to update view-authority
    orderChannel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'order_status_history', filter: `order_id=eq.${orderId}` },
      (payload) => {
        const newEvent = payload.new as TimelineEvent;
        onTimelineEvent?.(newEvent);
        fetchOrderData();
      }
    );

    // 3. Previews — any change triggers re-fetch to sync JSON aggregation in view
    orderChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'order_products', filter: `order_id=eq.${orderId}` },
      (payload) => {
        if (payload.eventType === 'UPDATE') {
          // Check for final_approved_mockup_url change which indicates a preview update
          const oldProduct = payload.old as OrderProductDetail;
          const newProduct = payload.new as OrderProductDetail;

          if (newProduct.final_approved_mockup_url !== oldProduct.final_approved_mockup_url) {
            // Preview status changed
            fetchOrderData();
          }
        }
      }
    );

    // 4. Dispatch Heartbeat — targeted re-fetch on logistical movement
    orderChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'dispatch_attempts', filter: `order_id=eq.${orderId}` },
      () => {
        fetchOrderData();
      }
    );

    orderChannel.subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, [orderId, fetchOrderData, onStatusChange, onTimelineEvent, onPreviewUploaded]);

  // Derived getters for UI convenience with strict typing
  const timelineEvents = (order?.timeline as unknown as TimelineEvent[]) || [];
  const previews = (order?.previews as unknown as PreviewSubmission[]) || [];
  const orderProducts = (order?.order_products as unknown as OrderProductDetail[]) || [];

  return {
    order,
    timelineEvents,
    previews,
    orderProducts,
    isConnected,
    error,
    isPolling,
    refetch: fetchOrderData,
  };
}

