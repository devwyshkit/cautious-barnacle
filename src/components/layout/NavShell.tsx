'use client';

import { usePathname } from 'next/navigation';
import { AppBar, AppBarMode } from './AppBar';
import { BottomNav } from './BottomNav';
import { triggerHaptic, HapticPattern } from '@/lib/utils';
import { LocationData } from '@/lib/actions/discovery/location';
import { ComplianceFooter } from './ComplianceFooter';
import { DesktopFooter } from './DesktopFooter';
import { cn } from '@/lib/utils';

interface NavShellProps {
    initialLocation: LocationData;
    mastheadProps?: {
        status?: 'normal' | 'delayed' | 'capacity';
        etaMinutes?: number;
        locationName?: string;
        isVisible?: boolean;
    };
    children: React.ReactNode;
    modal?: React.ReactNode;
}

/**
 * WYSHKIT 2026: NavShell - Singleton Layout Controller
 *
 * WYSHKIT 2026 Pattern: Immersive Toggle
 * - Hides/Switches global navigation on checkout/auth flows where focus is required.
 * - Manages global spacing (padding-top) to prevent jank.
 */
export function NavShell({ initialLocation, mastheadProps, children, modal }: NavShellProps) {
    const pathname = usePathname();

    // Determine AppBar mode based on path
    let appBarMode: AppBarMode = 'main';
    if (pathname.startsWith('/checkout') || pathname.startsWith('/onboarding') || pathname.startsWith('/auth')) {
        appBarMode = 'transactional';
        if (pathname.startsWith('/auth')) appBarMode = 'immersive';
    } else if (pathname.startsWith('/orders/')) {
        appBarMode = 'tracking';
    }

    // WYSHKIT 2026: Footer Allowlist (Strict Mode)
    // Only show on Hub pages. Never on transactional pages.
    const showFooter = pathname === '/' ||
        pathname.startsWith('/vendor/') ||
        pathname.startsWith('/category/') ||
        pathname.startsWith('/collection/');

    const hasMasthead = !!(mastheadProps?.status || mastheadProps?.etaMinutes || mastheadProps?.locationName) && appBarMode === 'main';

    return (
        <div data-immersive={appBarMode !== 'main'} className="flex flex-col min-h-[100dvh]">
            <AppBar
                mode={appBarMode}
                location={initialLocation}
                status={mastheadProps?.status}
                etaMinutes={mastheadProps?.etaMinutes}
                locationName={mastheadProps?.locationName}
                hasMasthead={hasMasthead}
            />
            <main
                className={cn(
                    "flex-1 transition-all duration-300",
                    appBarMode === 'main' && !hasMasthead && "pt-[var(--top-header-base-mobile)] md:pt-[var(--top-header-height)]",
                    appBarMode === 'main' && hasMasthead && "pt-[var(--top-header-height-mobile-with-masthead)] md:pt-[var(--top-header-height)]",
                    (appBarMode === 'transactional' || appBarMode === 'tracking') && "pt-10 md:pt-12"
                )}
            >
                {children}
                {modal}
                {/* Legal Footer (Desktop/Mobile - Bottom of page content) */}
                {appBarMode === 'main' && showFooter && <DesktopFooter className="hidden md:block" />}
            </main>
            {appBarMode === 'main' && <BottomNav />}
        </div>
    );
}
