'use client';

import { usePathname } from 'next/navigation';
import { useRef, useEffect } from 'react';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { LocationData } from '@/lib/actions/location';
import { ComplianceFooter } from './ComplianceFooter';

interface NavShellProps {
    initialLocation: LocationData;
    children: React.ReactNode;
}

/**
 * WYSHKIT 2026: NavShell - Singleton Layout Controller
 *
 * Swiggy 2026 Pattern: Immersive Toggle
 * - Hides global navigation on checkout/auth flows where focus is required.
 * - Manages global spacing (padding-top) to prevent jank.
 */
export function NavShell({ initialLocation, children }: NavShellProps) {
    const pathname = usePathname();

    // Immersive routes where we hide the global header/nav
    const isImmersive = pathname === '/checkout' || pathname.startsWith('/auth') || (pathname.startsWith('/orders/') && pathname !== '/orders');

    // WYSHKIT 2026: Footer Allowlist (Strict Mode)
    // Only show on Hub pages. Never on transactional pages.
    const showFooter = ['/', '/search', '/profile'].includes(pathname) ||
        pathname.startsWith('/category/') ||
        pathname.startsWith('/collection/');

    // WYSHKIT 2026: Synchronize layout variables with visibility
    useEffect(() => {
        const root = document.documentElement;
        if (isImmersive) {
            root.style.setProperty('--bottom-nav-height', '0px');
        } else {
            // WYSHKIT 2026: Mobile bottom nav is 64px (h-16) + safe-area
            root.style.setProperty('--bottom-nav-height', window.innerWidth < 768 ? 'calc(64px + env(safe-area-inset-bottom, 0px))' : '0px');
        }
    }, [isImmersive, pathname]);

    return (
        <>
            {!isImmersive && <TopHeader initialLocation={initialLocation} />}
            <div className={!isImmersive ? "pt-[72px] md:pt-16 min-h-screen" : "min-h-screen"}>
                {children}
                {/* Legal Footer (Desktop/Mobile - Bottom of page content) */}
                {!isImmersive && showFooter && <ComplianceFooter className="hidden md:block" />}
            </div>
            {!isImmersive && <BottomNav />}
        </>
    );
}
