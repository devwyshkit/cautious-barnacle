'use client';

import React from 'react';
import { useUI } from '@/providers/UIProvider';
import { ProductDetailView } from './product/ProductDetailView';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';

export function ProductSheet() {
    const { isProductSheetOpen, closeProductSheet, activeProduct } = useUI();

    return (
        <ResponsiveSurface
            open={isProductSheetOpen}
            onOpenChange={(open) => !open && closeProductSheet()}
            title={activeProduct?.name || "Product Details"}
            description={activeProduct?.vendor_name || "Store Details"}
            className="md:max-w-xl h-[92vh] md:h-[85vh] p-0"
        >
            {activeProduct ? (
                <ProductDetailView
                    product={activeProduct}
                    onBack={closeProductSheet}
                />
            ) : (
                <div className="flex flex-col gap-6 p-4 animate-pulse">
                    <div className="aspect-square w-full bg-[var(--surface-muted)] rounded-[var(--radius-lg)]" />
                    <div className="h-8 w-3/4 bg-[var(--surface-muted)] rounded-md" />
                    <div className="h-4 w-1/2 bg-[var(--surface-muted)] rounded-md" />
                </div>
            )}
        </ResponsiveSurface>
    );
}
