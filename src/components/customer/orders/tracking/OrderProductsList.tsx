import React from 'react';
import Image from 'next/image';
import { ShoppingBag, Sparkles, Package, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/pricing';
import { getOrderStatusDisplay, getOrderStatusColor } from '@/lib/types/order-status';
import { SubmittedPersonalization } from './SubmittedPersonalization';

import { OrderDetail, PreviewSubmission, OrderProductDetail } from '@/lib/types/order';

interface OrderProductsListProps {
    order: OrderDetail;
    productPreviews: Record<string, PreviewSubmission>;
    onPersonalizationSubmitted: () => void;
    selectedPreviewProduct?: OrderProductDetail | null;
    setSelectedPreviewProduct?: (product: OrderProductDetail | null) => void;
}

export function OrderProductsList({ order, productPreviews, onPersonalizationSubmitted, selectedPreviewProduct, setSelectedPreviewProduct }: OrderProductsListProps) {
    const products = (order.order_products as unknown as OrderProductDetail[] || []);

    // Determine the label & color for a product status pill.
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

    return (
        <section className="bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                <h3 className="text-xs font-bold text-[var(--text-primary)] tracking-tight">Check order items</h3>
                <span className="text-xs font-bold text-[var(--text-tertiary)] tabular-nums">{order.order_number}</span>
            </div>
            <div className="divide-y divide-[var(--surface-muted)]">
                {products.map((product) => {
                    const isExpanded = selectedPreviewProduct?.id === product.id;
                    const hasPreview = productPreviews[product.id];
                    const isNonPersonalized = !product.is_personalized;
                    const isExpandable = !isNonPersonalized || !!hasPreview;

                    const hasSubmittedDetails = product.personalization_details &&
                        typeof product.personalization_details === 'object' &&
                        Object.keys(((product.personalization_details as any)?.fields) || {}).length > 0;

                    const variantOptions = product.selected_variant_options ?
                        Object.entries(product.selected_variant_options as Record<string, string>) : [];

                    return (
                        <div key={product.id} className="group/product overflow-hidden">
                            <button
                                onClick={() => isExpandable && setSelectedPreviewProduct?.(isExpanded ? null : product)}
                                className={cn(
                                    "w-full p-4 flex gap-4 text-left transition-all outline-none",
                                    isExpandable && !isExpanded && "hover:bg-[var(--surface-muted)]/60 active:scale-[0.99] cursor-pointer",
                                    isExpanded && "bg-[var(--surface-muted)]/40",
                                    !isExpandable && "cursor-default"
                                )}
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
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 leading-tight">{product.product_name}</p>
                                            {variantOptions.length > 0 && (
                                                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mt-1 truncate">
                                                    {variantOptions.map(([label, value]) => `${label}: ${value}`).join(' • ')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <p className="text-xs font-bold text-[var(--text-primary)] tabular-nums">x{product.quantity}</p>
                                            {isExpandable && (
                                                isExpanded ? <ChevronUp className="size-3 text-[var(--text-tertiary)]" /> : <ChevronDown className="size-3 text-[var(--text-tertiary)]" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        {renderStatusPill(product)}
                                        <span className="text-xs font-bold text-[var(--text-primary)]">{formatCurrency(product.total_price)}</span>
                                    </div>
                                </div>
                            </button>

                            {/* WYSHKIT 2026: Inline Expansion Surface */}
                            {isExpanded && (
                                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="p-4 bg-[var(--surface-muted)]/50 rounded-[var(--radius-md)] border border-[var(--border)] space-y-4">
                                        {/* 1. Context Message */}
                                        {(!isNonPersonalized || hasPreview) && (
                                            <div className="space-y-4">
                                                {/* 2. Personalization Brief */}
                                                {!isNonPersonalized && (
                                                    hasSubmittedDetails ? (
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Detail Snapshot</p>
                                                            <SubmittedPersonalization
                                                                details={product.personalization_details}
                                                                itemName={product.product_name}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col gap-3 p-4 bg-[var(--well-warning)] rounded-[var(--radius-sm)] border border-[var(--warning)]/10">
                                                            <div className="flex items-start gap-3">
                                                                <Sparkles className="size-4 text-[var(--warning)] shrink-0" />
                                                                <p className="text-xs font-bold text-[var(--text-secondary)]">
                                                                    Add preferences to help the vendor craft your gift.
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onPersonalizationSubmitted();
                                                                }}
                                                                className="w-full py-2.5 bg-[var(--primary)] text-[var(--text-inverse)] rounded-[var(--radius-md)] text-xs font-bold active:scale-95 transition-all shadow-sm"
                                                            >
                                                                Add Details Now
                                                            </button>
                                                        </div>
                                                    )
                                                )}

                                                {/* 3. Image Preview */}
                                                {hasPreview && (
                                                    <div className="space-y-3 pt-2">
                                                        <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Vendor Preview</p>
                                                        <div className="aspect-[4/5] relative rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
                                                            <Image
                                                                src={hasPreview.preview_url}
                                                                alt="Design Preview"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        {product.status === 'preview_ready' && (
                                                            <div className="flex items-center gap-2 p-3 bg-[var(--well-success)] rounded-[var(--radius-sm)] border border-[var(--success)]/10">
                                                                <CheckCircle2 className="size-4 text-[var(--success)]" />
                                                                <p className="text-xs font-bold text-[var(--text-primary)]">Preview is ready for approval above.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
