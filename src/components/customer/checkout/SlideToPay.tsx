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
 * Swiggy 2026 Pattern: Healthy Friction
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
    const [isTouchDevice, setIsTouchDevice] = useState<boolean | null>(null); // null until hydrated — avoids desktop flash
    const constraintsRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
            <div className="w-full h-16 bg-[#D91B24] rounded-[24px] flex items-center justify-center shadow-lg shadow-red-500/20">
                <div className="size-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    // WYSHKIT 2026: Desktop Integrity
    // isTouchDevice=null (SSR) or false (desktop) → always show button, never the slide track
    // This prevents the flash of "Slide to Pay" text on desktop before hydration
    if (isTouchDevice === null || !isTouchDevice) {
        return (
            <Button
                size="lg"
                onClick={() => {
                    setIsSuccess(true);
                    triggerHaptic(HapticPattern.SUCCESS);
                    onPay();
                }}
                className="w-full h-16 rounded-[24px] text-[13px] font-black uppercase tracking-[0.2em] shadow-xl shadow-red-500/10 gap-3 group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <ShieldCheck className="size-5" />
                <span>Place Order · {formatCurrency(amount)}</span>
            </Button>
        );
    }

    return (
        <div
            ref={constraintsRef}
            className="relative w-full h-16 bg-zinc-100 rounded-[24px] overflow-hidden p-1.5 select-none border border-zinc-200 shadow-inner"
        >
            {/* Background Progress */}
            <div
                className="absolute inset-y-0 left-0 bg-[#D91B24] rounded-[18px] z-0 transition-opacity duration-150"
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
                    <ChevronRight className="size-4 text-zinc-400 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 select-none">
                        Slide to Pay {formatCurrency(amount)}
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
                    "relative z-10 size-13 bg-white rounded-[18px] shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-150",
                    isDragging && "scale-95",
                    isSuccess && "scale-90 opacity-0 transition-all duration-300"
                )}
                style={{
                    transform: `translateX(${dragX}px)`,
                    touchAction: 'none',
                }}
            >
                <div className="size-10 rounded-[14px] bg-zinc-50 flex items-center justify-center border border-zinc-100">
                    <ChevronRight className="size-6 text-zinc-900" />
                </div>
            </div>
        </div>
    );
}
