'use client';

import { usePathname } from 'next/navigation';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { LocationData } from '@/lib/actions/discovery/location';
import { ComplianceFooter } from './ComplianceFooter';
import { cn } from '@/lib/utils';

interface NavShellProps {
    initialLocation: LocationData;
    mastheadProps?: {
        status?: 'normal' | 'delayed' | 'capacity';
        etaMinutes?: number;
        locationName?: string;
    };
    children: React.ReactNode;
}

/**
 * WYSHKIT 2026: NavShell - Singleton Layout Controller
 *
 * WYSHKIT 2026 Pattern: Immersive Toggle
 * - Hides global navigation on checkout/auth flows where focus is required.
 * - Manages global spacing (padding-top) to prevent jank.
 */
export function NavShell({ initialLocation, mastheadProps, children }: NavShellProps) {
    const pathname = usePathname();

    // Immersive routes where we hide the global header/nav
    // WYSHKIT 2026: Focused transactional environments
    const isImmersive =
        pathname.startsWith('/auth') ||
        pathname.startsWith('/checkout') ||
        pathname.startsWith('/orders/') || // Matches /orders/[id] but not /orders
        pathname.startsWith('/onboarding');

    // WYSHKIT 2026: Footer Allowlist (Strict Mode)
    // Only show on Hub pages. Never on transactional pages.
    const showFooter = ['/', '/search', '/profile'].includes(pathname) ||
        pathname.startsWith('/category/') ||
        pathname.startsWith('/collection/');

    const hideHeader = isImmersive || pathname === '/search';

    return (
        <div data-immersive={isImmersive} className="flex flex-col min-h-[100dvh]">
            {!hideHeader && <TopHeader initialLocation={initialLocation} mastheadProps={mastheadProps} />}
            <main className={cn(
                "flex-1 transition-all duration-300",
                !hideHeader && "pt-[var(--top-header-height-mobile)] md:pt-[var(--top-header-height)]"
            )}>
                {children}
                {/* Legal Footer (Desktop/Mobile - Bottom of page content) */}
                {!isImmersive && showFooter && <ComplianceFooter className="hidden md:block" />}
            </main>
            {!isImmersive && <BottomNav />}
        </div>
    );
}
