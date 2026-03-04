'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface UIContextType {
    isLocationSheetOpen: boolean;
    isCartDrawerOpen: boolean;
    isProfileSheetOpen: boolean;
    isOTPSheetOpen: boolean;
    isCartSwitchSheetOpen: boolean;
    isSearchSheetOpen: boolean;
    isProductSheetOpen: boolean;
    activeProduct: any | null;
    profileTab: string;
    openLocationSheet: () => void;
    closeLocationSheet: () => void;
    openCartDrawer: () => void;
    closeCartDrawer: () => void;
    openProfileSheet: (tab?: string) => void;
    closeProfileSheet: () => void;
    openOTPSheet: () => void;
    closeOTPSheet: () => void;
    openCartSwitchSheet: () => void;
    closeCartSwitchSheet: () => void;
    openSearchSheet: () => void;
    closeSearchSheet: () => void;
    openProductSheet: (product: any) => void;
    closeProductSheet: () => void;
    toggleLocationSheet: () => void;
    toggleCartDrawer: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
    const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
    const [isOTPSheetOpen, setIsOTPSheetOpen] = useState(false);
    const [isCartSwitchSheetOpen, setIsCartSwitchSheetOpen] = useState(false);
    const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);
    const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState<any | null>(null);
    const [profileTab, setProfileTab] = useState('account');

    const openLocationSheet = useCallback(() => setIsLocationSheetOpen(true), []);
    const closeLocationSheet = useCallback(() => setIsLocationSheetOpen(false), []);
    const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
    const closeCartDrawer = useCallback(() => setIsCartDrawerOpen(false), []);
    const openProfileSheet = useCallback((tab?: string) => {
        if (tab) setProfileTab(tab);
        setIsProfileSheetOpen(true);
    }, []);
    const closeProfileSheet = useCallback(() => setIsProfileSheetOpen(false), []);
    const openOTPSheet = useCallback(() => setIsOTPSheetOpen(true), []);
    const closeOTPSheet = useCallback(() => setIsOTPSheetOpen(false), []);
    const openCartSwitchSheet = useCallback(() => setIsCartSwitchSheetOpen(true), []);
    const closeCartSwitchSheet = useCallback(() => setIsCartSwitchSheetOpen(false), []);
    const openSearchSheet = useCallback(() => setIsSearchSheetOpen(true), []);
    const closeSearchSheet = useCallback(() => setIsSearchSheetOpen(false), []);
    const openProductSheet = useCallback((product: any) => {
        setActiveProduct(product);
        setIsProductSheetOpen(true);
    }, []);
    const closeProductSheet = useCallback(() => {
        setIsProductSheetOpen(false);
        // Delay clearing product to avoid layout shift during exit anim
        setTimeout(() => setActiveProduct(null), 300);
    }, []);

    const toggleLocationSheet = useCallback(() => setIsLocationSheetOpen(prev => !prev), []);
    const toggleCartDrawer = useCallback(() => setIsCartDrawerOpen(prev => !prev), []);

    return (
        <UIContext.Provider
            value={{
                isLocationSheetOpen,
                isCartDrawerOpen,
                isProfileSheetOpen,
                isOTPSheetOpen,
                isCartSwitchSheetOpen,
                isSearchSheetOpen,
                isProductSheetOpen,
                activeProduct,
                profileTab,
                openLocationSheet,
                closeLocationSheet,
                openCartDrawer,
                closeCartDrawer,
                openProfileSheet,
                closeProfileSheet,
                openOTPSheet,
                closeOTPSheet,
                openCartSwitchSheet,
                closeCartSwitchSheet,
                openSearchSheet,
                closeSearchSheet,
                openProductSheet,
                closeProductSheet,
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
