'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface UIContextType {
    isLocationSheetOpen: boolean;
    isCartDrawerOpen: boolean;
    isSupportSheetOpen: boolean;
    openLocationSheet: () => void;
    closeLocationSheet: () => void;
    openCartDrawer: () => void;
    closeCartDrawer: () => void;
    openSupportSheet: () => void;
    closeSupportSheet: () => void;
    toggleLocationSheet: () => void;
    toggleCartDrawer: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
    const [isSupportSheetOpen, setIsSupportSheetOpen] = useState(false);

    const openLocationSheet = useCallback(() => setIsLocationSheetOpen(true), []);
    const closeLocationSheet = useCallback(() => setIsLocationSheetOpen(false), []);
    const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
    const closeCartDrawer = useCallback(() => setIsCartDrawerOpen(false), []);
    const openSupportSheet = useCallback(() => setIsSupportSheetOpen(true), []);
    const closeSupportSheet = useCallback(() => setIsSupportSheetOpen(false), []);

    const toggleLocationSheet = useCallback(() => setIsLocationSheetOpen(prev => !prev), []);
    const toggleCartDrawer = useCallback(() => setIsCartDrawerOpen(prev => !prev), []);

    return (
        <UIContext.Provider
            value={{
                isLocationSheetOpen,
                isCartDrawerOpen,
                isSupportSheetOpen,
                openLocationSheet,
                closeLocationSheet,
                openCartDrawer,
                closeCartDrawer,
                openSupportSheet,
                closeSupportSheet,
                toggleLocationSheet,
                toggleCartDrawer
            }}
        >
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
