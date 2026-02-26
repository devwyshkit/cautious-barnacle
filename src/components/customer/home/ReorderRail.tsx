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
          <div className="size-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <RotateCcw className="size-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-black text-zinc-900 tracking-tight">Reorder</h2>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">From your recent picks</p>
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
                "shrink-0 w-[260px] bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm",
                "hover:border-zinc-200 transition-all duration-300",
                "active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed",
                !isOrderAvailable && "grayscale",
                "group animate-in fade-in slide-in-from-bottom-2",
                `[animation-delay:${index * 0.1}s]`
              )}
            >
              <div className="flex items-stretch h-28">
                <div className="relative w-28 bg-zinc-100 shrink-0">
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
                      <RotateCcw className="size-6 text-zinc-300" />
                    </div>
                  )}
                  {hasPersonalization && (
                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-500 shadow-lg shadow-amber-500/20">
                      <Sparkles className="size-3 text-white fill-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 p-3 flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 mb-1 uppercase tracking-wider">
                    <Clock className="size-3" />
                    <span>{formatDate(order.created_at)}</span>
                    <span>•</span>
                    <span className="truncate">{order.vendor_name}</span>
                  </div>

                  <p className="text-sm font-black text-zinc-900 truncate leading-tight">
                    {firstProduct?.product_name || 'Order'}
                  </p>
                  {productCount > 1 && (
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mt-0.5">
                      +{productCount - 1} other product{productCount > 2 ? 's' : ''}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-black text-zinc-950 tabular-nums">
                      ₹{Math.floor(order.total)}
                    </span>

                    <div className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all",
                      isReordering
                        ? "bg-emerald-100 text-emerald-700"
                        : !isOrderAvailable
                          ? "bg-rose-50 text-rose-600"
                          : "bg-zinc-50 text-zinc-900 group-hover:bg-zinc-950 group-hover:text-white"
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
      {personalizationChoiceOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="size-20 rounded-[30px] bg-amber-50 flex items-center justify-center relative overflow-hidden">
                <Sparkles className="size-10 text-amber-500 relative z-10 fill-amber-500/20" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-transparent" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter text-zinc-950 leading-tight">Same design particulars?</h3>
                <p className="text-sm font-medium text-zinc-500 px-4">
                  Do you want to use the exact same personalisation as before, or start fresh?
                </p>
              </div>

              <div className="w-full space-y-3 pt-2">
                <button
                  onClick={() => handleReorder(personalizationChoiceOrder, true)}
                  className="w-full h-16 bg-zinc-950 text-white rounded-[24px] font-black tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <RotateCcw className="size-5 text-amber-400" />
                  Repeat details
                </button>
                <button
                  onClick={() => handleReorder(personalizationChoiceOrder, false)}
                  className="w-full h-16 bg-white text-zinc-950 border-2 border-zinc-100 rounded-[24px] font-black tracking-tight hover:bg-zinc-50 active:scale-[0.98] transition-all"
                >
                  New personalisation
                </button>
                <button
                  onClick={() => setPersonalizationChoiceOrder(null)}
                  className="w-full py-2 text-xs font-black text-zinc-400 tracking-tight hover:text-zinc-600 transition-colors uppercase"
                >
                  Never mind
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
