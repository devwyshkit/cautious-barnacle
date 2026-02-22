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
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="space-y-6 max-w-sm">
                <div className="size-16 rounded-full bg-zinc-50 flex items-center justify-center mx-auto">
                    <AlertCircle className="size-8 text-zinc-900" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-black text-zinc-950 tracking-tighter">Something went wrong</h2>
                    <p className="text-sm text-zinc-500 font-medium px-4">
                        We're having trouble loading this section. Our team has been notified.
                    </p>
                </div>

                <Button
                    onClick={() => reset()}
                    className="w-full h-12 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold"
                >
                    <RefreshCcw className="size-4 mr-2" />
                    Try Again
                </Button>
            </div>
        </div>
    );
}
