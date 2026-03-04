'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Sparkles, Package, CheckCircle2 } from 'lucide-react';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/pricing';
import { getOrderStatusDisplay, getOrderStatusColor } from '@/lib/types/order-status';
import { SubmittedPersonalization } from './SubmittedPersonalization';
import { PreviewApproval } from '../PreviewApproval';
import { approve_preview, request_change } from '@/lib/actions/commerce/orders';
import { toast } from 'sonner';

import { OrderDetail, PreviewSubmission, OrderProductDetail } from '@/lib/types/order';

interface OrderProductsListProps {
    order: OrderDetail;
    productPreviews: Record<string, PreviewSubmission>;
    onPersonalizationSubmitted: () => void;
    selectedPreviewProduct?: OrderProductDetail | null;
    setSelectedPreviewProduct?: (product: OrderProductDetail | null) => void;
}

export function OrderProductsList({ order, productPreviews, onPersonalizationSubmitted, selectedPreviewProduct, setSelectedPreviewProduct }: OrderProductsListProps) {
    const [isApproving, setIsApproving] = useState(false);
    const [isRequestingChange, setIsRequestingChange] = useState(false);

    const products = (order.order_products as unknown as OrderProductDetail[] || []);

    // Determine the label & color for a product status pill.
    // Non-personalized products stuck at PENDING_PERSONALIZATION should show the parent order status.
    const getProductStatusDisplay = (product: OrderProductDetail) => {
        const rawStatus = (!product.is_personalized && product.status === 'PENDING_PERSONALIZATION')
            ? (order.status || 'PLACED')
            : (product.status || order.status || 'PLACED');
        return { label: getOrderStatusDisplay(rawStatus), colorClass: getOrderStatusColor(rawStatus) };
    };

    const renderStatusPill = (product: OrderProductDetail) => {
        const { label, colorClass } = getProductStatusDisplay(product);
        return (
            <div className={cn('flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-tight', colorClass)}>
                <Package className="size-2.5" />
                <span>{label}</span>
            </div>
        );
    };

    const hasPreview = selectedPreviewProduct && productPreviews[selectedPreviewProduct.id];
    const isNonPersonalized = selectedPreviewProduct && !selectedPreviewProduct.is_personalized;
    const hasSubmittedDetails = selectedPreviewProduct &&
        selectedPreviewProduct.personalization_details &&
        typeof selectedPreviewProduct.personalization_details === 'object' &&
        Object.keys(((selectedPreviewProduct.personalization_details as any)?.fields) || {}).length > 0;

    return (
        <>
            <section className="bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] tracking-tight">Order Contents</h3>
                    <span className="text-xs font-bold text-[var(--text-tertiary)] tabular-nums">{order.order_number}</span>
                </div>
                <div className="divide-y divide-[var(--surface-muted)]">
                    {products.map((product) => (
                        <div key={product.id} className="group/product">
                            <button
                                onClick={() => setSelectedPreviewProduct?.(product)}
                                className="w-full p-4 flex gap-4 text-left hover:bg-[var(--surface-muted)]/60 active:scale-[0.99] transition-all outline-none"
                            >
                                <div className="size-16 bg-[var(--surface-muted)] rounded-[var(--radius-md)] relative overflow-hidden border border-[var(--border)] shrink-0">
                                    {(product as any).product_image_url ? (
                                        <Image
                                            src={(product as any).product_image_url}
                                            alt={product.product_name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="size-full flex items-center justify-center">
                                            <ShoppingBag className="size-6 text-[var(--border)]" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 leading-tight">{product.product_name}</p>
                                        <p className="text-xs font-bold text-[var(--text-primary)] tabular-nums shrink-0">x{product.quantity}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        {renderStatusPill(product)}
                                        <span className="text-xs font-bold text-[var(--text-primary)]">{formatCurrency(product.total_price)}</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* WYSHKIT 2026: Product Detail Surface — Always shows when a product is selected */}
            <ResponsiveSurface
                open={!!selectedPreviewProduct}
                onOpenChange={(open) => !open && setSelectedPreviewProduct?.(null)}
                title={selectedPreviewProduct?.product_name || 'Product Details'}
                className="p-0 sm:max-w-xl h-[85dvh] sm:h-[90dvh]"
            >
                {selectedPreviewProduct && (
                    <div className="h-full overflow-y-auto overscroll-contain pb-safe scrollbar-hide">
                        {/* Product Header */}
                        <div className="p-5 border-b border-[var(--border)] bg-[var(--surface)] flex items-start gap-4">
                            <div className="size-16 bg-[var(--surface-muted)] rounded-[var(--radius-md)] border border-[var(--border)] relative overflow-hidden shrink-0">
                                {(selectedPreviewProduct as any).product_image_url ? (
                                    <Image src={(selectedPreviewProduct as any).product_image_url} alt={selectedPreviewProduct.product_name} fill className="object-cover" />
                                ) : (
                                    <div className="size-full flex items-center justify-center">
                                        <ShoppingBag className="size-7 text-[var(--border)]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-bold text-[var(--text-primary)] tracking-tight leading-tight">{selectedPreviewProduct.product_name}</p>
                                <div className="flex items-center justify-between mt-2">
                                    {renderStatusPill(selectedPreviewProduct)}
                                    <span className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(selectedPreviewProduct.total_price)}</span>
                                </div>
                                <p className="text-xs text-[var(--text-tertiary)] font-bold mt-1.5">Qty: {selectedPreviewProduct.quantity} unit{selectedPreviewProduct.quantity > 1 ? 's' : ''}</p>
                            </div>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* 1. Non-personalized product — clear status card */}
                            {isNonPersonalized && (
                                <div className="p-4 bg-[var(--surface-muted)] rounded-[var(--radius-md)] border border-[var(--border)] flex items-start gap-3">
                                    <CheckCircle2 className="size-5 text-[var(--success)] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-[var(--text-primary)] tracking-tight">No personalisation required</p>
                                        <p className="text-xs font-bold text-[var(--text-tertiary)] mt-1 leading-relaxed">
                                            This item will be prepared as-is. No action needed from you — the vendor handles everything.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 2. Personalized with preview ready — show approval flow */}
                            {hasPreview && selectedPreviewProduct.status === 'preview_ready' && (
                                <PreviewApproval
                                    preview={productPreviews[selectedPreviewProduct.id]}
                                    orderProduct={selectedPreviewProduct}
                                    onApprove={async () => {
                                        setIsApproving(true);
                                        try {
                                            const result = await approve_preview(productPreviews[selectedPreviewProduct.id].id, order.id!);
                                            if (result.success) {
                                                toast.success('Product approved! Production has started.');
                                                setSelectedPreviewProduct?.(null);
                                            } else {
                                                toast.error(result.error ?? 'Failed to approve');
                                            }
                                            return result;
                                        } catch {
                                            toast.error('Something went wrong');
                                            return { success: false };
                                        } finally {
                                            setIsApproving(false);
                                        }
                                    }}
                                    onRequestChange={async (feedback: string) => {
                                        setIsRequestingChange(true);
                                        try {
                                            const result = await request_change(productPreviews[selectedPreviewProduct.id].id, order.id!, feedback);
                                            if (result.success) {
                                                toast.success('Feedback sent. Vendor will upload a new preview.');
                                                setSelectedPreviewProduct?.(null);
                                            } else {
                                                toast.error(result.error ?? 'Failed to send feedback');
                                            }
                                            return result;
                                        } catch {
                                            toast.error('Something went wrong');
                                            return { success: false };
                                        } finally {
                                            setIsRequestingChange(false);
                                        }
                                    }}
                                    isApproving={isApproving || isRequestingChange}
                                    maxChanges={order.max_change_requests ?? 2}
                                    changeCount={order.change_request_count ?? 0}
                                />
                            )}

                            {/* 3. Personalized — brief submitted, waiting for preview */}
                            {selectedPreviewProduct.is_personalized && hasSubmittedDetails && !hasPreview && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight uppercase">Brief Submitted</p>
                                    <SubmittedPersonalization
                                        details={selectedPreviewProduct.personalization_details as any}
                                        itemName={selectedPreviewProduct.product_name}
                                    />
                                    <div className="flex items-center gap-2 p-3 bg-[var(--surface-muted)] rounded-[var(--radius-md)] border border-[var(--border)]">
                                        <div className="size-2 rounded-full bg-[var(--success)] animate-pulse" />
                                        <p className="text-xs font-bold text-[var(--text-secondary)] tracking-tight">Vendor is preparing your design preview</p>
                                    </div>
                                </div>
                            )}

                            {/* 4. Personalized — brief not yet submitted */}
                            {selectedPreviewProduct.is_personalized && !hasSubmittedDetails && !hasPreview && (
                                <div className="p-4 bg-[var(--well-warning)] rounded-[var(--radius-md)] border border-[var(--warning)]/20 flex items-start gap-3">
                                    <Sparkles className="size-5 text-[var(--warning)] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-[var(--text-primary)] tracking-tight">Personalisation brief needed</p>
                                        <p className="text-xs font-bold text-[var(--text-tertiary)] mt-1 leading-relaxed">
                                            Close this panel and scroll up to fill in your personalisation details so the vendor can start your design.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </ResponsiveSurface>
        </>
    );
}
