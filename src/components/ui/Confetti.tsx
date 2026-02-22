'use client';

import React, { useEffect, useState } from 'react';

/**
 * WYSHKIT 2026: CSS-based Confetti Animation
 * Replaced framer-motion with pure CSS animations for better performance
 */
export function Confetti() {
    const [pieces, setPieces] = useState<Array<{
        id: number;
        x: number;
        size: number;
        color: string;
        delay: number;
        duration: number;
        drift: number;
    }>>([]);

    useEffect(() => {
        const colors = ['#C5A059', '#161824', '#F1F1F6', '#686B78'];
        const newPieces = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 2,
            duration: Math.random() * 2 + 3,
            drift: (Math.random() * 20 - 10), // Horizontal drift
        }));
        setPieces(newPieces);

        const timer = setTimeout(() => setPieces([]), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {pieces.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-sm confetti-piece"
                    style={{
                        left: `${p.x}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        '--confetti-delay': `${p.delay}s`,
                        '--confetti-duration': `${p.duration}s`,
                        '--confetti-drift': `${p.drift}px`,
                    } as React.CSSProperties & {
                        '--confetti-delay': string;
                        '--confetti-duration': string;
                        '--confetti-drift': string;
                    }}
                />
            ))}
        </div>
    );
}
