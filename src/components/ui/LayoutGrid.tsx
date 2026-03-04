import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutGridProps {
    children: React.ReactNode;
    cols?: 1 | 2 | 3 | 4 | 5 | 6;
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function LayoutGrid({
    children,
    cols = 2,
    gap = 'md',
    className
}: LayoutGridProps) {
    const colClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-[var(--space-1)]',
        3: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-[var(--space-1)]',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-[var(--space-1)]',
        5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-[var(--space-1)]',
        6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6 px-[var(--space-1)]'
    };

    const gapClasses = {
        none: 'gap-0',
        xs: 'gap-[var(--space-1)]',
        sm: 'gap-[var(--space-2)]',
        md: 'gap-[var(--space-4)]',
        lg: 'gap-[var(--space-6)]',
        xl: 'gap-[var(--space-8)]'
    };

    return (
        <div className={cn(
            "grid w-full transition-all duration-500",
            colClasses[cols],
            gapClasses[gap],
            className
        )}>
            {children}
        </div>
    );
}
