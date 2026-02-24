'use client';

import { useState, useActionState } from 'react';
import { FileText, Download, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateEstimatePDF } from '@/lib/services/pdf-service';
import { getPartnerInfo } from '@/lib/actions/discovery/vendors';
import { toast } from 'sonner';

import { DraftLineItem } from '@/lib/types/personalization';
import type { PricingBreakdown } from '@/lib/types/pricing';
import { Address } from '@/lib/types/address';

interface EstimateButtonProps {
    products: DraftLineItem[];
    pricing: PricingBreakdown;
    businessName?: string;
    billingAddress?: Address | null;
    gstin?: string;
    customerName?: string;
}

export function EstimateButton({
    products,
    pricing,
    businessName,
    billingAddress,
    gstin,
    customerName = "Valued Customer"
}: EstimateButtonProps) {
    const [state, dispatch, loading] = useActionState(async () => {

        if (!products.length || !pricing) {
            toast.error("No products in cart");
            return;
        }

        try {
            const partnerId = products[0]?.vendor_id;
            if (!partnerId) throw new Error("Vendor ID missing");
            const { data: vendor } = await getPartnerInfo(partnerId);

            generateEstimatePDF({
                date: new Date().toLocaleDateString(),
                customer_name: customerName,
                business_name: businessName,
                billing_address: billingAddress,
                gstin,
                vendor: vendor
                    ? {
                        name: vendor.name,
                        address: vendor.address || 'Bangalore, India',
                        gstin: vendor.gstin || undefined,
                    }
                    : { name: 'Vendor', address: 'Bangalore, India' },
                totals: {
                    item_total: pricing.subtotal,
                    delivery_fee: pricing.delivery_fee,
                    platform_fee: pricing.platform_fee || 0,
                    gst_amount: pricing.gst || 0,
                    grand_total: pricing.total,
                    discount: pricing.discount || 0
                },
                order_products: products.map(it => ({
                    id: it.id,
                    product_id: it.product_id,
                    product_name: it.product_name,
                    quantity: it.quantity,
                    quantity_number: it.quantity,
                    unit_price: it.unit_price,
                    total_price: it.line_total,
                    is_personalized: it.is_personalized,
                    status: 'pending'
                }))
            });

            toast.success("Estimate downloaded");
        } catch (err) {
            toast.error("Failed to generate estimate");
        }
    }, null);

    return (
        <form action={dispatch} className="flex flex-col gap-3">
            <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <Info className="size-4 text-zinc-400 mt-0.5" />
                <p className="text-xs font-bold text-zinc-500 leading-relaxed tracking-tight">
                    Need a pro-forma estimate for your business? Click below to generate a PDF.
                </p>
            </div>
            <Button
                type="submit"
                disabled={loading}
                variant="outline"
                className="w-full h-14 rounded-xl border-2 border-zinc-100 hover:border-zinc-900 gap-3 font-black tracking-tight text-[11px]"
            >
                {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <FileText className="size-4" />
                )}
                Get Estimate PDF
            </Button>
        </form>
    );
}
