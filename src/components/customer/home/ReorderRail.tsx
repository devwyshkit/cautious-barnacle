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
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-[var(--radius-sm)] bg-[var(--well-success)] flex items-center justify-center">
            <RotateCcw className="size-4 text-[var(--well-success-text)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">Reorder</h2>
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">From your recent picks</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
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
                "shrink-0 w-[260px] bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden shadow-sm",
                "hover:border-[var(--border)] transition-all duration-300",
                "active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed",
                !isOrderAvailable && "grayscale",
                "group animate-in fade-in slide-in-from-bottom-2",
                `[animation-delay:${index * 0.1}s]`
              )}
            >
              <div className="flex items-stretch h-28">
                <div className="relative w-28 bg-[var(--surface-muted)] shrink-0">
                  {firstProduct?.image_url ? (
                    <Image
                      src={firstProduct.image_url}
                      alt={firstProduct.product_name || 'Order product'}
                      fill
                      className="object-cover"
                      sizes="110px"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <RotateCcw className="size-6 text-[var(--text-tertiary)]" />
                    </div>
                  )}
                  {hasPersonalization && (
                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--warning)] shadow-lg shadow-[var(--warning)]/20">
                      <Sparkles className="size-3 text-white fill-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 p-3 flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-tertiary)] mb-1 uppercase tracking-wider">
                    <Clock className="size-3" />
                    <span>{formatDate(order.created_at)}</span>
                    <span>•</span>
                    <span className="truncate">{order.vendor_name}</span>
                  </div>

                  <p className="text-sm font-bold text-[var(--text-primary)] truncate leading-tight">
                    {firstProduct?.product_name || 'Order'}
                  </p>
                  {productCount > 1 && (
                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase mt-0.5">
                      +{productCount - 1} other product{productCount > 2 ? 's' : ''}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
                      {formatCurrency(order.total)}
                    </span>

                    <div className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-bold uppercase tracking-tight transition-all",
                      isReordering
                        ? "bg-[var(--well-success)] text-[var(--well-success-text)]"
                        : !isOrderAvailable
                          ? "bg-[var(--well-destructive)] text-[var(--well-destructive-text)]"
                          : "bg-[var(--surface-muted)] text-[var(--text-primary)] group-hover:bg-[var(--foreground)] group-hover:text-white"
                    )}>
                      {isReordering ? (
                        <>
                          <Check className="size-3" />
                          <span>Adding</span>
                        </>
                      ) : !isOrderAvailable ? (
                        <>
                          <AlertCircle className="size-3" />
                          <span>OOS</span>
                        </>
                      ) : (
                        <>
                          <span>Reorder</span>
                          <ChevronRight className="size-3" />
                        </>
                      )}
                    </div>
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
              className="w-full h-16 bg-[var(--foreground)] text-white rounded-[var(--radius-xl)] font-[900] uppercase tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[var(--shadow-md)] shadow-[var(--foreground)]/10"
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
    </section>
  );
}
