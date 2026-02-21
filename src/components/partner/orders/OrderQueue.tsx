'use client';

import { useState, useEffect } from 'react';
import { OrderCard } from './OrderCard';
import { update_order_status, reject_order } from '@/lib/actions/partner-actions';
import { mark_order_as_packed } from '@/lib/actions/orders'; // SWIGGY 2026: Added for trigger consistency
import type { PartnerOrder } from '@/lib/actions/partner-actions';
import { toast } from 'sonner';
import { ORDER_STATUS, type OrderStatus } from '@/lib/types/order-status';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/client';
import { Package } from 'lucide-react';
import { logger } from '@/lib/logging/logger';
import { useRealtime } from '@/providers/RealtimeProvider';

type StatusTab = 'new' | 'preparing' | 'ready' | 'done';

const STATUS_TABS: { id: StatusTab; label: string; statuses: OrderStatus[] }[] = [
  {
    id: 'new',
    label: 'New',
    statuses: [ORDER_STATUS.PLACED]
  },
  {
    id: 'preparing',
    label: 'Preparing',
    statuses: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.DETAILS_RECEIVED, ORDER_STATUS.PREVIEW_READY, ORDER_STATUS.REVISION_REQUESTED, ORDER_STATUS.APPROVED, ORDER_STATUS.IN_PRODUCTION]
  },
  {
    id: 'ready',
    label: 'Ready',
    statuses: [ORDER_STATUS.PACKED, ORDER_STATUS.DISPATCHED, ORDER_STATUS.OUT_FOR_DELIVERY]
  },
  {
    id: 'done',
    label: 'Done',
    statuses: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED]
  },
];

interface OrderQueueProps {
  initialOrders: PartnerOrder[];
  partnerId: string;
}

export function OrderQueue({ initialOrders, partnerId }: OrderQueueProps) {
  const [orders, setOrders] = useState<PartnerOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<StatusTab>('new');
  const [updating, setUpdating] = useState<string | null>(null);

  // Audio for new order notification
  const playNotification = () => {
    try {
      const audio = new Audio('/audio/new-order.mp3');
      audio.play().catch(e => logger.warn('Audio play failed', e));
    } catch (e) {
      logger.error('Audio setup failed', e as Error);
    }
  };

  // WYSHKIT 2026: Shared Pulse Pattern
  // We use the singleton connection from RealtimeProvider instead of creating a new client.
  const { isConnected } = useRealtime();

  useEffect(() => {
    if (!isConnected) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`partner-orders-${partnerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `partner_id=eq.${partnerId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch full relation data for the new order
            const { data: newOrder } = await supabase
              .from('orders')
              .select(`*, order_items (*), order_personalization (*)`)
              .eq('id', payload.new.id)
              .single();

            if (newOrder) {
              const typedOrder = newOrder as any as PartnerOrder;
              setOrders(prev => {
                // Deduplicate
                if (prev.some(o => o.id === typedOrder.id)) return prev;
                return [typedOrder, ...prev];
              });

              toast.info('New order received!', {
                description: `Order #${typedOrder.order_number}`,
                duration: 5000,
              });
              playNotification();
            }
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(o =>
              o.id === payload.new.id ? { ...o, ...payload.new } : o
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partnerId, isConnected]);

  const filteredOrders = orders.filter(order => {
    const tab = STATUS_TABS.find(t => t.id === activeTab);
    return tab?.statuses.includes(order.status as OrderStatus);
  });

  const getOrderCount = (tabId: StatusTab) => {
    const tab = STATUS_TABS.find(t => t.id === tabId);
    return orders.filter(o => tab?.statuses.includes(o.status as OrderStatus)).length;
  };

  const handleAccept = async (orderId: string) => {
    setUpdating(orderId);
    try {
      const nextStatus = ORDER_STATUS.CONFIRMED;
      const result = await update_order_status(orderId, nextStatus);

      if (result.success) {
        setOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, status: nextStatus } : o
        ));
        toast.success('Order accepted');
      } else {
        toast.error(result.error || 'Failed to accept');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (orderId: string, reason: string) => {
    setUpdating(orderId);
    try {
      const result = await reject_order(orderId, reason);
      if (result.success) {
        setOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, status: ORDER_STATUS.CANCELLED } : o
        ));
        toast.success('Order rejected');
      } else {
        toast.error(result.error || 'Failed to reject');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setUpdating(null);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const result = await update_order_status(orderId, newStatus);
      if (result.success) {
        setOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus as PartnerOrder['status'] } : o
        ));
        toast.success('Order updated');
      } else {
        toast.error(result.error || 'Failed to update');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as StatusTab)}>
        <TabsList className="grid grid-cols-4 w-full bg-zinc-100">
          {STATUS_TABS.map(tab => {
            const count = getOrderCount(tab.id);
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="relative data-[state=active]:bg-white"
              >
                {tab.label}
                {count > 0 && (
                  <span className={cn(
                    "ml-1.5 inline-flex items-center justify-center min-w-[18px] px-1 py-0.5 text-xs font-medium rounded-full",
                    activeTab === tab.id
                      ? "bg-zinc-900 text-white"
                      : tab.id === 'new'
                        ? "bg-red-500 text-white"
                        : "bg-zinc-200 text-zinc-600"
                  )}>
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-zinc-100">
            <Package className="size-12 text-zinc-200 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">No orders here</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={handleAccept}
              onReject={handleReject}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={updating === order.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
