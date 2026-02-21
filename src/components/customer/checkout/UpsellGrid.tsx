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
  items: UpsellItem[];
  title?: string;
  onAdd?: (item: UpsellItem) => Promise<void> | void;
}

export const UpsellGrid: React.FC<UpsellGridProps> = ({
  items,
  title = "Pairs well with",
  onAdd
}) => {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  if (!items || items.length === 0) return null;

  const handleAdd = async (item: UpsellItem) => {
    if (addingId || addedIds.has(item.id)) return;

    setAddingId(item.id);
    try {
      await onAdd?.(item);
      setAddedIds(prev => new Set(prev).add(item.id));
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="py-4 space-y-3">
      <h3 className="px-4 text-sm font-semibold text-zinc-900">
        {title}
      </h3>
      <ScrollArea className="w-full">
        <div className="flex gap-3 px-4 pb-4">
          {items.map((item) => {
            const isAdding = addingId === item.id;
            const isAdded = addedIds.has(item.id);

            return (
              <div key={item.id} className="shrink-0 w-[140px] flex flex-col gap-2">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100">
                  <Image
                    src={item.image_url || '/images/logo.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                  <button
                    onClick={() => handleAdd(item)}
                    disabled={isAdding || isAdded}
                    className={cn(
                      "absolute bottom-2 right-2 size-9 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all",
                      isAdded
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-zinc-900 hover:bg-zinc-50"
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
                  <p className="text-[13px] font-semibold text-zinc-900 truncate leading-tight">
                    {item.name}
                  </p>
                  <p className="text-xs font-bold text-zinc-500">
                    ₹{item.price}
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
