'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Star, Clock, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/pricing';
import { AddToCartButton } from '@/components/customer/AddToCartButton';
import { hasItemPersonalization } from '@/lib/utils/personalization';
import { Tables } from '@/lib/supabase/database.types';

export type EntityItem = (Tables<'v_item_listings_search'> | Tables<'v_trending_items'> | Tables<'v_item_listings'>) & {
    price?: number | null;
    partner_name?: string | null;
    partners?: { id: string; name: string; display_name?: string } | null;
    variants?: any[];
    image_url?: string | null;
    elite_signals?: any;
    stock_quantity?: number | null;
};

export type EntityPartner = (Tables<'v_partner_listings'> | Tables<'v_partners_detailed'>) & {
    deliveryTime?: { min: number; max: number };
    elite_signals?: any;
    city?: string | null;
    image_url?: string | null;
};

export type EntityBento = {
    id: string;
    name: string;
    image_url?: string | null;
    images?: string[] | null;
    partner_name?: string | null;
    partner_id?: string | null;
    base_price?: number | null;
    price?: number | null;
    partners?: { name: string } | null;
};

/**
 * WYSHKIT 2026: The "One Thing" Card (Polymorphic Entity Surface)
 * Pattern: Elite Consolidation
 * - Merged ShadcnCard + EntityCard. One component for all entities.
 * - Contextual variants: portrait, landscape, row, compact, bento_large, bento_small.
 * - Handles data mapping for 'item', 'partner', and 'bento' types internally.
 */

export type EntityType = 'item' | 'partner' | 'bento';
export type EntityVariant = 'portrait' | 'landscape' | 'row' | 'compact' | 'bento_large' | 'bento_small';

export type EntityData = EntityItem | EntityPartner | EntityBento;

interface EntityCardProps {
    type?: EntityType;
    data?: EntityData;
    // Explicit props (can override data mapping)
    id?: string;
    name?: string;
    image?: string | null;
    subtitle?: string | null;
    href?: string;
    rating?: number | null;
    price?: number;
    mrp?: number;
    estimate?: { min: number; max: number; label?: string } | null;
    badges?: Array<{ text: string; variant?: 'default' | 'fast' | 'scarcity' | 'elite' }>;
    variant?: EntityVariant;
    priority?: boolean;
    onQuickLook?: (id: string, type: EntityType) => void;
    className?: string;
    children?: React.ReactNode;
}

const FALLBACK_IMAGE = '/images/logo.png';

export function EntityCard({
    type,
    data,
    id: explicitId,
    name: explicitName,
    image: explicitImage,
    subtitle: explicitSubtitle,
    href: explicitHref,
    rating: explicitRating,
    price: explicitPrice,
    mrp: explicitMrp,
    estimate: explicitEstimate,
    badges: explicitBadges,
    variant = 'portrait',
    priority = false,
    onQuickLook,
    className,
    children
}: EntityCardProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFromSearch = pathname === '/search' || searchParams?.get('context') === 'search';

    // 1. Data Mapping Logic (formerly in ShadcnCard)
    const resolvedProps = useMemo(() => {
        if (!type || !data) return null;

        if (type === 'item') {
            const item = data as EntityItem;
            // Handle image_url or images array
            const imageUrl = item.image_url || ((item as any).images?.[0]);
            const displayPrice = item.price || item.base_price;
            const partnerName = item.partner_name || (item as any).partners?.display_name || (item as any).partners?.name || 'Local store';
            const partnerId = item.partner_id || (item as any).partners?.id;

            let href = `/search?q=${encodeURIComponent(item.name || '')}`;
            if (partnerId) {
                href = `/partner/${partnerId}/item/${item.id}${isFromSearch ? '?context=search' : ''}`;
            }

            const eliteSignals = (item as any).elite_signals;
            const badges = (eliteSignals?.badges?.map((badge: any) => ({
                text: badge.text,
                variant: badge.variant as 'default' | 'fast' | 'scarcity' | 'elite'
            })) || []);

            if (eliteSignals?.delivery_signal) badges.push({ text: eliteSignals.delivery_signal, variant: 'fast' });
            if (eliteSignals?.urgency_signal) badges.push({ text: eliteSignals.urgency_signal, variant: 'scarcity' });

            return {
                id: item.id || '',
                name: item.name || 'Untitled',
                subtitle: partnerName,
                image: imageUrl || null,
                href,
                rating: item.rating,
                price: displayPrice || 0,
                mrp: item.mrp || 0,
                estimate: eliteSignals?.estimate,
                badges,
                partnerId: partnerId || '',
                isPersonalizable: hasItemPersonalization(item),
                hasVariants: ((item as any).variants?.length ?? 0) > 0,
                stockQuantity: item.stock_quantity || 0
            };
        }

        if (type === 'partner') {
            const partner = data as EntityPartner;
            const eliteSignals = partner.elite_signals as any;

            return {
                id: partner.id || '',
                name: partner.name || 'Untitled',
                subtitle: eliteSignals?.city_short || partner.city || 'Local Store',
                image: partner.image_url || null,
                href: `/partner/${partner.id}`,
                rating: partner.rating,
                estimate: eliteSignals?.estimate || partner.deliveryTime,
                badges: [] as Array<{ text: string; variant?: 'default' | 'fast' | 'scarcity' | 'elite' }>,
                partnerId: partner.id || '',
                isPersonalizable: false,
                hasVariants: false,
                stockQuantity: 0
            };
        }

        if (type === 'bento') {
            const item = data as EntityBento;
            const partnerName = item.partner_name || item.partners?.name || 'Local store';
            let href = `/search?q=${encodeURIComponent(item.name || '')}`;
            if (item.partner_id) href = `/partner/${item.partner_id}/item/${item.id}`;

            return {
                id: item.id,
                name: item.name,
                subtitle: partnerName,
                image: item.image_url || item.images?.[0] || null,
                href,
                price: item.base_price || item.price || 0,
                badges: [] as Array<{ text: string; variant?: 'default' | 'fast' | 'scarcity' | 'elite' }>,
                partnerId: item.partner_id || '',
                rating: 0,
                mrp: 0,
                estimate: null,
                isPersonalizable: false,
                hasVariants: false,
                stockQuantity: 0
            };
        }

        return null;
    }, [type, data, isFromSearch]);

    // 2. Props Merge
    const id = explicitId || resolvedProps?.id;
    const name = explicitName || resolvedProps?.name || 'Untitled';
    const image = explicitImage || resolvedProps?.image;
    const subtitle = explicitSubtitle || resolvedProps?.subtitle;
    const href = explicitHref || resolvedProps?.href || '#';
    const rating = explicitRating !== undefined ? explicitRating : resolvedProps?.rating;
    const price = explicitPrice !== undefined ? explicitPrice : resolvedProps?.price;
    const mrp = explicitMrp !== undefined ? explicitMrp : resolvedProps?.mrp;
    const estimate = explicitEstimate || resolvedProps?.estimate;
    const badges = explicitBadges || resolvedProps?.badges || [];

    const isBento = variant.startsWith('bento');
    const isLargeBento = variant === 'bento_large';

    // 3. Bento Rendering Branch
    if (isBento) {
        return (
            <Link
                href={href}
                className={cn(
                    "relative overflow-hidden rounded-2xl group cursor-pointer border border-zinc-100 bg-zinc-50 shadow-sm",
                    isLargeBento ? "col-span-2 h-[160px]" : "h-[140px]",
                    className
                )}
            >
                <Image
                    src={image || FALLBACK_IMAGE}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes={isLargeBento ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 33vw'}
                    priority={isLargeBento || priority}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <div className="space-y-1">
                        {subtitle && (
                            <div className="flex items-center gap-1.5 overflow-hidden">
                                <span className="text-xs font-bold text-white/80 tracking-wider truncate">
                                    {subtitle}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-[15px] font-bold text-white tracking-tight leading-tight line-clamp-1 flex-1">{name}</h3>
                            {price && <span className="text-sm font-black text-white shrink-0">{formatCurrency(price)}</span>}
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-[0.07] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Sparkles className="size-48 text-[var(--primary)] rotate-12" />
                </div>
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded-lg flex items-center gap-1.5 shadow-sm">
                    <TrendingUp className="size-3 text-[var(--primary)]" />
                    <span className="text-xs font-bold text-zinc-900">Trending</span>
                </div>
            </Link>
        );
    }

    // 4. Standard Entity Rendering
    const isPortrait = variant === 'portrait';
    const isLandscape = variant === 'landscape';
    const isRow = variant === 'row';
    const isCompact = variant === 'compact';

    const handleClick = (e: React.MouseEvent) => {
        if (onQuickLook && type && id) {
            e.preventDefault();
            onQuickLook(id, type);
        }
    };

    return (
        <div
            className="block w-full"
            onClick={handleClick}
        >
            <div className={cn(
                "group relative w-full transition-all duration-300 ease-out",
                "hover:scale-[1.01] active:scale-[0.99]",
                isRow ? "flex items-center gap-4" : "flex flex-col",
                className
            )}>
                {/* Image Container */}
                <div className={cn(
                    "relative overflow-hidden bg-zinc-100 rounded-2xl border border-zinc-100/50",
                    isPortrait && "aspect-[4/5]",
                    isLandscape && "aspect-[16/9]",
                    isRow && "size-20 shrink-0",
                    isCompact && "size-14 shrink-0"
                )}>
                    <Image
                        src={image || FALLBACK_IMAGE}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        loading={priority ? undefined : "lazy"}
                        priority={priority}
                        sizes={isRow || isCompact ? "80px" : "(max-width: 640px) 100vw, 300px"}
                    />

                    {rating && !isRow && !isCompact && (
                        <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-emerald-600 px-1.5 py-0.5 rounded-md shadow-sm z-10">
                            <span className="text-xs font-black text-white">{rating.toFixed(1)}</span>
                            <Star className="size-2.5 fill-white text-white" />
                        </div>
                    )}

                    {(isPortrait || isLandscape) && (
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    )}
                </div>

                {/* Info Container */}
                <div className={cn(
                    "flex-1 flex flex-col min-w-0",
                    isRow || isCompact ? "py-1" : "pt-3 px-1"
                )}>
                    <div className="flex justify-between items-start gap-2 mb-0.5">
                        <div className="flex-1 min-w-0">
                            {subtitle && (
                                <p className="text-xs font-black tracking-wider text-zinc-400 truncate mb-1">
                                    {subtitle}
                                </p>
                            )}
                            <h3 className={cn(
                                "font-black tracking-tight leading-tight line-clamp-1 relative pointer-events-auto",
                                isRow || isCompact ? "text-sm text-zinc-900" : "text-[15px] text-zinc-900",
                                (isPortrait || isLandscape) && "max-md:text-white max-md:absolute max-md:bottom-3 max-md:left-3"
                            )}>
                                <Link href={href} scroll={false} className="before:absolute before:-inset-8 before:z-0 before:content-[''] hover:text-rose-600 transition-colors">
                                    {name}
                                </Link>
                            </h3>
                        </div>
                        {price !== undefined && (
                            <div className="flex flex-col items-end shrink-0">
                                <span className="text-sm font-black text-zinc-900 tabular-nums">
                                    {formatCurrency(price)}
                                </span>
                                {mrp && mrp > price && (
                                    <span className="text-[11px] text-zinc-400 line-through decoration-zinc-300">
                                        {formatCurrency(mrp)}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                        {estimate && (
                            <div className="flex items-center gap-1 text-xs font-bold text-zinc-400">
                                <Clock className="size-3" />
                                <span>{estimate.min}-{estimate.max}m</span>
                            </div>
                        )}
                        {rating && (isRow || isCompact) && (
                            <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded border border-emerald-100">
                                <span className="text-xs font-black">{rating.toFixed(1)}</span>
                                <Star className="size-2 fill-emerald-600 text-emerald-600" />
                            </div>
                        )}

                        <div className="flex gap-1.5 flex-wrap">
                            {badges.map((badge: { text: string; variant?: 'default' | 'fast' | 'scarcity' | 'elite' }, i: number) => (
                                <span
                                    key={i}
                                    className={cn(
                                        "text-[11px] font-black tracking-tight px-1.5 py-0.5 rounded border shadow-sm",
                                        badge.variant === 'fast' ? "bg-orange-50 text-orange-600 border-orange-100" :
                                            badge.variant === 'scarcity' ? "bg-red-50 text-red-600 border-red-100" :
                                                badge.variant === 'elite' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                                    "bg-zinc-50 text-zinc-500 border-zinc-100"
                                    )}
                                >
                                    {badge.text}
                                </span>
                            ))}
                        </div>
                    </div>

                    {children}
                </div>

                {/* Action Rendering (only for items) */}
                {type === 'item' && resolvedProps && !isCompact && (
                    <div className="absolute bottom-0 right-0 z-20 p-1" onClick={e => { e.preventDefault(); e.stopPropagation(); }} onMouseDown={e => e.stopPropagation()}>
                        <AddToCartButton
                            item_id={resolvedProps.id}
                            item_name={resolvedProps.name}
                            item_image={resolvedProps.image}
                            unit_price={resolvedProps.price}
                            partner_id={resolvedProps.partnerId}
                            partner_name={resolvedProps.subtitle || ''}
                            is_identity_available={resolvedProps.isPersonalizable}
                            has_variants={resolvedProps.hasVariants}
                            stock_quantity={resolvedProps.stockQuantity}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

