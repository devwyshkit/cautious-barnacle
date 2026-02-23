'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ORDER_STATUS } from '@/lib/types/order-status';
import { logger } from '@/lib/logging/logger';

export function usePartnerOrdersStatus(partnerId: string | undefined) {
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!partnerId) {
            setLoading(false);
            return;
        }

        const supabase = createClient();

        const fetchPendingCount = async () => {
            const { count, error } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('partner_id', partnerId)
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
            .channel(`partner-status-${partnerId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `partner_id=eq.${partnerId}`,
                },
                () => {
                    fetchPendingCount();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [partnerId]);

    return { pendingCount, loading };
}
