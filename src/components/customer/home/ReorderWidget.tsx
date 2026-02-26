'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RotateCcw, ChevronRight, Sparkles, Clock, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/components/customer/CartProvider';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logging/logger';
import { hasAnyPersonalization } from '@/lib/utils/personalization';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

interface RecentOrder {
  id: string;
  order_number: string;
  products: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    images?: string[];
    variant_id?: string;
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

export function ReorderWidget({ initialOrders }: ReorderWidgetProps) {
  const { user } = useAuth();
  const { addToDraftOrder, clearDraftOrder, isPending } = useCart();

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(initialOrders || []);
  const [itemAvailability, setItemAvailability] = useState<Record<string, { inStock: boolean; name: string }>>({});
  const [loading, setLoading] = useState(!initialOrders);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [personalizationChoiceOrder, setPersonalizationChoiceOrder] = useState<RecentOrder | null>(null);

  useEffect(() => {
    if (initialOrders || !user) {
      setLoading(false);
      return;
    }

    const fetchRecentOrders = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, order_number, total, created_at,
          vendors(name),
          order_products(
            product_id, 
            product_name, 
            quantity, 
            variant_id, 
            personalization_details,
            products(images, is_personalized)
          )
        `)
        .eq('user_id', user.id)
        .in('status', ['DELIVERED', 'OUT_FOR_DELIVERY', 'PACKED', 'IN_PRODUCTION'])
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        const mappedData: RecentOrder[] = data.map((row: any) => ({
          ...row,
          vendor_name: row.vendors?.name,
          products: (row.order_products || []).map((oi: any) => ({
            product_id: oi.product_id,
            product_name: oi.product_name,
            quantity: oi.quantity,
            images: oi.products?.images || [],
            is_personalized: oi.products?.is_personalized,
            variant_id: oi.variant_id,
            personalization: oi.personalization_details ? {
              enabled: true,
              ...oi.personalization_details
            } : undefined
          }))
        }));
        setRecentOrders(mappedData);

        // Fetch current stock for these products
        const productIds = Array.from(new Set(mappedData.flatMap(order => order.products.map((i: any) => i.product_id))));
        if (productIds.length > 0) {
          const { data: stockData } = await supabase
            .from('products')
            .select('id, name, stock_quantity, is_active')
            .in('id', productIds);

          if (stockData) {
            const availability = (stockData as any[]).reduce((acc, product) => {
              acc[product.id] = {
                inStock: product.is_active && product.stock_quantity > 0,
                name: product.name
              };
              return acc;
            }, {});
            setItemAvailability(availability);
          }
        }
      }
      setLoading(false);
    };

    fetchRecentOrders();
  }, [user]);

  const initiateReorder = (order: RecentOrder) => {
    const personalizedProducts = order.products.filter(p => (p as any).is_personalized);
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
            : { enabled: !!(product as any).is_personalized },
          [],
          product.quantity,
          {
            product_name: product.product_name,
            product_image: product.images?.[0],
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
      logger.info('Reorder successful', { orderId: order.id, reusePersonalization });
    } catch (error) {
      logger.error('Reorder failed', error as Error);
      toast.error('Failed to add products');
    } finally {
      setReorderingId(null);
    }
  };

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

  if (!user) {
    return null;
  }

  if (loading) return null;

  if (recentOrders.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-2 md:px-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <RotateCcw className="size-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900">Reorder</h2>
            <p className="text-[11px] text-zinc-500">From your past orders</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
        {recentOrders.map((order, index) => {
          const firstItem = order.products?.[0];
          const productCount = order.products?.length || 0;
          const isReordering = reorderingId === order.id;
          const hasPersonalization = hasAnyPersonalization(order.products || []);

          const isOrderAvailable = order.products?.every(product => itemAvailability[product.product_id]?.inStock ?? true);

          return (
            <button
              key={order.id}
              onClick={() => initiateReorder(order)}
              disabled={isPending || reorderingId === order.id || !isOrderAvailable}
              className={cn(
                "shrink-0 w-[260px] bg-zinc-50/50 rounded-xl border border-zinc-100/50 overflow-hidden",
                "hover:bg-white hover:border-zinc-200 hover:shadow-sm transition-all duration-300",
                "active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed",
                !isOrderAvailable && "grayscale",
                "group slide-in-from-bottom-2",
                `[animation-delay:${index * 0.1}s]`
              )}
            >
              <div className="flex items-stretch">
                <div className="relative w-20 bg-zinc-100">
                  {firstItem?.images?.[0] ? (
                    <Image
                      src={firstItem.images[0]}
                      alt={firstItem.product_name || 'Order product'}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <RotateCcw className="size-6 text-zinc-300" />
                    </div>
                  )}
                  {hasPersonalization && (
                    <div className="absolute bottom-1 left-1 px-1 py-0.5 rounded bg-amber-500/90 shadow-sm animate-pulse">
                      <Sparkles className="size-2.5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 p-3 flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                    <Clock className="size-3" />
                    <span>{formatDate(order.created_at)}</span>
                    <span>•</span>
                    <span className="truncate">{order.vendor_name}</span>
                  </div>

                  <p className="text-sm font-semibold text-zinc-900 truncate">
                    {firstItem?.product_name || 'Order'}
                  </p>
                  {productCount > 1 && (
                    <p className="text-[11px] text-zinc-500">
                      +{productCount - 1} more product{productCount > 2 ? 's' : ''}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-sm font-bold text-zinc-900 tabular-nums">
                      ₹{order.total.toFixed(0)}
                    </span>

                    <div className={cn(
                      "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all",
                      reorderingId === order.id
                        ? "bg-emerald-100 text-emerald-700"
                        : !isOrderAvailable
                          ? "bg-rose-50 text-rose-600"
                          : "bg-zinc-100 text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white"
                    )}>
                      {reorderingId === order.id ? (
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="size-20 rounded-[30px] bg-amber-50 flex items-center justify-center shadow-inner relative overflow-hidden">
                <Sparkles className="size-10 text-amber-500 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-transparent" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-zinc-900">Personalise again?</h3>
                <p className="text-sm font-medium text-zinc-500 px-4">
                  Do you want to use the same personalisation as before, or create something new?
                </p>
              </div>

              <div className="w-full space-y-3 pt-4">
                <button
                  onClick={() => handleReorder(personalizationChoiceOrder, true)}
                  className="w-full h-16 bg-zinc-900 text-white rounded-2xl font-black tracking-tight hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-zinc-200"
                >
                  <RotateCcw className="size-5 text-amber-500" />
                  Reuse same details
                </button>
                <button
                  onClick={() => handleReorder(personalizationChoiceOrder, false)}
                  className="w-full h-16 bg-zinc-50 text-zinc-900 border border-zinc-100 rounded-2xl font-black tracking-tight hover:bg-zinc-100 active:scale-[0.98] transition-all"
                >
                  Create new design
                </button>
                <button
                  onClick={() => setPersonalizationChoiceOrder(null)}
                  className="w-full py-4 text-xs font-black text-zinc-400 tracking-tight hover:text-zinc-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
