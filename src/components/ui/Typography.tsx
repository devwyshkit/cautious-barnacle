'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * WYSHKIT 2026 Typography Contract
 * 
 * ROLE                      | WEIGHT | SIZE
 * --------------------------|--------|------------------
 * Page Title (H1)           | 900    | heading-lg (24px)
 * Section Headers (H2, H3)  | 700    | heading-md (20px)
 * Subheaders / UI Labels    | 600    | body-md (16px)
 * Body Text                 | 500    | body-sm (14px)
 * Captions / Metadata       | 500    | caption (11px)
 */

interface AppTextProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'body' | 'body-sm' | 'label' | 'caption' | 'metadata';
    weight?: 'medium' | 'semibold' | 'bold';
    as?: 'span' | 'p' | 'div' | 'label';
}

export function AppText({
    variant = 'body',
    weight,
    as: Component = 'span',
    className,
    ...props
}: AppTextProps) {
    const styles = {
        body: 'text-[var(--font-size-body-md)]',
        'body-sm': 'text-[var(--font-size-body-sm)]',
        label: 'text-[var(--font-size-body-sm)]',
        caption: 'text-[var(--font-size-caption)]',
        metadata: 'text-[var(--font-size-label)]',
    };

    const weights = {
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
    };

    // Default weight per variant if not specified
    const defaultWeight = variant === 'label' ? 'semibold' : 'medium';

    return (
        <Component
            className={cn(
                styles[variant],
                weights[weight || defaultWeight],
                'tracking-tight leading-tight',
                className
            )}
            {...props}
        />
    );
}

interface AppHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 1 | 2 | 3 | 4;
}

export function AppHeading({ level = 2, className, ...props }: AppHeadingProps) {
    const Component = `h${level}` as React.ElementType;

    const styles = {
        1: 'text-[var(--font-size-heading-lg)] font-black tracking-tighter uppercase',
        2: 'text-[var(--font-size-heading-md)] font-bold tracking-tight',
        3: 'text-[var(--font-size-heading-sm)] font-bold tracking-tight',
        4: 'text-[var(--font-size-body-md)] font-semibold tracking-tight',
    };

    return (
        <Component
            className={cn(styles[level as keyof typeof styles], className)}
            {...props}
        />
    );
}
