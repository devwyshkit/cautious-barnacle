'use client';

import React from "react";
import { ResponsiveSurface } from "@/components/ui/ResponsiveSurface";
import { ProductDetailView } from '@/components/customer/product/ProductDetailView';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { WyshkitProduct } from '@/lib/types/product';
import { logger } from "@/lib/logging/logger";

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
        // WYSHKIT 2026: Explicit slug-first navigation
        const vendorSlug = product.vendor_slug || searchParams.get('vendor_slug');
        if (!vendorSlug && !returnUrl && !onCloseOverride) {
            logger.warn(`[WYSHKIT 2026] Missing vendor_slug for product ${product.id}. Law 11 Violation.`, {
                productId: product.id
            });
        }

        // Target resolution logic:
        // 1. Explicit returnUrl (e.g. from search page)
        // 2. Explicit onCloseOverride (e.g. from intercepted route)
        // 3. Fallback to constructed vendor path
        // 4. Ultimate fallback to shop home
        const targetPath = returnUrl || onCloseOverride || (vendorSlug ? `/vendor/${vendorSlug}` : '/');

        router.push(targetPath);
    }, [product.id, product.vendor_slug, onCloseOverride, router, searchParams]);

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
            <div className="flex-1 flex flex-col min-h-0 relative h-full w-full">
                <ProductDetailView
                    product={product}
                    onBack={handleClose}
                    initialState={initialState}
                />
            </div>
        </ResponsiveSurface>
    );
}
