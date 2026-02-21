"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { OrderListItem } from "@/lib/types/order";
import { OrderStatus } from "@/lib/types/order-status";
import { OrderCard } from "./OrderCard";
import { Loader2, PackageOpen } from "lucide-react";
import { PullToRefresh } from "@/components/layout/PullToRefresh";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";

interface OrderListProps {
  initialOrders?: OrderListItem[];
}

export function OrderList({ initialOrders }: OrderListProps) {
  // Use initialOrders if provided, otherwise default to empty array or fetch
  const [orders, setOrders] = useState<OrderListItem[]>(initialOrders || []);
  const [loading, setLoading] = useState(!initialOrders);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const query = supabase
        .from("v_orders_detailed")
        .select("id, order_number, status, total, created_at, partner_name, partner_image, items")
        .eq("user_id", session.user.id) // Changed from userId to user_id, and user.id to session.user.id
        .order("created_at", { ascending: false }); // Changed from createdAt to created_at

      const { data, error } = await query;

      if (error) {
        // The instruction had a <p> tag here, which is not valid in this context.
        // Reverting to original error handling or throwing the error.
        throw error;
      }

      const mapped: OrderListItem[] = (data || []).map((row: any) => ({
        ...row,
        order_number: row.order_number,
        created_at: row.created_at,
        partner_name: row.partner_name,
        // UI-only computed fields
        item_count: row.items?.length || 1,
        first_item_image: row.partner_image || null,
        first_item_name: row.items?.map((it: any) => it.item_name).join(', ') || null,
      }));
      setOrders(mapped);
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
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-zinc-200" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-10 px-4">
        <EmptyState
          title="No orders yet"
          description="Looks like you haven't placed any orders yet. Start browsing!"
          actionLabel="Browse items"
          onAction={() => router.push("/")}
        >
          <div className="size-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-4">
            <PackageOpen className="size-8 text-zinc-300" />
          </div>
        </EmptyState>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-4 pb-10">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </PullToRefresh>
  );
}
