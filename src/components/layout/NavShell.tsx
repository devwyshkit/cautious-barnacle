'use client';

import { usePathname } from 'next/navigation';
import { TopHeader } from './TopHeader';
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
 * - Hides global navigation on checkout/auth flows where focus is required.
 * - Manages global spacing (padding-top) to prevent jank.
 */
export function NavShell({ initialLocation, mastheadProps, children, modal }: NavShellProps) {
    const pathname = usePathname();

    // Immersive routes where we hide the global header/nav
    // WYSHKIT 2026: Focused transactional environments
    const isImmersive =
        pathname.startsWith('/checkout') ||
        pathname.startsWith('/orders/') || // Matches /orders/[id] but not /orders
        pathname.startsWith('/onboarding');

    // WYSHKIT 2026: Footer Allowlist (Strict Mode)
    // Only show on Hub pages. Never on transactional pages.
    const showFooter = pathname === '/' ||
        pathname.startsWith('/vendor/') ||
        pathname.startsWith('/category/') ||
        pathname.startsWith('/collection/');

    const hideHeader = isImmersive;
    const hasMasthead = !!(mastheadProps?.status || mastheadProps?.etaMinutes || mastheadProps?.locationName) && !hideHeader;

    return (
        <div data-immersive={isImmersive} className="flex flex-col min-h-[100dvh]">
            {!hideHeader && (
                <TopHeader
                    location={initialLocation}
                    status={mastheadProps?.status}
                    etaMinutes={mastheadProps?.etaMinutes}
                    locationName={mastheadProps?.locationName}
                    hasMasthead={hasMasthead}
                />
            )}
            <main
                className={cn(
                    "flex-1 transition-all duration-300",
                    !hideHeader && !hasMasthead && "pt-[var(--top-header-base-mobile)] md:pt-[var(--top-header-height)]",
                    !hideHeader && hasMasthead && "pt-[var(--top-header-height-mobile-with-masthead)] md:pt-[var(--top-header-height)]"
                )}
            >
                {children}
                {modal}
                {/* Legal Footer (Desktop/Mobile - Bottom of page content) */}
                {!isImmersive && showFooter && <DesktopFooter className="hidden md:block" />}
            </main>
            {!isImmersive && <BottomNav />}
        </div>
    );
}
