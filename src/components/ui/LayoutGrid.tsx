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
        2: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        3: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
    };

    const gapClasses = {
        none: 'gap-0',
        xs: 'gap-1 md:gap-2',
        sm: 'gap-2 md:gap-3',
        md: 'gap-4 md:gap-6',
        lg: 'gap-6 md:gap-8',
        xl: 'gap-8 md:gap-12'
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
