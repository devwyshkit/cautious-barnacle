'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { MappedVendor } from '@/lib/types/vendor';
import { useRouter } from 'next/navigation';
import { useCartValidation } from '@/hooks/useCartValidation';
import { AlertCircle } from 'lucide-react';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { StoreHeader } from '@/components/ui/blocks/vendor/StoreHeader';
import { CircleRail } from '@/components/ui/blocks/discovery/CircleRail';
import { WyshkitProduct } from '@/lib/types/product';
import { ProductCard } from '@/components/ui/ProductCard';

interface VendorStorePageProps {
  vendorId: string;
  initialData?: MappedVendor;
  products: WyshkitProduct[];
  productsGroupedByCategory: Record<string, WyshkitProduct[]>;
  categories: any[];
}

export function VendorStorePage({ vendorId, initialData, products, productsGroupedByCategory, categories }: VendorStorePageProps) {
  const router = useRouter();

  // WYSHKIT 2026: Proactive Cart Validation
  const { isMismatch } = useCartValidation(vendorId);

  if (!initialData || !products) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-[var(--space-6)] text-center bg-[var(--background)]">
        <p className="text-sm font-medium text-[var(--text-primary)]">Vendor data not available</p>
        <p className="text-xs text-[var(--text-secondary)] mt-[var(--space-1)]">Try again in a moment</p>
        <Button onClick={() => router.refresh()} variant="link" className="text-xs mt-[var(--space-2)]">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 min-h-[100dvh] bg-[var(--surface)] pb-24">
      {/* WYSHKIT 2026: Proactive Mismatch Nudge */}
      {isMismatch && (
        <div className="px-[var(--space-4)] py-[var(--space-3)] bg-[var(--well-warning)] border-b border-[var(--warning)]/10 flex items-center justify-between gap-[var(--space-3)] sticky top-0 z-[var(--z-nav)]">
          <div className="flex items-center gap-[var(--space-2)]">
            <AlertCircle className="size-3.5 text-[var(--warning)]" />
            <p className="text-xs font-bold text-[var(--text-primary)] tracking-widest">Active cart at another vendor</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              triggerHaptic(HapticPattern.ACTION);
              router.push('/checkout');
            }}
            className="h-7 px-[var(--space-3)] text-xs font-bold tracking-widest border-[var(--warning)]/20 bg-[var(--surface)] text-[var(--warning)]"
          >
            View cart
          </Button>
        </div>
      )}

      {/* CORE STORE UI - ZERO SDUI LEAKS */}
      <div className="flex flex-col gap-[var(--space-6)]">
        <StoreHeader data={{
          id: initialData.id,
          name: initialData.name,
          slug: initialData.slug ?? '',
          image_url: initialData.image_url ?? undefined,
          rating: initialData.rating ?? undefined,
          city: initialData.city ?? undefined,
          prep_mins: initialData.prep_mins ?? undefined
        }} />

        <section className="px-[var(--space-4)] md:px-[var(--space-8)] max-w-[1440px] mx-auto w-full">
          <CircleRail data={categories} context={{ vendor_id: vendorId }} />
        </section>

        <div className="flex flex-col gap-[var(--space-10)] px-[var(--space-4)] md:px-[var(--space-8)] max-w-[1440px] mx-auto w-full pb-[var(--space-12)]">
          {Object.entries(productsGroupedByCategory).map(([category, categoryProducts]) => (
            <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="flex flex-col gap-[var(--space-4)]">
              <div className="flex items-center gap-[var(--space-3)]">
                <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tighter capitalize">{category}</h2>
                <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest bg-[var(--surface-muted)] px-[var(--space-2)] py-[var(--space-0-5)] rounded-full border border-[var(--border)]">
                  {categoryProducts.length} {categoryProducts.length === 1 ? 'Product' : 'Products'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[var(--space-3)] md:gap-[var(--space-4)]">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} data={product} variant="portrait" />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
