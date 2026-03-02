'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRealtime } from '@/providers/RealtimeProvider';
import { logger } from '@/lib/logging/logger';
import { toast } from 'sonner';
import type { VendorOrder } from '@/lib/actions/commerce/orders';

interface UseVendorRealtimeOptions {
    vendorId: string;
    initialOrders: VendorOrder[];
    onNewOrder?: (order: VendorOrder) => void;
}

/**
 * WYSHKIT 2026: Vendor Realtime "Pulse" Hook.
 * Ensures local state is always consistent with the database.
 * Re-fetches the full order on every update to handle rich relation joins (Zero Shadow Sync).
 */
export function useVendorRealtime({
    vendorId,
    initialOrders,
    onNewOrder
}: UseVendorRealtimeOptions) {
    const { isConnected } = useRealtime();
    const [orders, setOrders] = useState<VendorOrder[]>(initialOrders);
    const [isInitialMount, setIsInitialMount] = useState(true);

    const playNotification = useCallback(() => {
        try {
            const audio = new Audio('/audio/new-order.mp3');
            audio.play().catch(e => logger.warn('Audio play failed', e));
        } catch (e) {
            logger.error('Audio setup failed', e as Error);
        }
    }, []);

    const fetchFullOrder = useCallback(async (orderId: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('orders')
            .select(`
                id, status, total, subtotal, order_number, created_at, has_personalization, payment_id, delivery_fee, platform_fee, gst, discount, vendor_id,
                order_products (*),
                vendor:vendors(*)
            `)
            .eq('id', orderId)
            .single();

        if (error) {
            logger.error('Failed to fetch full order for realtime update', error, { orderId });
            return null;
        }

        if (!data) return null;
        const row = data as Record<string, any>;

        const enrichedOrder = {
            ...row,
            latest_preview: (row.order_products as { personalization_details?: { preview_url: string } }[])?.find((i) => i.personalization_details?.preview_url)?.personalization_details || null
        } as unknown as VendorOrder;

        return enrichedOrder;
    }, []);

    useEffect(() => {
        if (!vendorId || !isConnected) return;

        const supabase = createClient();
        const channel = supabase
            .channel(`vendor-pulse-${vendorId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `vendor_id=eq.${vendorId}`,
                },
                async (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newFullOrder = await fetchFullOrder(payload.new.id);
                        if (newFullOrder) {
                            setOrders(prev => {
                                if (prev.some(o => o.id === newFullOrder.id)) return prev;
                                return [newFullOrder, ...prev];
                            });

                            toast.info('New order received!', {
                                description: `Order #${newFullOrder.order_number}`,
                                duration: 5000,
                            });
                            playNotification();
                            onNewOrder?.(newFullOrder);
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        // WYSHKIT 2026: Re-fetch on update to ensure relations stay synced
                        // Some side-effects (like previews) might not trigger the orders listener,
                        // but most vendor-critical status changes do.
                        const updatedFullOrder = await fetchFullOrder(payload.new.id);
                        if (updatedFullOrder) {
                            setOrders(prev => prev.map(o =>
                                o.id === updatedFullOrder.id ? updatedFullOrder : o
                            ));
                        }
                    } else if (payload.eventType === 'DELETE') {
                        setOrders(prev => prev.filter(o => o.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [vendorId, isConnected, fetchFullOrder, playNotification, onNewOrder]);

    return {
        orders,
        setOrders,
        isConnected
    };
}
