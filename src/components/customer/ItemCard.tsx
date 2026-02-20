"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Star, Sparkles, Flame, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AddToCartButton } from './AddToCartButton';
import { useCart } from '@/components/customer/CartProvider';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { formatCurrency } from '@/lib/utils/pricing';
import { hasItemPersonalization } from '@/lib/utils/personalization';
import { getDeliverySLASignal, getStockSLASignal, calculateTravelTime } from '@/lib/utils/sla';

import { ItemListItem, WyshkitItem } from '@/lib/types/item';

const FALLBACK_IMAGE = '/images/logo.png';

interface ItemCardProps {
  item: WyshkitItem;
  className?: string;
  variant?: 'default' | 'compact' | 'cart';
  partnerId?: string;
  priority?: boolean;
}

export function ItemCard({
  item,
  className,
  variant = 'default',
  partnerId,
  priority = false,
}: ItemCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { draftOrder } = useCart();

  const {
    id,
    name,
    partners,
    images,
    base_price,
    variants,
    partner_name,
    mrp,
    rating,
    partner_id
  } = item;

  const isPersonalizable = hasItemPersonalization(item);
  const imageUrl = item.image_url || (images && images[0]) || FALLBACK_IMAGE;
  const displayPrice = item.price || base_price;
  const displayMrp = mrp || 0;
  const partnerName = partner_name || partners?.display_name || partners?.name || 'Local store';
  const itemPartnerId = partner_id || partnerId || partners?.id;
  const stockQuantity = item.stock_quantity === null ? undefined : item.stock_quantity;
  const hasVariants = (variants?.length ?? 0) > 0;

  const cartItems = draftOrder?.items || [];
  const isInCart = useMemo(() => {
    return cartItems.some((cartItem: any) => cartItem.itemId === id) || false;
  }, [cartItems, id]);

  const travelTime = useMemo(() => {
    return calculateTravelTime(item.distance_km || (item.distance_meters ? item.distance_meters / 1000 : undefined));
  }, [item.distance_km, item.distance_meters]);

  const searchParams = useSearchParams();
  const isFromSearch = searchParams?.get('q') || searchParams?.get('context') === 'search' || pathname === '/search';

  // WYSHKIT 2026: Unified Routing Pattern
  // Always use sub-routes for items within partners to ensure stable background context
  const href = itemPartnerId
    ? `/partner/${itemPartnerId}/item/${id}${isFromSearch ? '?context=search' : ''}`
    : `/search?q=${encodeURIComponent(name)}`;

  const deliverySignal = useMemo(() => {
    const signal = getDeliverySLASignal(item);
    if (!signal) return null;

    // Icon mapping for consistent rendering
    let icon = <Clock className="size-3 text-zinc-500" />;
    if (item.category?.toLowerCase() === 'flowers' || item.category?.toLowerCase() === 'cakes') {
      icon = <Flame className="size-3 text-orange-500" />;
    }
    const productionTime = item.production_time_minutes || 0;
    if (productionTime <= 45) {
      icon = <Sparkles className="size-3 text-emerald-500" />;
    }

    return { ...signal, icon };
  }, [item]);

  const urgencySignal = useMemo(() => getStockSLASignal(item), [item]);

  if (variant === 'cart') {
    return (
      <div className={cn("flex gap-3 p-2 bg-zinc-50 rounded-xl", className)}>
        <div className="relative size-14 bg-white rounded-lg overflow-hidden shrink-0">
          <Image src={imageUrl} alt={name} fill className="object-cover" sizes="56px" />
        </div>
        <div className="flex-1 flex flex-col min-w-0 py-0.5">
          <h3 className="text-[13px] font-semibold text-zinc-900 truncate leading-tight tracking-tight">{name}</h3>
          <p className="text-[11px] font-bold text-zinc-500 mt-0.5">{partnerName}</p>
          <div className="mt-auto">
            <span className="text-sm font-bold text-zinc-900 tabular-nums">{formatCurrency(displayPrice)}</span>
          </div>
        </div>
      </div>
    );
  }

  const cardClassName = cn(
    "flex flex-col group font-sans relative transition-all duration-300 ease-out",
    "hover:scale-[1.02] active:scale-[0.99] cursor-pointer",
    className
  );

  const cardContent = (
    <>
      <div className="relative aspect-square overflow-hidden bg-muted/30 rounded-2xl border border-border/50">
        <div className="relative size-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? undefined : "lazy"}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </div>

        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start max-w-[calc(100%-4rem)]">
          {item.is_promoted && (
            <div className="bg-white/70 backdrop-blur-md px-1.5 py-0.5 rounded-md shadow-sm border border-white/20">
              <span className="text-[11px] font-bold text-amber-600">Featured</span>
            </div>
          )}
          {rating && rating >= 4.0 && (
            <div className="flex items-center gap-0.5 bg-green-600 px-1.5 py-0.5 rounded-md shadow-sm">
              <span className="text-[11px] font-bold text-white">{rating.toFixed(1)}</span>
              <Star className="size-2.5 fill-white text-white" />
            </div>
          )}
        </div>

        {isPersonalizable && (
          <div className="absolute bottom-2 left-2 max-w-[calc(100%-4rem)] animate-in slide-in-from-left-2 duration-500">
            <div className="bg-[var(--primary)]/10 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-[var(--primary)]/20">
              <Sparkles className="size-3 text-[var(--primary)]" />
              <span className="text-[11px] font-black text-[var(--primary)] uppercase tracking-tighter">Identity Enabled</span>
            </div>
          </div>
        )}

        <div
          className="absolute bottom-2 right-2 z-10"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <AddToCartButton
            itemId={id}
            itemName={name}
            itemImage={imageUrl}
            unitPrice={displayPrice}
            partnerId={itemPartnerId}
            partnerName={partnerName}
            isIdentityAvailable={isPersonalizable}
            hasVariants={hasVariants}
            stockQuantity={stockQuantity}
          />
        </div>
      </div>

      <div className="mt-1.5 px-0.5">
        <h3 className="text-[13px] font-semibold text-zinc-900 line-clamp-2 leading-tight tracking-tight group-hover:text-zinc-600 transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <p className="text-[11px] font-black text-[var(--primary)] uppercase tracking-tight truncate leading-none">
            {partnerName || 'Local store'}
          </p>
          <div className="size-1 rounded-full bg-zinc-200" />
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">View Store</span>
        </div>

        {deliverySignal && (
          <div className="flex items-center gap-1 mt-1">
            {deliverySignal.icon}
            <span className={cn(
              "text-[11px] font-bold",
              deliverySignal.type === 'fast' ? "text-[var(--primary)]" : "text-emerald-600"
            )}>
              {deliverySignal.text}
            </span>
          </div>
        )}

        {urgencySignal && (
          <div className="flex items-center gap-1 mt-1">
            <Flame className={cn("size-3", urgencySignal.type === 'scarcity' ? "text-amber-500" : "text-emerald-500")} />
            <span className={cn(
              "text-[11px] font-bold",
              urgencySignal.type === 'scarcity' ? "text-amber-600" : "text-emerald-600"
            )}>
              {urgencySignal.text}
            </span>
          </div>
        )}

        {travelTime && (
          <div className="flex items-center gap-1.5 mt-1.5 px-0.5">
            <Clock className="size-3 text-zinc-500" />
            <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">
              {travelTime.min}-{travelTime.max} mins
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2 px-0.5 flex-wrap">
          <span className="text-sm font-black text-foreground tabular-nums tracking-tighter">{formatCurrency(displayPrice)}</span>
          {displayMrp > displayPrice && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-400 line-through font-bold">{formatCurrency(displayMrp)}</span>
              <span className="text-[11px] font-black text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-1.5 py-0.5 rounded-md">
                {Math.round(((displayMrp - displayPrice) / displayMrp) * 100)}% OFF
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const finalHref = itemPartnerId
    ? href
    : `/search?q=${encodeURIComponent(name)}`;

  return (
    <Link
      href={finalHref}
      scroll={false}
      prefetch={true}
      onClick={() => triggerHaptic(HapticPattern.ACTION)}
      className={cn("block", cardClassName)}
    >
      {cardContent}
    </Link>
  );
}
