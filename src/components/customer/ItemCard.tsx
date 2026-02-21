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
  partner_id?: string;
  priority?: boolean;
}

export function ItemCard({
  item,
  className,
  variant = 'default',
  partner_id,
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
    partner_id: item_partner_id_from_item
  } = item;

  const isPersonalizable = hasItemPersonalization(item);
  const imageUrl = item.image_url || (images && images[0]) || FALLBACK_IMAGE;
  const displayPrice = item.price || base_price;
  const displayMrp = mrp || 0;
  const partnerName = partner_name || partners?.display_name || partners?.name || 'Local store';
  const item_partner_id = item_partner_id_from_item || partner_id || partners?.id;
  const stock_quantity = item.stock_quantity === null ? undefined : item.stock_quantity;
  const has_variants = (variants?.length ?? 0) > 0;

  const cartItems = draftOrder?.items || [];
  const isInCart = useMemo(() => {
    return cartItems.some((cartItem: any) => cartItem.item_id === id) || false;
  }, [cartItems, id]);

  const travelTime = useMemo(() => {
    return calculateTravelTime(item.distance_km || (item.distance_meters ? item.distance_meters / 1000 : undefined));
  }, [item.distance_km, item.distance_meters]);

  const searchParams = useSearchParams();
  const query = searchParams?.get('q');
  const isFromSearch = !!query || searchParams?.get('context') === 'search' || pathname === '/search';

  // WYSHKIT 2026: Unified Routing Pattern
  const href = item_partner_id
    ? `/partner/${item_partner_id}/item/${id}${isFromSearch ? '?context=search' : ''}`
    : `/search?q=${encodeURIComponent(name)}`;

  const deliverySignal = useMemo(() => {
    const signal = getDeliverySLASignal(item);
    if (!signal) return null;

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
              <Sparkles className="size-2.5 text-[var(--primary)]" />
              <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-tight">Personalizable</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 pt-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[15px] font-bold text-zinc-900 leading-tight tracking-tight line-clamp-2">{name}</h3>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-base font-black text-zinc-900 tabular-nums">
              {formatCurrency(displayPrice)}
            </span>
            {displayMrp > displayPrice && (
              <span className="text-[10px] text-zinc-400 line-through decoration-zinc-300/50">
                {formatCurrency(displayMrp)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-zinc-500 truncate">{partnerName}</span>
          <span className="text-[10px] text-zinc-300">•</span>
          <div className="flex items-center gap-1 text-zinc-400">
            <Clock className="size-2.5" />
            <span className="text-[10px] font-medium">
              {travelTime ? `${travelTime.min}-${travelTime.max} mins` : 'Local pickup'}
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 h-6">
          {deliverySignal && (
            <div className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-tight",
              deliverySignal.type === 'fast' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                deliverySignal.type === 'scarcity' ? "bg-orange-50 text-orange-600 border-orange-100" :
                  "bg-zinc-50 text-zinc-500 border-zinc-100"
            )}>
              {deliverySignal.icon}
              <span>{deliverySignal.text}</span>
            </div>
          )}
          {urgencySignal && (
            <div className="bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded-md flex items-center gap-1">
              <span className="text-[9px] font-black uppercase tracking-tight">{urgencySignal.text}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={cardClassName}>
      <Link
        href={href}
        className="block"
        scroll={false}
      >
        {cardContent}
      </Link>

      <div className="absolute top-[calc(100%-48px)] right-0 z-10 p-1">
        <div
          className="relative"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <AddToCartButton
            item_id={id}
            item_name={name}
            item_image={imageUrl}
            unit_price={displayPrice}
            partner_id={item_partner_id}
            partner_name={partnerName}
            is_identity_available={isPersonalizable}
            has_variants={has_variants}
            stock_quantity={stock_quantity}
          />
        </div>
      </div>
    </div>
  );
}
