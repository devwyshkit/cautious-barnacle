'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DraftSummaryBlock } from "@/components/customer/checkout/blocks/DraftSummaryBlock";
import { useCart } from '@/components/customer/CartProvider';
import type { CartProduct } from "@/lib/types/personalization";
import { toast } from "sonner";

interface CartSlotProps {
  initialHydratedProducts?: CartProduct[];
  editable?: boolean;
}

/**
 * WYSHKIT 2026: Cart Slot Component
 * Displays cart summary with edit capabilities
 * 
 * WYSHKIT 2026 Pattern: Stateless & Seamless
 * - Data injected via props
 * - Mutations via Server Actions + router.refresh()
 */
export function CartSlot({ initialHydratedProducts = [], editable = true }: CartSlotProps) {
  const router = useRouter();
  const { draftOrder, updateQuantity, removeFromDraftOrder } = useCart();

  // WYSHKIT 2026: Live sync CartSlot
  // We prefer live products from context if available, fallback to SSR products
  const displayProducts = useMemo(() => {
    if (draftOrder.products.length > 0) {
      return draftOrder.products;
    }
    return initialHydratedProducts;
  }, [draftOrder.products, initialHydratedProducts]);

  const handleUpdateQuantity = async (productId: string, variantId: string | null, quantity: number, personalization?: any, selected_addons?: any[]) => {
    try {
      await updateQuantity(productId, variantId, quantity, personalization, selected_addons);
      router.refresh(); // Refresh server-side checkout totals
    } catch (e) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId: string, variantId: string | null, personalization?: any, selected_addons?: any[]) => {
    try {
      await removeFromDraftOrder(productId, variantId, personalization, selected_addons);
      router.refresh(); // Refresh server-side checkout totals
    } catch (e) {
      toast.error("Failed to remove product");
    }
  };

  if (displayProducts.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-[var(--text-tertiary)]">Your cart is empty</p>
      </div>
    );
  }

  return (
    <DraftSummaryBlock
      products={displayProducts}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      editable={editable}
    />
  );
}
