'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface SurfaceScribeContextType {
    bottomNavHeight: number;
    trackingBarHeight: number;
    cartBarHeight: number;
    setBottomNavHeight: (h: number) => void;
    setTrackingBarHeight: (h: number) => void;
    setCartBarHeight: (h: number) => void;
    totalBottomOffset: number;
}

const SurfaceScribeContext = createContext<SurfaceScribeContextType | null>(null);

export function SurfaceScribeProvider({ children }: { children: React.ReactNode }) {
    const [bottomNavHeight, setBottomNavHeight] = useState(0);
    const [trackingBarHeight, setTrackingBarHeight] = useState(0);
    const [cartBarHeight, setCartBarHeight] = useState(0);

    const totalBottomOffset = useMemo(() => {
        return bottomNavHeight + trackingBarHeight;
    }, [bottomNavHeight, trackingBarHeight]);

    // Sync CSS variables for legacy support/native transitions
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--bottom-nav-height', `${bottomNavHeight}px`);
        root.style.setProperty('--tracking-bar-height', `${trackingBarHeight}px`);
        root.style.setProperty('--cart-bar-offset', `${totalBottomOffset}px`);
    }, [bottomNavHeight, trackingBarHeight, totalBottomOffset]);

    const value = useMemo(() => ({
        bottomNavHeight,
        trackingBarHeight,
        cartBarHeight,
        setBottomNavHeight,
        setTrackingBarHeight,
        setCartBarHeight,
        totalBottomOffset
    }), [bottomNavHeight, trackingBarHeight, cartBarHeight, totalBottomOffset]);

    return (
        <SurfaceScribeContext.Provider value={value}>
            {children}
        </SurfaceScribeContext.Provider>
    );
}

export function useSurfaceScribe() {
    const context = useContext(SurfaceScribeContext);
    if (!context) throw new Error('useSurfaceScribe must be used within SurfaceScribeProvider');
    return context;
}
