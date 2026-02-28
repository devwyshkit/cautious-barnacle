'use client';

import React from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ModalHeaderProps {
    title?: string;
    onBack?: () => void;
    onClose?: () => void;
    showBack?: boolean;
    showClose?: boolean;
    className?: string;
    isSheet?: boolean;
}

export function ModalHeader({
    title,
    onBack,
    onClose,
    showBack = true,
    showClose = false,
    className,
    isSheet = true
}: ModalHeaderProps) {
    const router = useRouter();

    const handleBack = onBack || (() => router.back());
    const handleClose = onClose || (() => router.back());

    return (
        <div className={cn(
            "flex flex-col shrink-0 bg-white z-10",
            isSheet ? "pt-2" : "pt-0",
            className
        )}>
            {/* Pull Indicator for Sheets */}
            {isSheet && (
                <div className="flex justify-center pb-2">
                    <div className="h-1.5 w-12 rounded-full bg-zinc-200" aria-hidden />
                </div>
            )}

            <div className="h-16 flex items-center px-4 gap-4">
                {showBack && (
                    <button
                        onClick={handleBack}
                        className="size-10 flex items-center justify-center rounded-xl bg-zinc-50 text-zinc-900 active:scale-95 transition-all"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                )}

                <div className="flex-1 min-w-0">
                    {title && (
                        <h2 className="text-[17px] font-bold text-zinc-950 truncate tracking-tight">
                            {title}
                        </h2>
                    )}
                </div>

                {showClose && (
                    <button
                        onClick={handleClose}
                        className="size-10 flex items-center justify-center rounded-xl bg-zinc-50 text-zinc-900 active:scale-95 transition-all"
                        aria-label="Close"
                    >
                        <X className="size-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
