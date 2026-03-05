'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RotateCcw, ChevronRight, Sparkles, Clock, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/components/customer/CartProvider';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logging/logger';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { formatCurrency } from '@/lib/utils/pricing';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RecentOrder {
  id: string;
  order_number: string;
  products: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    image_url?: string;
    variant_id?: string;
    is_personalized?: boolean;
    is_in_stock?: boolean;
    personalization?: {
      enabled: boolean;
      option_id?: string;
    };
  }>;
  total: number;
  created_at: string;
  vendor_name?: string;
}

interface ReorderWidgetProps {
  initialOrders?: RecentOrder[];
}

/**
 * WYSHKIT 2026: Reorder Rail (Zeigarnik Effect)
 * Purely presentational. Consumes data from the One-Trip get_home_surface RPC.
 */
export function ReorderRail({ initialOrders }: ReorderWidgetProps) {
  const { user } = useAuth();
  const { addToDraftOrder, isPending } = useCart();

  const [recentOrders] = useState<RecentOrder[]>(initialOrders || []);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [personalizationChoiceOrder, setPersonalizationChoiceOrder] = useState<RecentOrder | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const formatDate = (dateStr: string) => {
    if (!mounted) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const initiateReorder = (order: RecentOrder) => {
    const personalizedProducts = order.products.filter(p => !!p.is_personalized);
    if (personalizedProducts.length > 0) {
      setPersonalizationChoiceOrder(order);
    } else {
      handleReorder(order, false);
    }
  };

  const handleReorder = async (order: RecentOrder, reusePersonalization: boolean) => {
    if (!order.products || order.products.length === 0) return;

    // WYSHKIT 2026: Momentum Haptic
    triggerHaptic(HapticPattern.ACTION);

    setReorderingId(order.id);
    setPersonalizationChoiceOrder(null);

    try {
      for (const product of order.products) {
        const result = await addToDraftOrder(
          product.product_id,
          product.variant_id || null,
          reusePersonalization && product.personalization
            ? product.personalization
            : { enabled: !!product.is_personalized },
          [],
          product.quantity,
          {
            product_name: product.product_name,
            product_image: product.image_url,
            unit_price: 0,
            vendor_name: order.vendor_name,
          }
        );

        if (result?.error) {
          if (result.code === 'OUT_OF_STOCK') {
            toast.error(result.error);
            return;
          }
          if (result.code !== 'VENDOR_MISMATCH') {
            toast.error(result.error || 'Failed to add some products');
            return;
          }
          return;
        }
      }
      toast.success('Products added to cart!');
    } catch (error) {
      logger.error('Reorder failed', error as Error);
      toast.error('Failed to add products');
    } finally {
      setReorderingId(null);
    }
  };

  if (!user || recentOrders.length === 0) return null;

  return (
    <>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {recentOrders.map((order, index) => {
          const firstProduct = order.products?.[0];
          const productCount = order.products?.length || 0;
          const isReordering = reorderingId === order.id;
          const hasPersonalization = order.products?.some(p => !!p.is_personalized);
          const isOrderAvailable = order.products?.every(product => product.is_in_stock !== false);

          return (
            <button
              key={order.id}
              onClick={() => initiateReorder(order)}
              disabled={isPending || isReordering || !isOrderAvailable}
              className={cn(
                "shrink-0 w-[170px] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)]",
                "transition-all duration-300 text-left p-2.5 overflow-hidden",
                "active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed",
                !isOrderAvailable && "grayscale",
                "group animate-in fade-in slide-in-from-bottom-2",
                `[animation-delay:${index * 0.1}s]`
              )}
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="relative size-10 rounded-[var(--radius-md)] bg-[var(--surface-muted)] shrink-0 overflow-hidden border border-[var(--border)]/50">
                    {firstProduct?.image_url ? (
                      <Image
                        src={firstProduct.image_url}
                        alt={firstProduct.product_name || 'Order product'}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center">
                        <RotateCcw className="size-4 text-[var(--text-tertiary)]" />
                      </div>
                    )}
                    {hasPersonalization && (
                      <div className="absolute -top-0.5 -right-0.5 size-2.5 bg-[var(--warning)] rounded-full ring-2 ring-[var(--surface)] shadow-sm flex items-center justify-center">
                        <Sparkles className="size-1.5 text-[var(--text-inverse)]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-wider">
                      <span>{formatDate(order.created_at)}</span>
                    </div>

                    <p className="text-[11px] font-bold text-[var(--text-primary)] truncate block leading-tight mt-0.5 group-hover:text-[var(--primary)] transition-colors">
                      {order.vendor_name || 'Store'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-[var(--text-secondary)] truncate leading-tight opacity-90">
                    {firstProduct?.product_name || 'Order Details'}
                    {productCount > 1 && ` +${productCount - 1}`}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/30">
                  <span className="text-[10px] font-black text-[var(--text-primary)] tabular-nums tracking-tighter">
                    {formatCurrency(order.total)}
                  </span>

                  <div className={cn(
                    "flex items-center justify-center size-7 rounded-full transition-all",
                    isReordering
                      ? "bg-[var(--well-success)] text-[var(--success)]"
                      : !isOrderAvailable
                        ? "bg-[var(--well-destructive)] text-[var(--destructive)]"
                        : "bg-[var(--primary)] text-white shadow-brand active:scale-95"
                  )}>
                    {isReordering ? (
                      <Check className="size-3.5 stroke-[3] animate-in zoom-in" />
                    ) : !isOrderAvailable ? (
                      <AlertCircle className="size-3.5 stroke-[3]" />
                    ) : (
                      <RotateCcw className="size-3.5 stroke-[3]" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* WYSHKIT 2026: Personalisation Choice Modal (PA-08) */}
      <AlertDialog open={!!personalizationChoiceOrder} onOpenChange={(open) => !open && setPersonalizationChoiceOrder(null)}>
        <AlertDialogContent className="max-w-sm rounded-[var(--radius-3xl)] p-8 shadow-2xl border-[var(--border)] z-[var(--z-modal)]">
          <AlertDialogHeader className="flex flex-col items-center text-center space-y-6">
            <div className="size-20 rounded-[var(--radius-2xl)] bg-[var(--well-warning)] flex items-center justify-center relative overflow-hidden">
              <Sparkles className="size-10 text-[var(--well-warning-text)] relative z-10 fill-[var(--warning)]/20" />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--warning)]/10 to-transparent" />
            </div>

            <div className="space-y-2">
              <AlertDialogTitle className="text-2xl font-bold tracking-tighter text-[var(--text-primary)] leading-tight">Same design particulars?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-medium text-[var(--text-secondary)] px-4">
                Do you want to use the exact same personalisation as before, or start fresh?
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex flex-col sm:flex-col w-full space-y-3 pt-2">
            <AlertDialogAction
              onClick={() => personalizationChoiceOrder && handleReorder(personalizationChoiceOrder, true)}
              className="w-full h-16 bg-[var(--foreground)] text-[var(--text-inverse)] rounded-[var(--radius-xl)] font-[900] uppercase tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[var(--shadow-md)] shadow-[var(--foreground)]/10"
            >
              <RotateCcw className="size-5 text-[var(--primary)]" />
              Repeat design
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => personalizationChoiceOrder && handleReorder(personalizationChoiceOrder, false)}
              className="w-full h-16 bg-[var(--surface)] text-[var(--text-primary)] border-2 border-[var(--border)] rounded-[var(--radius-xl)] font-[900] uppercase tracking-tight hover:bg-[var(--surface-muted)] active:scale-[0.98] transition-all shadow-[var(--shadow-sm)]"
            >
              New personalisation
            </AlertDialogAction>
            <AlertDialogCancel
              className="w-full py-2 text-xs font-bold text-[var(--text-tertiary)] tracking-tight hover:text-[var(--text-secondary)] transition-colors uppercase border-none bg-transparent hover:bg-transparent"
            >
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
