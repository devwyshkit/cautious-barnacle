'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DraftSummaryBlock } from "@/components/customer/checkout/blocks/DraftSummaryBlock";
import { useCart } from '@/components/customer/CartProvider';
import type { DraftLineItem } from "@/lib/types/personalization";
import { toast } from "sonner";

interface CartSlotProps {
  initialHydratedItems?: DraftLineItem[];
}

/**
 * WYSHKIT 2026: Cart Slot Component
 * Displays cart summary with edit capabilities
 * 
 * Swiggy 2026 Pattern: Stateless & Seamless
 * - Data injected via props
 * - Mutations via Server Actions + router.refresh()
 */
export function CartSlot({ initialHydratedItems = [] }: CartSlotProps) {
  const router = useRouter();
  const { draftOrder, updateQuantity, removeFromDraftOrder } = useCart();

  // WYSHKIT 2026: Live sync CartSlot
  // We prefer live products from context if available, fallback to SSR products
  const displayItems = useMemo(() => {
    if (draftOrder.products.length > 0) {
      return draftOrder.products;
    }
    return initialHydratedItems;
  }, [draftOrder.products, initialHydratedItems]);

  const handleUpdateQuantity = async (itemId: string, variantId: string | null, quantity: number) => {
    try {
      await updateQuantity(itemId, variantId, quantity);
      // No router.refresh needed because useCart is reactive
    } catch (e) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: string, variantId: string | null) => {
    try {
      await removeFromDraftOrder(itemId, variantId);
    } catch (e) {
      toast.error("Failed to remove product");
    }
  };

  if (displayItems.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-zinc-400">Your cart is empty</p>
      </div>
    );
  }

  return (
    <DraftSummaryBlock
      products={displayItems}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      editable={true}
    />
  );
}
