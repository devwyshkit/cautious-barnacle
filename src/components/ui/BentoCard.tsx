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

    return (
        <Link
            href={data.href || `/store/${data.id || data.vendor_id}`}
            className={cn(
                "relative overflow-hidden rounded-2xl group active:scale-[0.98] transition-all duration-300",
                isLarge ? "col-span-2 aspect-[16/9]" : "aspect-square"
            )}
        >
            <Card className="h-full border-none shadow-none bg-zinc-100">
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
                    <div className="flex items-center justify-center h-full bg-zinc-50">
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                            {data.type || 'Promo'}
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <h3 className={cn(
                        "font-black text-white tracking-tight leading-tight",
                        isLarge ? "text-lg" : "text-sm"
                    )}>
                        {data.title || data.name}
                    </h3>
                    {data.subtitle && (
                        <p className="text-[10px] font-medium text-white/80 line-clamp-1">
                            {data.subtitle}
                        </p>
                    )}
                </div>
            </Card>
        </Link>
    );
}
