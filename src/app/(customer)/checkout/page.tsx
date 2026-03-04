import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCheckoutData } from '@/lib/actions/checkout/checkout';
import { CheckoutClient } from '@/components/customer/checkout/CheckoutClient';
import { Suspense } from 'react';

import { getZeroTripUser } from '@/lib/auth/server';


export default async function CheckoutPage() {
    // WYSHKIT 2026: Zero-Trip Auth Gate (Optional for Checkout)
    const user = await getZeroTripUser();
    // Guests are allowed to see checkout context.

    const checkoutData = await getCheckoutData();

    // If cart is empty, send back to home
    if (!checkoutData.products || checkoutData.products.length === 0) {
        redirect('/');
    }

    return (
        <div className="bg-[var(--surface-muted)]">
            <Suspense fallback={
                <div className="max-w-lg mx-auto px-4 pt-6 pb-24 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-[var(--surface-muted)] rounded-[var(--radius-lg)] border border-[var(--border)] animate-pulse" />
                    ))}
                </div>
            }>
                <CheckoutClient initialData={checkoutData} />
            </Suspense>
        </div>
    );
}
