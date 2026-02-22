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
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-zinc-100 max-w-sm w-full space-y-6">
                <div className="size-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                    <AlertCircle className="size-10 text-red-500" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-black text-zinc-950 tracking-tighter">Checkout Interrupted</h2>
                    <p className="text-sm text-zinc-500 font-medium">
                        We encountered a hitch while preparing your order. Your items are safe in the bag.
                    </p>
                </div>

                <div className="space-y-3 pt-2">
                    <Button
                        onClick={() => reset()}
                        className="w-full h-12 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold"
                    >
                        <RefreshCcw className="size-4 mr-2" />
                        Try Again
                    </Button>

                    <Button
                        variant="ghost"
                        asChild
                        className="w-full h-12 rounded-2xl text-zinc-500 font-bold"
                    >
                        <Link href="/">
                            <ShoppingBag className="size-4 mr-2" />
                            Return to Discovery
                        </Link>
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <p className="text-xs text-zinc-300 font-mono break-all">{error.message}</p>
                )}
            </div>
        </div>
    );
}
