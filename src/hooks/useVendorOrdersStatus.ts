'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { logger } from '@/lib/logging/logger';

export function useVendorOrdersStatus(vendorId: string | undefined) {
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!vendorId) {
            setLoading(false);
            return;
        }

        const supabase = createClient();

        const fetchPendingCount = async () => {
            const { count, error } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('vendor_id', vendorId)
                .in('status', [ORDER_STATUS.PLACED, ORDER_STATUS.CONFIRMED]);

            if (error) {
                if (error.message?.includes('AbortError') || error.code?.includes('AbortError')) {
                    // Ignore abort errors
                } else {
                    logger.error('Error fetching pending orders count', error);
                }
            } else {
                setPendingCount(count || 0);
            }
            setLoading(false);
        };

        fetchPendingCount();

        // Subscribe to status changes for badge updates
        const channel = supabase
            .channel(`vendor-status-${vendorId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `vendor_id=eq.${vendorId}`,
                },
                () => {
                    fetchPendingCount();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [vendorId]);

    return { pendingCount, loading };
}
