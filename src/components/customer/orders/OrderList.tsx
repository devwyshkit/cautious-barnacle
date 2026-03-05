"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { OrderProductListItem } from "@/lib/types/order";
import { OrderCard } from "./OrderCard";
import { AppText } from "@/components/ui/Typography";
import { PackageOpen } from "lucide-react";
import { OrderCardSkeleton } from "@/components/ui/skeleton-layouts";
import { PullToRefresh } from "@/components/layout/PullToRefresh";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";
import { isToday, isYesterday, parseISO, startOfDay, subDays } from "date-fns";

interface OrderListProps {
  initialOrders?: OrderProductListItem[];
}

export function OrderList({ initialOrders }: OrderListProps) {
  // Use initialOrders if provided, otherwise default to empty array or fetch
  const [orders, setOrders] = useState<OrderProductListItem[]>(initialOrders || []);
  const [loading, setLoading] = useState(!initialOrders);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // WYSHKIT 2026: Authority from View
      const { data, error } = await supabase
        .from("v_order_tracking")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // ELITE: Mapping is now zero because the view is shaped for the UI
      setOrders(data || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch orders";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    // Only fetch if we didn't get initial data
    if (!initialOrders) {
      fetchOrders();
    }
  }, [fetchOrders, initialOrders]);

  const handleRefresh = async () => {
    await fetchOrders();
  };

  if (loading) {
    return (
      <div className="space-y-4 px-4 py-6">
        {[...Array(3)].map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-10 px-4">
        <EmptyState
          title="No orders yet"
          description="Looks like you haven't placed any orders yet. Start browsing!"
          actionLabel="Browse products"
          onAction={() => router.push("/")}
        >
          <div className="size-12 rounded-[var(--radius-md)] bg-[var(--surface-muted)] flex items-center justify-center mb-4">
            <PackageOpen className="size-6 text-[var(--text-tertiary)]" />
          </div>
        </EmptyState>
      </div>
    );
  }

  const groupOrders = (orders: OrderProductListItem[]) => {
    const groups: Record<string, OrderProductListItem[]> = {
      "Active Orders": [],
      "Today": [],
      "Yesterday": [],
      "Earlier": []
    };

    orders.forEach(order => {
      const status = order.status ?? 'UNKNOWN';
      const isActive = ['PLACED', 'CONFIRMED', 'IN_PRODUCTION', 'PACKED', 'OUT_FOR_DELIVERY'].includes(status);

      if (isActive) {
        groups["Active Orders"].push(order);
        return;
      }

      const date = parseISO(order.created_at || new Date().toISOString());
      if (isToday(date)) groups["Today"].push(order);
      else if (isYesterday(date)) groups["Yesterday"].push(order);
      else groups["Earlier"].push(order);
    });

    return groups;
  };

  const groupedOrders = groupOrders(orders);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-5 pb-10">
        {Object.entries(groupedOrders).map(([title, items]) => {
          if (items.length === 0) return null;
          return (
            <div key={title} className="space-y-2">
              <AppText variant="caption" weight="bold" color="tertiary" className="px-1 tracking-wider uppercase">
                {title}
              </AppText>
              <div className="space-y-3">
                {items.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    variant={title === "Earlier" ? "compact" : "default"}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PullToRefresh>
  );
}
