'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { logger } from '@/lib/logging/logger';

export default function CustomerError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        // Log to our centralized logger
        logger.error('Customer Route Error', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="size-20 rounded-full bg-[var(--well-destructive)] flex items-center justify-center mb-6 border border-[var(--destructive)]/10">
                <AlertCircle className="size-10 text-[var(--destructive)]" />
            </div>

            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight mb-2">
                Something went wrong
            </h1>

            <p className="text-sm font-medium text-[var(--text-secondary)] max-w-[280px] mb-8 leading-relaxed">
                We encountered an error while loading this page. Our team has been notified.
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                    onClick={() => reset()}
                    className="flex items-center justify-center gap-2 w-full bg-[var(--text-primary)] text-[var(--text-inverse)] rounded-[var(--radius-lg)] py-4 font-bold text-sm active:scale-95 transition-all shadow-lg shadow-[var(--shadow-sm)]"
                >
                    <RefreshCcw className="size-4" />
                    Try Again
                </button>

                <button
                    onClick={() => router.push('/')}
                    className="flex items-center justify-center gap-2 w-full bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-[var(--radius-lg)] py-4 font-bold text-sm active:scale-95 transition-all"
                >
                    <Home className="size-4" />
                    Back to Home
                </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
                <div className="mt-12 w-full max-w-xl text-left">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Developer Context</p>
                    <pre className="p-4 bg-[var(--surface-muted)] rounded-[var(--radius-lg)] border border-[var(--border)] text-xs font-mono text-[var(--text-tertiary)] overflow-auto max-h-40">
                        {error.stack || error.message}
                    </pre>
                </div>
            )}
        </div>
    );
}
