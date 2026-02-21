'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package, MoreVertical, Pencil, Trash2, Layers, Sparkles, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Database } from '@/lib/supabase/database.types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { update_variant_stock } from '@/lib/actions/partner-actions';
import { toast } from 'sonner';

type Variant = {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
};

type Item = Database['public']['Tables']['items']['Row'] & {
  variants_count?: number;
  total_stock?: number;
  personalization_count?: number;
  variants?: Variant[];
};

interface CatalogListProps {
  items: Item[];
  onToggleActive: (itemId: string, isActive: boolean) => void;
  onToggleStock: (itemId: string, stockStatus: string) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

export function CatalogList({
  items,
  onToggleActive,
  onToggleStock,
  onEdit,
  onDelete,
}: CatalogListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isLowStock = item.total_stock !== undefined && item.total_stock > 0 && item.total_stock < 5;
        const isOutOfStock = item.stock_status === 'out_of_stock' || (item.total_stock !== undefined && item.total_stock === 0);

        return (
          <div
            key={item.id}
            className={cn(
              "bg-white border border-zinc-100 rounded-xl p-3 transition-all",
              !item.is_active && "opacity-60"
            )}
          >
            <div className="flex gap-3">
              <div
                className="relative size-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0 cursor-pointer"
                onClick={() => onEdit?.(item)}
              >
                {item.images?.[0] ? (
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <Package className="size-6 text-zinc-300" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="min-w-0 cursor-pointer flex-1"
                    onClick={() => onEdit?.(item)}
                  >
                    <h3 className="text-sm font-medium text-zinc-900 truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-zinc-500">{item.category || 'Uncategorized'}</span>
                      {item.variants_count && item.variants_count > 0 && (
                        <>
                          <span className="text-zinc-300">·</span>
                          <span className="text-xs text-zinc-500 flex items-center gap-0.5">
                            <Layers className="size-3" />
                            {item.variants_count} variants
                          </span>
                        </>
                      )}
                      {item.has_personalization && (
                        <>
                          <span className="text-zinc-300">·</span>
                          <span className="text-xs text-amber-600 flex items-center gap-0.5">
                            <Sparkles className="size-3" />
                            Personalizable
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-7 shrink-0">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Pencil className="size-4 mr-2" />
                          Edit item
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onToggleStock(
                          item.id,
                          item.stock_status === 'in_stock' ? 'out_of_stock' : 'in_stock'
                        )}
                      >
                        {item.stock_status === 'in_stock' ? 'Mark out of stock' : 'Mark in stock'}
                      </DropdownMenuItem>
                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(item)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="size-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Variant stock levels (WYSHKIT 2026: Fast Refill) */}
                {item.variants && item.variants.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
                    {item.variants.map((v) => (
                      <VariantStockItem
                        key={v.id}
                        variant={v}
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-semibold text-zinc-900">
                        ₹{Number(item.base_price).toLocaleString('en-IN')}
                      </span>
                      {item.mrp && Number(item.mrp) > Number(item.base_price) && (
                        <span className="text-xs text-zinc-400 line-through">
                          ₹{Number(item.mrp).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {isOutOfStock ? (
                      <Badge
                        variant="outline"
                        className="text-xs h-5 bg-red-50 text-red-600 border-red-200"
                      >
                        Out of stock
                      </Badge>
                    ) : isLowStock ? (
                      <Badge
                        variant="outline"
                        className="text-xs h-5 bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1"
                      >
                        <AlertCircle className="size-3" />
                        {item.total_stock} left
                      </Badge>
                    ) : item.total_stock !== undefined && item.total_stock > 0 ? (
                      <span className="text-xs text-zinc-400">
                        {item.total_stock} in stock
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400">Manage stock in variants</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-zinc-400">Active</span>
                    <Switch
                      checked={item.is_active ?? false}
                      onCheckedChange={(checked) => onToggleActive(item.id, checked)}
                      className="scale-90"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VariantStockItem({ variant }: { variant: Variant }) {
  const [qty, setQty] = useState(variant.stock_quantity);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (qty === variant.stock_quantity) return;
    setUpdating(true);
    const res = await update_variant_stock(variant.id, qty);
    if (res.success) {
      toast.success(`Updated ${variant.name} stock`);
    } else {
      toast.error('Failed to update stock');
      setQty(variant.stock_quantity);
    }
    setUpdating(false);
  };

  return (
    <div className="flex items-center justify-between gap-2 p-2 bg-zinc-50/50 rounded-lg border border-zinc-100">
      <span className="text-xs font-medium text-zinc-600 truncate flex-1">{variant.name || 'Base'}</span>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          onBlur={handleUpdate}
          className="h-7 w-14 text-xs px-1 text-center bg-white"
          disabled={updating}
        />
        <span className="text-[10px] text-zinc-400 uppercase font-bold">QTY</span>
      </div>
    </div>
  );
}
