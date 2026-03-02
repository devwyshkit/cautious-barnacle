'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

interface ActionSliderProps {
    onConfirm: () => void | Promise<void | { success: boolean, error?: string }>;
    label?: string;
    successLabel?: string;
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;
    variant?: 'default' | 'success' | 'amber';
}

export function ActionSlider({
    onConfirm,
    label = "Slide to confirm",
    successLabel = "Confirmed",
    className,
    disabled = false,
    isLoading: externalLoading = false,
    variant = 'default'
}: ActionSliderProps) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [internalLoading, setInternalLoading] = useState(false);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const [maxDrag, setMaxDrag] = useState(240);
    const [isTouch, setIsTouch] = useState<boolean | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setIsTouch(typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
    }, []);

    const isLoading = externalLoading || internalLoading;

    // Update max drag based on container width
    useEffect(() => {
        if (containerRef.current) {
            const updateMaxDrag = () => {
                const containerWidth = containerRef.current?.offsetWidth || 0;
                const handleWidth = 48; // aspect-square sizing
                setMaxDrag(Math.max(10, containerWidth - handleWidth - 8)); // 8px for padding/gap
            };
            updateMaxDrag();
            window.addEventListener('resize', updateMaxDrag);
            return () => window.removeEventListener('resize', updateMaxDrag);
        }
    }, [isMounted]); // We'll add isMounted below

    const textOpacity = Math.max(0, 1 - dragX / (maxDrag * 0.7));

    useEffect(() => {
        if (isSuccess) {
            triggerHaptic(HapticPattern.SUCCESS);
            const timer = setTimeout(() => {
                setIsSuccess(false);
                setDragX(0);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    const handleConfirm = async () => {
        if (disabled || isLoading || isSuccess) return;

        setInternalLoading(true);
        try {
            const result = await onConfirm();
            // If the result is an object with success: false, it failed (likely validation)
            if (result && typeof result === 'object' && 'success' in result && !result.success) {
                setDragX(0);
                triggerHaptic(HapticPattern.ERROR);
            } else {
                setDragX(maxDrag);
                setIsSuccess(true);
            }
        } catch (err) {
            setDragX(0);
            triggerHaptic(HapticPattern.ERROR);
        } finally {
            setInternalLoading(false);
        }
    };

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (disabled || isLoading || isSuccess) return;
        setIsDragging(true);
        setStartX(e.clientX - dragX);
        if (handleRef.current) {
            handleRef.current.setPointerCapture(e.pointerId);
        }
    }, [disabled, isLoading, isSuccess, dragX]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging || disabled || isLoading || isSuccess) return;
        const newX = e.clientX - startX;
        const clampedX = Math.max(0, Math.min(maxDrag, newX));
        setDragX(clampedX);
    }, [isDragging, disabled, isLoading, isSuccess, startX, maxDrag]);

    const handlePointerUp = useCallback(async () => {
        if (!isDragging || disabled || isLoading || isSuccess) {
            setIsDragging(false);
            return;
        }

        // 70% threshold for confirmation
        if (dragX > maxDrag * 0.7) {
            await handleConfirm();
        } else {
            setDragX(0);
        }
        setIsDragging(false);
    }, [isDragging, disabled, isLoading, isSuccess, dragX, maxDrag, handleConfirm]);

    if (!isMounted) return null;

    // Desktop fallback
    // isTouch=null (SSR) -> Default to button for Zero-Flash Desktop
    if (isTouch === null || !isTouch) {
        return (
            <button
                disabled={disabled || isLoading || isSuccess}
                onClick={handleConfirm}
                className={cn(
                    "relative h-14 w-full rounded-[var(--radius-md)] font-bold tracking-tight transition-all duration-300",
                    isSuccess ? "bg-[var(--success)] text-[var(--text-inverse)]" : "text-[var(--text-inverse)] bg-[var(--primary)] shadow-brand hover:bg-[var(--primary-hover)]",
                    "border-none",
                    (disabled || isLoading) && "opacity-60 cursor-not-allowed",
                    className
                )}
                aria-label={isSuccess ? successLabel : label.replace(/Slide to\s+/i, '')}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                        <Loader2 className="size-5 animate-spin" />
                        <span>Working...</span>
                    </div>
                ) : isSuccess ? (
                    <div className="flex items-center justify-center gap-2">
                        <Check className="size-5 stroke-[4]" />
                        <span>{successLabel}</span>
                    </div>
                ) : (
                    label.replace(/Slide to\s+/i, '')
                )}
            </button>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative h-14 w-full bg-[var(--surface-muted)] rounded-[var(--radius-md)] overflow-hidden p-1 select-none transition-colors duration-300",
                disabled || isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                isSuccess ? "bg-[var(--success)]" : "",
                className
            )}
            onClick={() => {
                if (!disabled && !isLoading && !isSuccess && !isDragging && dragX === 0) {
                    handleConfirm();
                }
            }}
        >
            {/* Instruction Text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className="flex items-center gap-3 transition-opacity duration-150"
                    style={{ opacity: textOpacity }}
                >
                    <ChevronRight className="size-4 text-[var(--text-tertiary)] animate-pulse" />
                    <span className="text-xs font-bold tracking-tight text-[var(--text-tertiary)]">
                        {label}
                    </span>
                </div>
            </div>

            {/* Progress Track */}
            <div
                className={cn(
                    "absolute left-0 top-0 bottom-0 pointer-events-none transition-all duration-75",
                    isSuccess ? "bg-[var(--success)]" : "bg-[var(--border)]"
                )}
                style={{ width: isSuccess ? '100%' : `${dragX + 24}px` }}
            />

            {/* Handle */}
            {!isSuccess && !isLoading && (
                <div
                    ref={handleRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className={cn(
                        "absolute left-1 top-1 bottom-1 aspect-square rounded-[var(--radius-md)] flex items-center justify-center shadow-lg z-10 transition-transform duration-150",
                        isDragging ? "scale-95 cursor-grabbing" : "cursor-grab",
                        "bg-[var(--primary)]"
                    )}
                    style={{
                        transform: `translateX(${dragX}px)`,
                        touchAction: 'none',
                    }}
                >
                    <ChevronRight className="size-5 text-[var(--text-inverse)] stroke-[3]" />
                </div>
            )}

            {/* Loading/Success Icon */}
            {(isLoading || isSuccess) && (
                <div
                    className="absolute left-1 top-1 bottom-1 aspect-square bg-[var(--surface)] rounded-[var(--radius-md)] flex items-center justify-center shadow-lg z-10 animate-in zoom-in duration-300"
                    style={{ transform: isSuccess ? `translateX(${maxDrag}px)` : 'none' }}
                >
                    {isLoading ? (
                        <Loader2 className="size-5 text-[var(--text-primary)] animate-spin" />
                    ) : (
                        <Check className="size-5 text-[var(--success)] stroke-[4]" />
                    )}
                </div>
            )}
        </div>
    );
}
