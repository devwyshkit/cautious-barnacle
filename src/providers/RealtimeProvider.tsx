'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@/providers/AuthProvider';

/**
 * WYSHKIT 2026: The "Realtime Pulse" Provider
 * 
 * Performance Strategy:
 * - Single physical channel for the logged-in user.
 * - Multi-listener registry to handle diverse subscriptions (Orders, Notifications, Cart).
 * - Prevents the 'Explosion of Channels' anti-pattern which drains battery and hits limits.
 */

interface RealtimeContextType {
    channel: RealtimeChannel | null;
    isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType>({ channel: null, isConnected: false });

export const useRealtime = () => useContext(RealtimeContext);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        if (authLoading || !user) {
            setChannel((prev) => {
                if (prev) {
                    supabase.removeChannel(prev);
                }
                return null;
            });
            setIsConnected(false);
            return;
        }

        // WYSHKIT 2026: Shared User Pulse
        const userChannel = supabase
            .channel(`user-pulse-${user.id}`)
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') setIsConnected(true);
                if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setIsConnected(false);
            });

        setChannel(userChannel);

        return () => {
            supabase.removeChannel(userChannel);
        };
    }, [user, authLoading, supabase]);

    return (
        <RealtimeContext.Provider value={{ channel, isConnected }}>
            {children}
        </RealtimeContext.Provider>
    );
}
