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
      <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center bg-background">
        <p className="text-sm font-medium text-zinc-900">Vendor data not available</p>
        <p className="text-xs text-zinc-500 mt-1">Try again in a moment</p>
        <Button onClick={() => router.refresh()} variant="link" className="text-xs mt-2">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 min-h-screen bg-white pb-24">
      {/* WYSHKIT 2026: Proactive Mismatch Nudge */}
      {isMismatch && (
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between gap-3 sticky top-0 z-[60]">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-3.5 text-amber-600" />
            <p className="text-[10px] font-black text-amber-900 tracking-widest">Active cart at another vendor</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              triggerHaptic(HapticPattern.ACTION);
              router.push('/checkout');
            }}
            className="h-7 px-3 text-[9px] font-black tracking-widest border-amber-200 bg-white text-amber-900"
          >
            View cart
          </Button>
        </div>
      )}

      {/* CORE STORE UI - ZERO SDUI LEAKS */}
      <div className="flex flex-col gap-6">
        <StoreHeader data={{
          id: initialData.id,
          name: initialData.name,
          image_url: initialData.image_url ?? undefined,
          rating: initialData.rating ?? undefined,
          city: initialData.city ?? undefined,
          prep_mins: initialData.prep_mins ?? undefined
        }} />

        <section className="px-4 md:px-8 max-w-[1440px] mx-auto w-full">
          <CircleRail data={categories} />
        </section>

        <div className="flex flex-col gap-10 px-4 md:px-8 max-w-[1440px] mx-auto w-full pb-12">
          {Object.entries(productsGroupedByCategory).map(([category, categoryProducts]) => (
            <section key={category} id={category.toLowerCase()} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-black text-zinc-950 tracking-tighter capitalize">{category}</h2>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2 py-0.5 rounded-full border border-zinc-100">
                  {categoryProducts.length} {categoryProducts.length === 1 ? 'Product' : 'Products'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
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
