'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { AuthPageClient } from '@/components/auth/AuthPageClient';

interface InterceptedAuthSheetProps {
    intent?: 'signin' | 'signup';
    returnUrl?: string;
}

/**
 * WYSHKIT 2026: Intercepted Auth Sheet
 * Pattern: Elite Context Preservation
 * - Wraps AuthPageClient in a bottom sheet
 * - Used via Parallel Routes (@modal) to preserve shopping context
 */
export function InterceptedAuthSheet({ intent = 'signin', returnUrl = '/' }: InterceptedAuthSheetProps) {
    const router = useRouter();

    return (
        <ResponsiveSurface
            open={true}
            onOpenChange={(open) => {
                if (!open) {
                    router.back();
                }
            }}
        >
            <div className="bg-white p-6 pb-12">
                <AuthPageClient intent={intent} returnUrl={returnUrl} />
            </div>
        </ResponsiveSurface>
    );
}
