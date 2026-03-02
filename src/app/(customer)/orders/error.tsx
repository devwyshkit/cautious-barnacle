'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function GeneralError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        import('@/lib/logging/logger').then(({ logger }) => {
            logger.error('Page error:', error);
        });
    }, [error]);

    return (
        <div className="min-h-[100dvh] bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
            <div className="space-y-6 max-w-sm">
                <div className="size-16 rounded-full bg-[var(--surface-muted)] flex items-center justify-center mx-auto">
                    <AlertCircle className="size-8 text-[var(--text-primary)]" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tighter">Something went wrong</h2>
                    <p className="text-sm text-[var(--text-secondary)] font-medium px-4">
                        We&apos;re having trouble loading this section. Our team has been notified.
                    </p>
                </div>

                <Button
                    onClick={() => reset()}
                    className="w-full h-12 rounded-[var(--radius-md)] bg-[var(--foreground)] hover:bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold"
                >
                    <RefreshCcw className="size-4 mr-2" />
                    Try Again
                </Button>
            </div>
        </div>
    );
}
