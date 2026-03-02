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
import { update_variant_stock } from '@/lib/actions/vendor/vendor-actions';
import { toast } from 'sonner';

type Variant = {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
};

type Product = Database['public']['Tables']['products']['Row'] & {
  variants_count?: number;
  total_stock?: number;
  personalization_count?: number;
  variants?: Variant[];
  category?: string;
};

interface ProductListProps {
  products: Product[];
  onToggleActive: (productId: string, isActive: boolean) => void;
  onToggleStock?: (productId: string, stockStatus: string) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductList({
  products,
  onToggleActive,
  onEdit,
  onDelete,
}: ProductListProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {products.map((product) => {
        const isLowStock = product.total_stock !== undefined && product.total_stock > 0 && product.total_stock < 5;
        const isOutOfStock = (product.total_stock !== undefined && product.total_stock === 0);

        return (
          <div
            key={product.id}
            className={cn(
              "bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-3 transition-all",
              !product.is_active && "opacity-60"
            )}
          >
            <div className="flex gap-3">
              <div
                className="relative size-16 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--surface-muted)] shrink-0 cursor-pointer"
                onClick={() => onEdit?.(product)}
              >
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <Package className="size-6 text-[var(--text-tertiary)]" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="min-w-0 cursor-pointer flex-1"
                    onClick={() => onEdit?.(product)}
                  >
                    <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-[var(--text-secondary)]">{product.category || 'Uncategorized'}</span>
                      {product.variants_count && product.variants_count > 0 && (
                        <>
                          <span className="text-[var(--text-tertiary)]">·</span>
                          <span className="text-xs text-[var(--text-secondary)] flex items-center gap-0.5">
                            <Layers className="size-3" />
                            {product.variants_count} variants
                          </span>
                        </>
                      )}
                      {product.has_personalization && (
                        <>
                          <span className="text-[var(--text-tertiary)]">·</span>
                          <span className="text-xs text-[var(--warning)] flex items-center gap-0.5">
                            <Sparkles className="size-3 text-[var(--star-rating)]" />
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
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Pencil className="size-4 mr-2" />
                          Edit product
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onToggleActive(product.id, !product.is_active)}>
                        {product.is_active ? 'Mark inactive' : 'Mark active'}
                      </DropdownMenuItem>
                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(product)}
                            className="text-[var(--destructive)] focus:text-[var(--destructive)]"
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
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
                    {product.variants.map((v) => (
                      <VariantStockItem
                        key={v.id}
                        variant={v}
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--surface-muted)]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        ₹{Number(product.base_price).toLocaleString('en-IN')}
                      </span>
                      {product.mrp && Number(product.mrp) > Number(product.base_price) && (
                        <span className="text-xs text-[var(--text-tertiary)] line-through">
                          ₹{Number(product.mrp).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {isOutOfStock ? (
                      <Badge
                        variant="outline"
                        className="text-xs h-5 bg-[var(--well-destructive)] text-[var(--well-destructive-text)] border-[var(--destructive)]/10"
                      >
                        Out of stock
                      </Badge>
                    ) : isLowStock ? (
                      <Badge
                        variant="outline"
                        className="text-xs h-5 bg-[var(--well-warning)] text-[var(--well-warning-text)] border-[var(--warning)]/10 flex items-center gap-1"
                      >
                        <AlertCircle className="size-3 text-[var(--warning)]" />
                        {product.total_stock} left
                      </Badge>
                    ) : product.total_stock !== undefined && product.total_stock > 0 ? (
                      <span className="text-xs text-[var(--text-tertiary)]">
                        {product.total_stock} in stock
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--text-tertiary)]">Manage stock in variants</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[var(--text-tertiary)]">Active</span>
                    <Switch
                      checked={product.is_active ?? false}
                      onCheckedChange={(checked) => onToggleActive(product.id, checked)}
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
    <div className="flex items-center justify-between gap-2 p-2 bg-[var(--surface-muted)]/50 rounded-[var(--radius-sm)] border border-[var(--border)]">
      <span className="text-xs font-medium text-[var(--text-secondary)] truncate flex-1">{variant.name || 'Base'}</span>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          onBlur={handleUpdate}
          className="h-7 w-14 text-xs px-1 text-center bg-[var(--surface)]"
          disabled={updating}
        />
        <span className="text-xs text-[var(--text-tertiary)] font-bold">QTY</span>
      </div>
    </div>
  );
}
