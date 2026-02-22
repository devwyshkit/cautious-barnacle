'use client';

import React, { useState } from 'react';
import { Star, Clock, MapPin, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MappedPartner } from '@/lib/types/partner';
import type { ItemListItem } from '@/lib/types/item';

/** Store page items: partial item shape from getPartnerStoreData select */
type StorePageItem = Pick<ItemListItem, 'id' | 'name' | 'base_price' | 'images' | 'category' | 'partner_id' | 'has_personalization' | 'approval_status'> & Partial<ItemListItem> & { variants?: Array<{ id: string; name: string | null; price: number | null; stock_quantity: number | null }> };
import { EntityCard } from '@/components/ui/EntityCard';
import { ContextualGrid } from '@/components/customer/ContextualGrid';
import { ShareButton } from '@/components/ui/ShareButton';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useMemo } from 'react';
import { InterceptedItemSheet } from '@/components/customer/item/InterceptedItemSheet';
import { formatPrepTime, formatDeliveryTime } from '@/lib/utils/sla';
import { useCartValidation } from '@/hooks/useCartValidation';
import { useRealtime } from '@/providers/RealtimeProvider';
import { createClient } from '@/lib/supabase/client';
import { AlertCircle } from 'lucide-react';

const FALLBACK_IMAGE = '/images/logo.png';

interface PartnerStorePageProps {
  partnerId: string;
  initialData?: MappedPartner;
  initialItems?: any[]; // Relaxed for flexible data shapes in Swiggy 2026 Shift
}

export function PartnerStorePage({ partnerId, initialData, initialItems }: PartnerStorePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();


  // WYSHKIT 2026: Server-First - Data comes entirely from props
  const partner = initialData!;

  // WYSHKIT 2026: Real-time Item Synchronization
  const [items, setItems] = useState<any[]>(initialItems || []);
  const supabase = useMemo(() => createClient(), []);
  const { channel } = useRealtime();

  useEffect(() => {
    if (!channel) return;

    // Pulse: Subscribe to public item changes for this partner
    const itemsChannel = supabase
      .channel(`partner-inventory-${partnerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `partner_id=eq.${partnerId}`
        },
        async (payload) => {
          if (payload.eventType === 'UPDATE') {
            setItems(current =>
              current.map(item => item.id === payload.new.id ? { ...item, ...payload.new } : item)
            );
          } else if (payload.eventType === 'INSERT') {
            setItems(current => [...current, payload.new]);
          } else if (payload.eventType === 'DELETE') {
            setItems(current => current.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(itemsChannel);
    };
  }, [partnerId, channel, supabase]);

  // WYSHKIT 2026: Zero Reflection - Filter out-of-stock items
  const allItems = React.useMemo(() => {
    return items.filter(item =>
      item.stock_status !== 'out_of_stock' &&
      (typeof item.stock_quantity !== 'number' || item.stock_quantity > 0)
    );
  }, [items]);

  // WYSHKIT 2026: Proactive Cart Validation
  const { isMismatch } = useCartValidation(partnerId);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');

  // Categories extraction
  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(allItems.map(i => i.category)))
      .filter((c): c is string => Boolean(c));
    return ['Recommended', ...cats];
  }, [allItems]);

  // Filtered items
  const displayItems = React.useMemo(() => {
    if (selectedCategory === 'Recommended') return allItems;
    return allItems.filter(i => i.category === selectedCategory);
  }, [allItems, selectedCategory]);


  const displayName = partner?.name || 'Partner';
  const displayImage = partner?.image_url || FALLBACK_IMAGE;
  const displayRating = partner?.rating;
  const displayCity = partner?.city || 'Local Partner';
  const displayPrepHours = partner?.prep_hours || 0.75;
  const prepTimeText = formatPrepTime(displayPrepHours);
  const displayDeliveryFee = partner?.delivery_fee ?? 0;
  const displayDescription = partner?.description || 'Discover quality items from this local partner.';

  if (!initialData || !initialItems) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center bg-background">
        <p className="text-sm font-medium text-zinc-900">Partner data not available</p>
        <p className="text-xs text-zinc-500 mt-1">Try again in a moment</p>
        <Button onClick={() => router.refresh()} variant="link" className="text-xs mt-2">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 min-h-screen bg-white">
      {/* Header Banner */}
      <div className="relative aspect-[2.5/1] md:aspect-[4/1] w-full bg-zinc-100">
        <Image
          src={displayImage}
          alt={displayName}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            (e.target as any).src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-20 size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 active:scale-95 transition-all"
        >
          <ArrowLeft className="size-5" />
        </button>
      </div>

      {/* Partner Info Card */}
      <div className="px-4 -mt-10 relative z-10 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-[28px] p-5 shadow-[0_12px_44px_-8px_rgba(0,0,0,0.12)] border border-zinc-100/80 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-zinc-950 leading-tight tracking-tight line-clamp-2">
                {displayName}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-zinc-500">
                <div className="flex items-center gap-1">
                  <MapPin className="size-3 text-zinc-400" />
                  <span className="truncate">{displayCity}</span>
                </div>
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-400 text-[9px]">Local Partner</span>
              </div>
            </div>
            <div className="flex items-start gap-2 shrink-0">
              <ShareButton
                title={displayName}
                url={`/partner/${partnerId}`}
                className="bg-zinc-50 size-8 rounded-xl flex items-center justify-center text-zinc-900 hover:bg-zinc-100 transition-all border border-zinc-100 shadow-none"
              />
              {displayRating && (
                <div className="flex flex-col items-center bg-zinc-950 px-2 py-1 rounded-xl shadow-lg min-w-[44px]">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[12px] font-bold text-white leading-none">{displayRating.toFixed(1)}</span>
                    <Star className="size-2.5 fill-white text-white" />
                  </div>
                  <span className="text-[7px] font-bold text-zinc-500 mt-0.5">Rating</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-50">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 bg-zinc-50/50 px-2 py-1 rounded-lg border border-zinc-100">
              <Clock className="size-3 text-emerald-600" />
              <span>{prepTimeText} delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* WYSHKIT 2026: Proactive Mismatch Nudge */}
      {isMismatch && (
        <div className="px-4 mt-4 max-w-[1200px] mx-auto animate-in slide-in-from-top duration-500">
          <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="size-3.5 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-950">Cart at another store</p>
                <p className="text-[9px] font-medium text-amber-800/70 leading-tight">Adding items will replace current cart.</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/checkout')}
              className="rounded-lg h-7 text-[9px] font-bold border-amber-200 bg-white text-amber-900 hover:bg-amber-100"
            >
              View Cart
            </Button>
          </div>
        </div>
      )}

      {/* TWO-LAYER BROWSE AREA */}
      <div className="flex flex-col md:flex-row max-w-[1440px] mx-auto min-h-[70vh] relative pt-8">
        {/* WYSHKIT 2026: Sticky Sidebar Browse Pattern */}
        {/* Mobile: Horizontal Pill Rail (top-sticky), Desktop: Vertical Strip (left-sticky) */}
        <aside className="md:w-24 md:border-r border-zinc-100 flex md:flex-col gap-3 py-3 px-4 md:px-0 shrink-0 bg-white md:sticky md:top-14 md:h-[calc(100vh-56px)] overflow-x-auto md:overflow-y-auto no-scrollbar md:overscroll-contain z-20 top-0 sticky border-b md:border-b-0">
          <div className="flex md:flex-col gap-3 md:gap-5 min-w-max md:min-w-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex md:flex-col items-center gap-1.5 px-0.5 group outline-none"
              >
                <div className={cn(
                  "size-10 md:size-14 rounded-2xl bg-zinc-50 group-hover:bg-zinc-100 transition-all flex items-center justify-center border border-zinc-100 group-active:scale-90",
                  selectedCategory === cat && "bg-zinc-950 border-zinc-950 shadow-sm"
                )}>
                  <span className={cn(
                    "text-[9px] md:text-[10px] font-bold text-zinc-400",
                    selectedCategory === cat && "text-white"
                  )}>
                    {cat.slice(0, 3)}
                  </span>
                </div>
                <span className={cn(
                  "text-[9px] md:text-[10px] font-bold text-center leading-none transition-colors",
                  selectedCategory === cat ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-600"
                )}>
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Product Grid Area */}
        <div id="menu-items" className="flex-1 px-4 md:px-8 py-4 md:py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-zinc-950 tracking-tight leading-none">
                {selectedCategory === 'Recommended' ? 'Recommended' : selectedCategory}
              </h2>
              <p className="text-[9px] font-bold text-zinc-400 mt-1.5">
                {selectedCategory === 'Recommended' ? 'Curated from this store' : `${displayItems.length} items available`}
              </p>
            </div>


          </div>

          {displayItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
              {displayItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <EntityCard
                    key={item.id}
                    type="item"
                    data={{ ...item, partner_id: item.partner_id || partnerId }}
                    priority={index < 8}
                    className="hover:-translate-y-2 transition-transform duration-500 ease-out"
                  />
                </div>
              ))}
            </div>

          ) : (
            <div className="py-24 text-center bg-zinc-50/50 rounded-[40px] border border-dashed border-zinc-200/60 flex flex-col items-center justify-center">
              <div className="size-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                <span className="text-2xl grayscale opacity-50">🚚</span>
              </div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No products currently available</p>
              <Button onClick={() => router.back()} variant="link" className="mt-4 text-xs font-bold text-zinc-900">Check other stores</Button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Sheet / Floating Cart - Should be handled globally, but ensuring padding */}
      <div className="h-24 md:h-12" />

    </div>
  );
}
