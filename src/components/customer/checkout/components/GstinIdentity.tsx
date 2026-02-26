'use client';

import { useState } from 'react';
import { ShieldCheck, Loader2, Check, XCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateGSTINAction } from '@/lib/actions/commerce/gstin';
import { toast } from 'sonner';
import { generateEstimatePDF } from '@/lib/services/pdf-service';
import { getVendorInfo } from '@/lib/actions/discovery/vendors';
import { CartProduct } from '@/lib/types/personalization';
import type { PricingBreakdown } from '@/lib/types/pricing';
import { Address } from '@/lib/types/address';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import type { User } from '@supabase/supabase-js';

interface GstinIdentityProps {
    initialGstin: string;
    products: CartProduct[];
    pricing: PricingBreakdown;
    user: User | null;
    selectedAddress: Address | null;
    onGstinChange?: (gstin: string) => void;
    onBusinessNameUpdate?: (name: string | null) => void;
}

/**
 * WYSHKIT 2026: Tax Identity & Business Trust
 * Handles GSTIN validation and Estimate generation.
 */
export function GstinIdentity({
    initialGstin,
    products,
    pricing,
    user,
    selectedAddress,
    onGstinChange,
    onBusinessNameUpdate
}: GstinIdentityProps) {
    const [gstin, setGstin] = useState(initialGstin);
    const [validation, setValidation] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [businessName, setBusinessName] = useState<string | null>(null);

    const handleBlur = async () => {
        const trimmed = gstin.trim();
        if (!trimmed) {
            setValidation('idle');
            setError(null);
            onBusinessNameUpdate?.(null);
            return;
        }
        setValidation('validating');
        setError(null);
        try {
            const result = await validateGSTINAction(trimmed);
            if (result.valid) {
                setValidation('valid');
                setError(null);
                setBusinessName(result.businessName ?? null);
                onBusinessNameUpdate?.(result.businessName ?? null);
                if (result.businessName) {
                    toast.success(`Verified: ${result.businessName}`);
                }
            } else {
                setValidation('invalid');
                setError(result.error ?? 'Invalid GSTIN');
                setBusinessName(null);
                onBusinessNameUpdate?.(null);
            }
        } catch (err) {
            setValidation('invalid');
            setError('Verification failed');
        }
    };

    const handleDownloadEstimate = async () => {
        const firstItem = products[0];
        const vendorId = firstItem.vendor_id;
        if (!vendorId) {
            toast.error("Vendor information missing");
            return;
        }

        const { data: vendor } = await getVendorInfo(vendorId);

        generateEstimatePDF({
            date: new Date().toLocaleDateString(),
            customer_name: user?.user_metadata?.full_name || user?.email || "Valued Customer",
            business_name: businessName || undefined,
            billing_address: selectedAddress,
            gstin: gstin || undefined,
            vendor: vendor
                ? {
                    name: vendor.name,
                    address: vendor.address || 'Bangalore, India',
                    gstin: vendor.gstin || undefined,
                }
                : { name: 'Vendor', address: 'Bangalore, India' },
            totals: {
                product_total: pricing.subtotal,
                delivery_fee: pricing.delivery_fee,
                platform_fee: pricing.platform_fee || 0,
                gst_amount: pricing.gst || 0,
                grand_total: pricing.total,
                discount: pricing.discount || 0
            },
            order_products: products.map(it => ({
                id: it.id || '',
                product_id: it.product_id || '',
                product_name: it.product_name || 'Product',
                quantity: it.quantity,
                quantity_number: it.quantity,
                unit_price: it.unit_price,
                total_price: it.line_total,
                is_personalized: it.is_personalized || false,
                status: 'DRAFT'
            }))
        });

        toast.success("Estimate downloaded");
    };

    return (
        <div className="p-4 rounded-xl border bg-zinc-50/50 border-zinc-100">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="size-4 text-zinc-900" />
                        <span className="text-xs font-bold tracking-tight text-zinc-900">Tax Identity (GSTIN)</span>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 tracking-tighter">Save with Tax Credit</span>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={gstin}
                        onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            setGstin(val);
                            onGstinChange?.(val);
                            if (validation !== 'idle') setValidation('idle');
                            setError(null);
                        }}
                        onBlur={handleBlur}
                        placeholder="Enter 15-digit GSTIN"
                        className={cn(
                            "w-full h-10 pl-3 pr-10 bg-white border rounded-lg text-xs font-bold placeholder:text-zinc-300 focus:outline-none transition-all",
                            validation === 'invalid' ? "border-rose-200 bg-rose-50" : "border-zinc-200 focus:border-zinc-900"
                        )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {validation === 'validating' && <Loader2 className="size-3 text-zinc-400 animate-spin" />}
                        {validation === 'valid' && <Check className="size-3 text-emerald-500 stroke-[3]" />}
                        {validation === 'invalid' && <XCircle className="size-3 text-rose-500" />}
                    </div>
                </div>
                {businessName && (
                    <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                        <Check className="size-3 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700 tracking-tight">{businessName} verified</span>
                    </div>
                )}
                {error && <p className="text-xs text-rose-600 font-bold">{error}</p>}

                <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-zinc-400">Claims input tax credit</p>
                    <button
                        type="button"
                        onClick={handleDownloadEstimate}
                        className="flex items-center gap-1.5 text-xs font-bold tracking-tight text-zinc-900 hover:underline transition-all"
                    >
                        <FileText className="size-3" />
                        Get Estimate
                    </button>
                </div>
            </div>
        </div>
    );
}
