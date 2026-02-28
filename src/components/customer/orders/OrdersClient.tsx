'use client';

import React from 'react';
import { PullToRefresh } from "@/components/layout/PullToRefresh";
import { useRouter } from "next/navigation";
import { OrderList } from "@/components/customer/orders/OrderList";

export function OrdersClient() {
  const router = useRouter();

  const handleRefresh = async () => {
    router.refresh();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <OrderList />
    </PullToRefresh>
  );
}
