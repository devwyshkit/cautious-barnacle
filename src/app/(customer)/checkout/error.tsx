'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to monitoring service
        import('@/lib/logging/logger').then(({ logger }) => {
            logger.error('Checkout error:', error);
        });
    }, [error]);

    return (
        <div className="min-h-[100dvh] bg-[var(--surface-muted)] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-[var(--surface)] rounded-[var(--radius-3xl)] p-10 shadow-sm border border-[var(--border)] max-w-sm w-full space-y-6">
                <div className="size-20 rounded-full bg-[var(--well-destructive)] flex items-center justify-center mx-auto">
                    <AlertCircle className="size-10 text-[var(--destructive)]" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tighter">Checkout Interrupted</h2>
                    <p className="text-sm text-[var(--text-secondary)] font-medium">
                        We encountered a hitch while preparing your order. Your products are safe in the bag.
                    </p>
                </div>

                <div className="space-y-3 pt-2">
                    <Button
                        onClick={() => reset()}
                        className="w-full h-12 rounded-xl bg-[var(--foreground)] hover:bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold"
                    >
                        <RefreshCcw className="size-4 mr-2" />
                        Try Again
                    </Button>

                    <Button
                        variant="ghost"
                        asChild
                        className="w-full h-12 rounded-xl text-[var(--text-secondary)] font-bold"
                    >
                        <Link href="/">
                            <ShoppingBag className="size-4 mr-2" />
                            Return to Discovery
                        </Link>
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <p className="text-xs text-[var(--text-tertiary)] font-mono break-all">{error.message}</p>
                )}
            </div>
        </div>
    );
}
