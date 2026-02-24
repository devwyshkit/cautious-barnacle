'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ORDER_STATUS, type OrderStatus } from '@/lib/types/order-status';
import { logger } from '@/lib/logging/logger';
import { useAuth } from '@/hooks/useAuth';
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
export function useActiveOrders() {
    const { user, loading: authLoading } = useAuth();
    const { channel } = useRealtime(); // WYSHKIT 2026: Shared Pulse
    const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchActiveOrders = async (uid: string) => {
        const { data, error } = await supabase
            .from('orders')
            .select('id,order_number,status,has_personalization,total,vendors(name),order_products(product_name,personalization_details)')
            .eq('user_id', uid)
            .not('status', 'in', `(${[ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].join(',')})`)
            .order('created_at', { ascending: false });

        if (error) {
            logger.error('Error fetching active orders', error);
        } else {
            setActiveOrders(data.map((o: any) => {
                const products = Array.isArray(o.order_products) ? o.order_products : [];
                // Find personalization status from products metadata
                let p_status = undefined;
                if (o.has_personalization) {
                    const hasSubmitted = products.some((i: any) => i.personalization_details?.text || i.personalization_details?.image_url);
                    const isPreviewReady = products.some((i: any) => i.personalization_details?.preview_ready);
                    const isApproved = products.every((i: any) => i.personalization_details?.approved || !i.personalization_details);

                    if (isApproved) p_status = 'approved';
                    else if (isPreviewReady) p_status = 'preview_ready';
                    else if (hasSubmitted) p_status = 'submitted';
                    else p_status = 'pending';
                }

                return {
                    id: o.id,
                    order_number: o.order_number,
                    status: o.status as OrderStatus,
                    has_personalization: o.has_personalization,
                    personalization_status: p_status,
                    total: o.total,
                    vendor_name: o.vendors?.name,
                    products: products.map((i: any) => ({ name: i.product_name }))
                };
            }));
        }
        setLoading(false);
    };

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
            channel.on(
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
        }

        return () => {
            // Channel cleanup is managed by RealtimeProvider.
        };
    }, [user?.id, authLoading, channel]);

    return { activeOrders, loading };
}
