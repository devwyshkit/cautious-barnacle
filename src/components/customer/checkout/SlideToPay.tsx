'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/pricing';

function ShimmerHint({ threshold }: { threshold: number }) {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{
                    '--shimmer-distance': `${threshold}px`,
                    animation: 'slideToPay-shimmer 2s ease-in-out infinite',
                } as React.CSSProperties}
            />
        </div>
    );
}

interface SlideToPayProps {
    onPay: () => void;
    amount: number;
    isProcessing?: boolean;
}

/**
 * WYSHKIT 2026: Slide-to-Pay Widget
 * 
 * WYSHKIT 2026 Pattern: Healthy Friction
 * - Dynamic threshold based on actual container width
 * - Shimmer hint encourages the gesture
 * - High-fidelity haptics provide physical confirmation
 * - Pure CSS animations (no framer-motion)
 */
export function SlideToPay({
    onPay,
    amount,
    isProcessing
}: SlideToPayProps) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [showShimmer, setShowShimmer] = useState(false);
    const [containerWidth, setContainerWidth] = useState(320);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [mounted, setMounted] = useState(false);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    // WYSHKIT 2026: Calculate dynamic threshold
    // Threshold is total width minus handle size minus padding
    const handleSize = 52;
    const padding = 12; // 1.5 * 4 (p-1.5) * 2
    const threshold = containerWidth - handleSize - padding;

    // Calculate opacity based on drag position
    const textOpacity = Math.max(0, 1 - dragX / 50);
    const bgOpacity = Math.min(1, dragX / threshold);
    const bgWidth = Math.min(threshold, dragX);

    // Measure container width on mount and resize
    useLayoutEffect(() => {
        const updateWidth = () => {
            if (constraintsRef.current) {
                setContainerWidth(constraintsRef.current.offsetWidth);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    useEffect(() => {
        // Show shimmer hint on first render
        setShowShimmer(true);
        const timer = setTimeout(() => setShowShimmer(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.clientX - dragX);
        triggerHaptic(HapticPattern.ACTION);
        if (handleRef.current) {
            handleRef.current.setPointerCapture(e.pointerId);
        }
    }, [dragX]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const newX = e.clientX - startX;
        const clampedX = Math.max(0, Math.min(threshold, newX));
        setDragX(clampedX);
    }, [isDragging, startX, threshold]);

    const prevProcessing = useRef(isProcessing);
    useEffect(() => {
        // WYSHKIT 2026: Slider Reset on Failure
        // If processing goes from true -> false without unmounting/navigating, it failed.
        if (prevProcessing.current && !isProcessing && isSuccess) {
            const timer = setTimeout(() => {
                setIsSuccess(false);
                setDragX(0);
                triggerHaptic(HapticPattern.ERROR);
            }, 150);
            return () => clearTimeout(timer);
        }
        prevProcessing.current = isProcessing;
    }, [isProcessing, isSuccess]);

    const handlePointerUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);

        // WYSHKIT 2026: 80% threshold for "Commitment"
        if (dragX > threshold * 0.8) {
            setDragX(threshold);
            setIsSuccess(true);
            onPay(); // Trigger payment directly on gesture completion
        } else {
            setDragX(0);
            triggerHaptic(HapticPattern.ACTION);
        }
    }, [isDragging, dragX, threshold, onPay]);

    if (isProcessing) {
        return (
            <div className="w-full h-16 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-[var(--shadow-brand)]">
                <div className="size-6 border-2 border-[var(--text-inverse)]/20 border-t-[var(--text-inverse)] rounded-full animate-spin" />
            </div>
        );
    }

    // WYSHKIT 2026: Desktop Integrity
    // If not mounted (SSR) or not a touch device -> show the standard button.
    // This eliminates the 10+ hydration mismatch errors caused by conditional rendering.
    if (!mounted || !isTouchDevice) {
        return (
            <Button
                size="lg"
                onClick={() => {
                    setIsSuccess(true);
                    triggerHaptic(HapticPattern.SUCCESS);
                    onPay();
                }}
                className="w-full h-16 rounded-xl text-sm font-bold tracking-tight shadow-[var(--shadow-brand)] gap-3 group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <ShieldCheck className="size-5" />
                <span>Place order · {formatCurrency(amount)}</span>
            </Button>
        );
    }

    return (
        <div
            ref={constraintsRef}
            className="relative w-full h-16 bg-[var(--surface-muted)] rounded-xl overflow-hidden p-1.5 select-none border border-[var(--border)] shadow-inner"
        >
            {/* Background Progress */}
            <div
                className="absolute inset-y-0 left-0 bg-[var(--primary)] rounded-[var(--radius-xl)] z-0 transition-opacity duration-150"
                style={{
                    width: `${bgWidth}px`,
                    opacity: bgOpacity
                }}
            />

            {/* Static Text - Clickable on Desktop */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className="flex items-center gap-3 transition-opacity duration-150"
                    style={{ opacity: textOpacity }}
                >
                    <ChevronRight className="size-4 text-[var(--text-tertiary)] animate-pulse" />
                    <span className="text-xs font-bold tracking-tight text-[var(--text-secondary)] select-none">
                        Slide to pay {formatCurrency(amount)}
                    </span>
                </div>
            </div>

            {/* Shimmer Hint */}
            {showShimmer && (
                <ShimmerHint threshold={threshold} />
            )}

            {/* Draggable Handle */}
            <div
                ref={handleRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={cn(
                    "relative z-10 size-13 bg-[var(--surface)] rounded-[var(--radius-xl)] shadow-sm flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-150",
                    isDragging && "scale-95",
                    isSuccess && "scale-90 opacity-0 transition-all duration-300"
                )}
                style={{
                    transform: `translateX(${dragX}px)`,
                    touchAction: 'none',
                }}
            >
                <div className="size-10 rounded-[var(--radius-md)] bg-[var(--surface-muted)] flex items-center justify-center border border-[var(--border)]">
                    <ChevronRight className="size-6 text-[var(--text-primary)]" />
                </div>
            </div>
        </div>
    );
}
