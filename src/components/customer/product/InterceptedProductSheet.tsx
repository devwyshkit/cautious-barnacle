'use client';

import React from "react";
import { ResponsiveSurface } from "@/components/ui/ResponsiveSurface";
import { ProductDetailView } from '@/components/customer/product/ProductDetailView';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { WyshkitProduct } from '@/lib/types/product';

const checkoutStateSchema = z.object({
    edit: z.string().optional(),
    cartProductId: z.string().uuid().optional(),
    variantId: z.string().uuid().nullable().optional(),
    quantity: z.coerce.number().int().min(1).default(1),
    addons: z.string().optional()
});

interface InterceptedProductSheetProps {
    product: WyshkitProduct;
    onCloseOverride?: string;
}

export function InterceptedProductSheet({ product, onCloseOverride }: InterceptedProductSheetProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(true);
    const searchParams = useSearchParams();
    const isFromSearch = searchParams.get('context') === 'search';

    const handleClose = React.useCallback(() => {
        setOpen(false);
        // WYSHKIT 2026: Elite navigation stability.
        // We favor explicit paths over history.back() for intercepted sheets
        // to ensure we never land on a "dead end" or redirect loop.
        const returnUrl = searchParams.get('returnUrl');
        const vendorPath = `/vendor/${product.vendor_id || searchParams.get('id')}`;
        const targetPath = returnUrl || onCloseOverride || vendorPath;

        router.push(targetPath);
    }, [product.vendor_id, onCloseOverride, router, searchParams]);

    const params = Object.fromEntries(searchParams.entries());
    const validated = checkoutStateSchema.safeParse(params);
    const checkoutState = validated.success ? validated.data : null;

    const initialState = checkoutState?.edit === 'true' && checkoutState?.cartProductId ? {
        cartProductId: checkoutState.cartProductId,
        variantId: checkoutState.variantId || null,
        quantity: checkoutState.quantity,
        addonIds: checkoutState.addons?.split(',').filter(Boolean) || []
    } : undefined;

    return (
        <ResponsiveSurface
            open={open}
            onOpenChange={(v) => { if (!v) handleClose(); }}
            title={product.name || 'Product Details'}
            description={`View details and add ${product.name || 'this product'} to your cart.`}
            className="md:max-w-[520px]"
            lean
        >
            <div className="flex-1 relative h-full">
                <ProductDetailView
                    product={product}
                    onBack={handleClose}
                    initialState={initialState}
                />
            </div>
        </ResponsiveSurface>
    );
}
