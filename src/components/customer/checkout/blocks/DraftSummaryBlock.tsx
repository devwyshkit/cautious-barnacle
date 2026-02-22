'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldAlert, Plus, Minus, Trash2, Edit3 } from 'lucide-react';
import type { DraftLineItem } from '@/lib/types/personalization';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

import { formatCurrency } from '@/lib/utils/pricing';

const FALLBACK_IMAGE = '/images/logo.png';

interface DraftSummaryBlockProps {
  items: DraftLineItem[];
  onUpdateQuantity?: (itemId: string, variantId: string | null, quantity: number) => void;
  onRemoveItem?: (itemId: string, variantId: string | null) => void;
  editable?: boolean;
}

/**
 * WYSHKIT 2026: Estimate download in Bill Summary accordion
 */
export function DraftSummaryBlock({ items, onUpdateQuantity, onRemoveItem, editable = true }: DraftSummaryBlockProps) {
  const router = useRouter();
  if (items.length === 0) return null;

  const handleQuantityChange = (itemId: string, variantId: string | null, currentQty: number, delta: number) => {
    triggerHaptic(HapticPattern.ACTION);
    const newQty = Math.max(0, currentQty + delta);
    if (newQty === 0) {
      onRemoveItem?.(itemId, variantId);
    } else {
      onUpdateQuantity?.(itemId, variantId, newQty);
    }
  };

  const hasPersonalized = items.some((item) => item.personalization?.enabled);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-2 border-[var(--primary)] pl-2">Your order</label>
        <span className="text-[11px] font-bold text-zinc-500 tabular-nums">{items.length} item{items.length > 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-1.5">
        {items.map((item) => {
          const totalPrice = item.total_price;
          const unitPrice = item.unit_price;

          return (
            <div key={`${item.item_id}-${item.selected_variant_id}`} className="flex gap-2.5 p-2 bg-zinc-50/50 rounded-lg">
              <div className="relative size-14 bg-white rounded-lg overflow-hidden shrink-0 border border-zinc-100">
                <Image
                  src={item.item_image || FALLBACK_IMAGE}
                  alt={item.item_name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-medium text-zinc-900 truncate leading-tight">
                      {item.item_name}
                    </h4>
                    {item.variant_name && (
                      <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{item.variant_name}</p>
                    )}
                  </div>
                  <span className="text-[13px] font-semibold text-zinc-900 tabular-nums shrink-0">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-1">
                  {formatCurrency(unitPrice)} <span className="text-zinc-400 lowercase">each</span>

                  {editable && onUpdateQuantity && onRemoveItem ? (
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleQuantityChange(item.item_id, item.selected_variant_id, item.quantity, -1)}
                        className={cn(
                          "size-6 flex items-center justify-center rounded-md transition-colors",
                          item.quantity === 1
                            ? "bg-amber-50 text-[var(--primary)] hover:bg-amber-100"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        )}
                      >
                        {item.quantity === 1 ? <Trash2 className="size-3" /> : <Minus className="size-3" />}
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-zinc-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.item_id, item.selected_variant_id, item.quantity, 1)}
                        className="size-6 flex items-center justify-center rounded-md bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-zinc-950 uppercase tracking-tighter">
                      Qty: {item.quantity}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {item.personalization?.enabled ? (
                      <div className="flex items-center gap-1 text-[9px] font-medium text-amber-600">
                        <ShieldAlert className="size-2.5" />
                        <span>Personalized</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[9px] font-black text-zinc-400 uppercase tracking-tighter">
                        <span>Standard Item</span>
                      </div>
                    )}
                  </div>
                  {editable && (
                    <button
                      onClick={() => {
                        const partnerId = item.partner_id || '';
                        const addonIds = (item.selected_addons || []).map((a: any) => a.id).join(',');
                        router.push(`/partner/${partnerId}/item/${item.item_id}?edit=true&cartItemId=${item.id}&variantId=${item.selected_variant_id || ''}&quantity=${item.quantity}&addons=${addonIds}`);
                      }}
                      className="text-[9px] font-bold text-[var(--primary)] flex items-center gap-0.5 hover:underline"
                    >
                      <Edit3 className="size-2.5" />
                      Edit Item
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasPersonalized && (
        <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-100/50 flex items-start gap-2">
          <ShieldAlert className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] font-medium text-amber-800 leading-normal">
            Personalized items are non-returnable. Refunds only for damaged goods.
          </p>
        </div>
      )}
    </div>
  );
}
