"use client";

import React, { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Plus, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface UpsellItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface UpsellGridProps {
  products: UpsellItem[];
  title?: string;
  onAdd?: (product: UpsellItem) => Promise<void> | void;
}

export const UpsellGrid: React.FC<UpsellGridProps> = ({
  products,
  title = "Pairs well with",
  onAdd
}) => {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  if (!products || products.length === 0) return null;

  const handleAdd = async (product: UpsellItem) => {
    if (addingId || addedIds.has(product.id)) return;

    setAddingId(product.id);
    try {
      await onAdd?.(product);
      setAddedIds(prev => new Set(prev).add(product.id));
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="py-4 space-y-3">
      <h3 className="px-4 text-sm font-semibold text-[var(--text-primary)]">
        {title}
      </h3>
      <ScrollArea className="w-full">
        <div className="flex gap-3 px-4 pb-4">
          {products.map((product) => {
            const isAdding = addingId === product.id;
            const isAdded = addedIds.has(product.id);

            return (
              <div key={product.id} className="shrink-0 w-[140px] flex flex-col gap-2">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[var(--surface-muted)]">
                  <Image
                    src={product.image_url || '/images/logo.png'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                  <button
                    onClick={() => handleAdd(product)}
                    disabled={isAdding || isAdded}
                    className={cn(
                      "absolute bottom-2 right-2 size-9 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all",
                      isAdded
                        ? "bg-[var(--success)] text-[var(--text-inverse)]"
                        : "bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                    )}
                  >
                    {isAdding ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : isAdded ? (
                      <Check className="size-4" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                  </button>
                </div>
                <div className="px-0.5 space-y-0.5">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate leading-tight">
                    {product.name}
                  </p>
                  <p className="text-xs font-bold text-[var(--text-secondary)]">
                    ₹{product.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
};
