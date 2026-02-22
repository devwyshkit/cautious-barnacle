'use client';

import { useState, useActionState } from 'react';
import { FileText, Download, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateEstimatePDF } from '@/lib/services/pdf-service';
import { getPartnerInfo } from '@/lib/actions/discovery/partners';
import { toast } from 'sonner';

import { DraftLineItem } from '@/lib/types/personalization';
import type { PricingBreakdown } from '@/lib/types/pricing';
import { Address } from '@/lib/types/address';

interface EstimateButtonProps {
    items: DraftLineItem[];
    pricing: PricingBreakdown;
    businessName?: string;
    billingAddress?: Address | null;
    gstin?: string;
    customerName?: string;
}

export function EstimateButton({
    items,
    pricing,
    businessName,
    billingAddress,
    gstin,
    customerName = "Valued Customer"
}: EstimateButtonProps) {
    const [state, dispatch, loading] = useActionState(async () => {

        if (!items.length || !pricing) {
            toast.error("No items in cart");
            return;
        }

        try {
            const partnerId = items[0]?.partner_id;
            if (!partnerId) throw new Error("Partner ID missing");
            const { data: partner } = await getPartnerInfo(partnerId);

            generateEstimatePDF({
                date: new Date().toLocaleDateString(),
                customer_name: customerName,
                business_name: businessName,
                billing_address: billingAddress,
                gstin,
                partner: partner
                    ? {
                        name: partner.name,
                        address: partner.address || 'Bangalore, India',
                        gstin: partner.gstin || undefined,
                    }
                    : { name: 'Partner', address: 'Bangalore, India' },
                totals: {
                    item_total: pricing.subtotal,
                    delivery_fee: pricing.delivery_fee,
                    platform_fee: pricing.platform_fee || 0,
                    gst_amount: pricing.gst || 0,
                    grand_total: pricing.total,
                    discount: pricing.discount || 0
                },
                order_items: items.map(it => ({
                    id: it.id || '',
                    item_id: it.item_id,
                    item_name: it.item_name || 'Product',
                    quantity: it.quantity,
                    quantity_number: it.quantity,
                    unit_price: it.unit_price,
                    total_price: it.total_price,
                    is_personalized: it.is_personalized || false,
                    status: 'DRAFT'
                }))
            });

            toast.success("Estimate downloaded");
        } catch (err) {
            toast.error("Failed to generate estimate");
        }
    }, null);

    return (
        <form action={dispatch} className="flex flex-col gap-3">
            <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <Info className="size-4 text-zinc-400 mt-0.5" />
                <p className="text-xs font-bold text-zinc-500 leading-relaxed tracking-wider">
                    Need a pro-forma estimate for your business? Click below to generate a PDF.
                </p>
            </div>
            <Button
                type="submit"
                disabled={loading}
                variant="outline"
                className="w-full h-14 rounded-2xl border-2 border-zinc-100 hover:border-zinc-900 gap-3 font-black tracking-wider text-[11px]"
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
