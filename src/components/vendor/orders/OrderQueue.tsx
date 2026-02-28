'use client';

import { useState, useEffect } from 'react';
import { OrderCard } from './OrderCard';
import { executeVendorIntent } from '@/lib/actions/vendor/engine';
import type { VendorOrder } from '@/lib/actions/commerce/orders';
import { useVendorRealtime } from '@/hooks/useVendorRealtime';
import { toast } from 'sonner';
import { ORDER_STATUS, type OrderStatus } from '@/lib/types/order-status';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package } from 'lucide-react';

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
    statuses: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.IN_PRODUCTION]
  },
  {
    id: 'ready',
    label: 'Ready',
    statuses: [ORDER_STATUS.PACKED, ORDER_STATUS.OUT_FOR_DELIVERY]
  },
  {
    id: 'done',
    label: 'Done',
    statuses: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED]
  },
];

interface OrderQueueProps {
  initialOrders: VendorOrder[];
  vendorId: string;
}

export function OrderQueue({ initialOrders, vendorId }: OrderQueueProps) {
  const [activeTab, setActiveTab] = useState<StatusTab>('new');
  const [updating, setUpdating] = useState<string | null>(null);

  // WYSHKIT 2026: Standardized Pulse Hook
  const { orders, setOrders } = useVendorRealtime({
    vendorId,
    initialOrders
  });

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
      const result = await executeVendorIntent({
        entity: 'order',
        action: 'ACCEPT',
        id: orderId
      });

      if (result.success) {
        setOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, status: ORDER_STATUS.CONFIRMED as any } : o
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
      const result = await executeVendorIntent({
        entity: 'order',
        action: 'REJECT',
        id: orderId,
        metadata: { reason }
      });
      if (result.success) {
        setOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, status: ORDER_STATUS.CANCELLED as any } : o
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
      const result = await executeVendorIntent({
        entity: 'order',
        action: 'UPDATE_STATUS',
        id: orderId,
        target_status: newStatus
      });
      if (result.success) {
        setOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus as any } : o
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
