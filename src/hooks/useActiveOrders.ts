'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ORDER_STATUS, type OrderStatus } from '@/lib/types/order-status';
import { logger } from '@/lib/logging/logger';
import { useAuth } from '@/providers/AuthProvider';
import { useRealtime } from '@/providers/RealtimeProvider';

export interface ActiveOrder {
    id: string;
    order_number: string;
    status: OrderStatus;
    has_personalization: boolean;
    personalization_status?: string;
    total: number;
    vendor_name?: string;
    products?: { name: string }[];
}

/**
 * WYSHKIT 2026: Hook to monitor active orders for a user.
 * Reuses the shared Realtime channel to prevent proliferation.
 */
export function useActiveOrders(initialOrders: ActiveOrder[] = []) {
    const { user, loading: authLoading } = useAuth();
    const { channel } = useRealtime(); // WYSHKIT 2026: Shared Pulse
    const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>(initialOrders);
    const [loading, setLoading] = useState(initialOrders.length === 0);
    const supabase = createClient();

    const fetchActiveOrders = useCallback(async (uid: string) => {
        const { data, error } = await supabase
            .from('v_order_tracking')
            .select('*')
            .eq('user_id', uid)
            .not('status', 'in', `(${[ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].join(',')})`)
            .order('created_at', { ascending: false });

        if (error) {
            logger.error('Error fetching active orders', error);
        } else {
            setActiveOrders(data.map((o: any) => ({
                id: o.id,
                order_number: o.order_number,
                status: o.status as OrderStatus,
                has_personalization: o.has_personalization,
                personalization_status: o.personalization_status,
                total: o.total,
                vendor_name: o.vendor_name,
                products: (o.order_products || []).map((i: any) => ({ name: i.product_name || i.name }))
            })));
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        if (authLoading || !user) {
            if (!authLoading) {
                setActiveOrders([]);
                setLoading(false);
            }
            return;
        }

        if (channel) {
            fetchActiveOrders(user.id);

            // WYSHKIT 2026: Attach to the shared Pulse channel instead of creating a new one.
            // This follows the "One User = One Connection" principle.
            const subscription = channel.on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `user_id=eq.${user.id}`
                },
                () => {
                    fetchActiveOrders(user.id);
                }
            );

            return () => {
                // Subscription cleanup if needed, but channel is managed globally
            };
        }

        return () => {
            // Channel cleanup is managed by RealtimeProvider.
        };
    }, [user, authLoading, channel, fetchActiveOrders]);

    return { activeOrders, loading };
}
