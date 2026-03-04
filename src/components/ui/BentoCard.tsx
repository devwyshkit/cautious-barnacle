import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BentoCardProps {
    data: any;
    variant?: 'large' | 'small';
    priority?: boolean;
}

export function BentoCard({ data, variant = 'small', priority = false }: BentoCardProps) {
    if (!data) return null;

    const isLarge = variant === 'large';

    const vendorSlug = data.slug || data.vendor_slug;
    if (!data.href && !vendorSlug) {
        console.warn(`[WYSHKIT 2026] Missing slug for BentoCard ${data.id}. Law 11 Violation.`);
    }
    const href = data.href || (vendorSlug ? `/vendor/${vendorSlug}` : '#');

    return (
        <Link
            href={href}
            className={cn(
                "relative overflow-hidden rounded-[var(--radius-xl)] group active:scale-[0.98] transition-all duration-300 block w-full",
                isLarge ? "aspect-[16/9]" : "aspect-square"
            )}
        >
            <Card className="h-full border-none shadow-none bg-[var(--surface-muted)]">
                {data.image_url || data.images?.[0] ? (
                    <Image
                        src={data.image_url || data.images[0]}
                        alt={data.title || data.name}
                        fill
                        priority={priority}
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes={isLarge ? "(max-width: 768px) 100vw, 800px" : "(max-width: 768px) 50vw, 400px"}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-[var(--surface-muted)]">
                        <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                            {data.type || 'Promo'}
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[var(--foreground)]/40 via-[var(--foreground)]/10 to-transparent p-4 flex flex-col justify-end">
                    <h3 className={cn(
                        "font-bold text-[var(--text-inverse)] tracking-tight leading-tight",
                        isLarge ? "text-lg" : "text-sm"
                    )}>
                        {data.title || data.name}
                    </h3>
                    {data.subtitle && (
                        <p className="text-xs font-medium text-[var(--text-inverse)]/80 line-clamp-1">
                            {data.subtitle}
                        </p>
                    )}
                </div>
            </Card>
        </Link>
    );
}
