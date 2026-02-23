import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCheckoutData } from '@/lib/actions/checkout/checkout';
import { CheckoutClient } from '@/components/customer/checkout/CheckoutClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth?returnUrl=/checkout');
    }

    const checkoutData = await getCheckoutData();

    // If cart is empty, send back to home
    if (!checkoutData.items || checkoutData.items.length === 0) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            <Suspense fallback={
                <div className="max-w-lg mx-auto px-4 pt-6 pb-24 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-white rounded-2xl border border-zinc-100 animate-pulse" />
                    ))}
                </div>
            }>
                <CheckoutClient initialData={checkoutData} />
            </Suspense>
        </div>
    );
}
