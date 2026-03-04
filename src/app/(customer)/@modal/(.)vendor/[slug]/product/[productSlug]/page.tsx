import { getProductSurface } from '@/lib/actions/discovery/products';
import { InterceptedProductSheet } from '@/components/customer/product/InterceptedProductSheet';
import { redirect } from 'next/navigation';
import { logger } from '@/lib/logging/logger';

export default async function RootInterceptedProductPage({
    params,
}: {
    params: Promise<{ slug: string; productSlug: string }>;
}) {
    const { slug, productSlug } = await params;

    // WYSHKIT 2026: One-Trip God-Surface (Focused)
    // For intercepted routes, we only need the product data.
    // The background (Home Page) is ALREADY rendered.
    const { data, error } = await getProductSurface(productSlug, slug);

    if (!data || error) {
        logger.error('Intercepted Product Page Failed: Redirecting to full page', { error, productSlug, vendorSlug: slug });
        redirect(`/vendor/${slug}/product/${productSlug}`);
    }

    return (
        <InterceptedProductSheet
            product={data.product}
            onCloseOverride={`/vendor/${slug}`}
        />
    );
}
