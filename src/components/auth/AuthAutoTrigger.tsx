'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useUI } from '@/providers/UIProvider';

/**
 * WYSHKIT 2026: Auth Auto-Trigger
 * Listens for ?auth=true, ?profile=true, or ?search=true in URL to open the corresponding sheet.
 * This handles redirects from middleware/server-side protected routes and legacy links.
 */
export function AuthAutoTrigger() {
    const { openOTPSheet, openProfileSheet, openSearchSheet } = useUI();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        const shouldAuth = searchParams.get('auth') === 'true';
        const shouldProfile = searchParams.get('profile') === 'true';
        const shouldSearch = searchParams.get('search') === 'true';
        const tab = searchParams.get('tab');

        if (shouldAuth) {
            openOTPSheet();
        } else if (shouldProfile) {
            openProfileSheet(tab || 'account');
        } else if (shouldSearch) {
            openSearchSheet();
        }

        if (shouldAuth || shouldProfile || shouldSearch) {
            // Clean up URL without refreshing
            const params = new URLSearchParams(searchParams.toString());
            params.delete('auth');
            params.delete('profile');
            params.delete('search');
            params.delete('tab');
            const newQuery = params.toString();
            const newUrl = `${pathname}${newQuery ? `?${newQuery}` : ''}`;
            window.history.replaceState(null, '', newUrl);
        }
    }, [searchParams, openOTPSheet, openProfileSheet, openSearchSheet, pathname]);

    return null;
}
