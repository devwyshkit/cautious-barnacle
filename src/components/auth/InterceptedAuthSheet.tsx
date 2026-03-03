'use client';

import React from 'react';
import { X } from 'lucide-react';
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
        <div className="fixed inset-0 z-[var(--z-modal)] bg-[var(--surface)] flex flex-col pt-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="max-w-lg mx-auto w-full px-6 flex flex-col h-full">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full bg-[var(--surface-muted)]"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto pb-12">
                    <AuthPageClient intent={intent} returnUrl={returnUrl} />
                </div>
            </div>
        </div>
    );
}
