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
  products: DraftLineItem[];
  onUpdateQuantity?: (itemId: string, variantId: string | null, quantity: number) => void;
  onRemoveItem?: (itemId: string, variantId: string | null) => void;
  editable?: boolean;
}

/**
 * WYSHKIT 2026: Estimate download in Bill Summary accordion
 */
export function DraftSummaryBlock({ products, onUpdateQuantity, onRemoveItem, editable = true }: DraftSummaryBlockProps) {
  const router = useRouter();
  if (products.length === 0) return null;

  const handleQuantityChange = (itemId: string, variantId: string | null, currentQty: number, delta: number) => {
    triggerHaptic(HapticPattern.ACTION);
    const newQty = Math.max(0, currentQty + delta);
    if (newQty === 0) {
      onRemoveItem?.(itemId, variantId);
    } else {
      onUpdateQuantity?.(itemId, variantId, newQty);
    }
  };

  const hasPersonalized = products.some((product) => product.personalization?.enabled);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black tracking-tight text-zinc-900 border-l-2 border-[var(--primary)] pl-2">Your order</label>
        <span className="text-[11px] font-bold text-zinc-500 tabular-nums">{products.length} product{products.length > 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-1.5">
        {products.map((product) => {
          const totalPrice = product.line_total;
          const unitPrice = product.unit_price;

          return (
            <div key={product.id} className="flex gap-2.5 p-2 bg-zinc-50/50 rounded-lg">
              <div className="relative size-14 bg-white rounded-lg overflow-hidden shrink-0 border border-zinc-100">
                <Image
                  src={product.product_image || FALLBACK_IMAGE}
                  alt={product.product_name || ''}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-medium text-zinc-900 truncate leading-tight">
                      {product.product_name}
                    </h4>
                    {product.variant_name && (
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">{product.variant_name}</p>
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
                        onClick={() => handleQuantityChange(product.product_id || '', product.variant_id ?? null, product.quantity, -1)}
                        className={cn(
                          "size-6 flex items-center justify-center rounded-md transition-colors",
                          product.quantity === 1
                            ? "bg-amber-50 text-[var(--primary)] hover:bg-amber-100"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        )}
                      >
                        {product.quantity === 1 ? <Trash2 className="size-3" /> : <Minus className="size-3" />}
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-zinc-900 tabular-nums">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product.product_id || '', product.variant_id ?? null, product.quantity, 1)}
                        className="size-6 flex items-center justify-center rounded-md bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-zinc-950 tracking-tighter">
                      Qty: {product.quantity}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {product.personalization?.enabled ? (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
                        <ShieldAlert className="size-2.5" />
                        <span>Personalized</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] font-black text-zinc-400 tracking-tighter">
                        <span>Standard Product</span>
                      </div>
                    )}
                  </div>
                  {editable && (
                    <button
                      onClick={() => {
                        const partnerId = product.vendor_id || '';
                        const addonIds = (product.selected_addons || []).map((a: any) => a.id).join(',');
                        router.push(`/store/${partnerId}/product/${product.product_id}?edit=true&cartItemId=${product.id}&variantId=${product.variant_id || ''}&quantity=${product.quantity}&addons=${addonIds}`);
                      }}
                      className="text-[11px] font-bold text-[var(--primary)] flex items-center gap-0.5 hover:underline"
                    >
                      <Edit3 className="size-2.5" />
                      Edit Product
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
          <p className="text-xs font-medium text-amber-800 leading-normal">
            Personalized products are non-returnable. Refunds only for damaged goods.
          </p>
        </div>
      )}
    </div>
  );
}
