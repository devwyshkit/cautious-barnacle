'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldAlert, Plus, Minus, Trash2, Edit3 } from 'lucide-react';
import type { CartProduct } from '@/lib/types/personalization';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

import { formatCurrency } from '@/lib/utils/pricing';

const FALLBACK_IMAGE = '/images/logo.png';

interface DraftSummaryBlockProps {
  products: CartProduct[];
  onUpdateQuantity?: (productId: string, variantId: string | null, quantity: number) => void;
  onRemoveItem?: (productId: string, variantId: string | null) => void;
  editable?: boolean;
}

/**
 * WYSHKIT 2026: Estimate download in Bill Summary accordion
 */
export function DraftSummaryBlock({ products, onUpdateQuantity, onRemoveItem, editable = true }: DraftSummaryBlockProps) {
  const router = useRouter();
  if (products.length === 0) return null;

  const handleQuantityChange = (productId: string, variantId: string | null, currentQty: number, delta: number) => {
    triggerHaptic(HapticPattern.ACTION);
    const newQty = Math.max(0, currentQty + delta);
    if (newQty === 0) {
      onRemoveItem?.(productId, variantId);
    } else {
      onUpdateQuantity?.(productId, variantId, newQty);
    }
  };

  const hasPersonalized = products.some((product) => product.personalization?.enabled);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold tracking-tight text-[var(--text-primary)] border-l-2 border-[var(--primary)] pl-2">Your order</label>
        <span className="text-xs font-bold text-[var(--text-secondary)] tabular-nums">{products.length} product{products.length > 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-1.5">
        {products.map((product) => {
          const totalPrice = product.line_total;
          const unitPrice = product.unit_price;

          return (
            <div key={product.id} className="flex gap-2.5 p-2 bg-[var(--surface-muted)]/50 rounded-lg">
              <div className="relative size-14 bg-[var(--surface)] rounded-lg overflow-hidden shrink-0 border border-[var(--border)]">
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
                    <h4 className="text-sm font-medium text-[var(--text-primary)] truncate leading-tight">
                      {product.product_name}
                    </h4>
                    {product.variant_name && (
                      <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">{product.variant_name}</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums shrink-0">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-1">
                  {formatCurrency(unitPrice)} <span className="text-[var(--text-tertiary)] lowercase">each</span>

                  {editable && onUpdateQuantity && onRemoveItem ? (
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleQuantityChange(product.product_id || '', product.variant_id ?? null, product.quantity, -1)}
                        className={cn(
                          "size-6 flex items-center justify-center rounded-md transition-colors",
                          product.quantity === 1
                            ? "bg-[var(--well-warning)] text-[var(--primary)] hover:bg-[var(--warning)]/10"
                            : "bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                        )}
                      >
                        {product.quantity === 1 ? <Trash2 className="size-3" /> : <Minus className="size-3" />}
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-[var(--text-primary)] tabular-nums">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product.product_id || '', product.variant_id ?? null, product.quantity, 1)}
                        className="size-6 flex items-center justify-center rounded-md bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-[var(--text-primary)] tracking-tighter">
                      Qty: {product.quantity}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {product.personalization?.enabled ? (
                      <div className="flex items-center gap-1 text-xs font-medium text-[var(--warning)]">
                        <ShieldAlert className="size-2.5" />
                        <span>Personalized</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-bold text-[var(--text-tertiary)] tracking-tighter">
                        <span>Standard Product</span>
                      </div>
                    )}
                  </div>
                  {editable && (
                    <button
                      onClick={() => {
                        const vendorId = product.vendor_id || '';
                        const addonIds = (product.selected_addons || []).map((a: any) => a.id).join(',');
                        router.push(`/vendor/${vendorId}/product/${product.product_id}?edit=true&cartProductId=${product.id}&variantId=${product.variant_id || ''}&quantity=${product.quantity}&addons=${addonIds}`);
                      }}
                      className="text-xs font-bold text-[var(--primary)] flex items-center gap-0.5 hover:underline"
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
        <div className="p-2 rounded-lg bg-[var(--well-warning)]/50 border border-[var(--warning)]/20 flex items-start gap-2">
          <ShieldAlert className="size-3.5 text-[var(--warning)] shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-[var(--text-primary)] leading-normal">
            Personalized products are non-returnable. Refunds only for damaged goods.
          </p>
        </div>
      )}
    </div>
  );
}
