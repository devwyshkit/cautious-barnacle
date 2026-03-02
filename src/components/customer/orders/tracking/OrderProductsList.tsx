'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Sparkles, Clock, Camera, Package, CheckCircle2, X } from 'lucide-react';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/pricing';
import { ORDER_STATUS, getProductStatusConfig } from '@/lib/types/order-status';
import { PersonalizationForm } from '../PersonalizationForm';
import { SubmittedPersonalization } from './SubmittedPersonalization';
import { PreviewApproval } from '../PreviewApproval';
import { approve_preview, request_change } from '@/lib/actions/commerce/orders';
import { toast } from 'sonner';

import { OrderDetail, PreviewSubmission, OrderProductDetail } from '@/lib/types/order';

interface OrderProductsListProps {
    order: OrderDetail;
    productPreviews: Record<string, PreviewSubmission>;
    onPersonalizationSubmitted: () => void;
}

export function OrderProductsList({ order, productPreviews, onPersonalizationSubmitted }: OrderProductsListProps) {
    const [selectedPreviewProduct, setSelectedPreviewProduct] = useState<OrderProductDetail | null>(null);
    const [isApproving, setIsApproving] = useState(false);
    const [isRequestingChange, setIsRequestingChange] = useState(false);

    const renderProductStatus = (product: OrderProductDetail) => {
        const productStatus = product.status || order.status;
        const config = getProductStatusConfig(productStatus || 'PLACED');
        const Icon = config.icon as any;

        return (
            <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-bold tracking-tight", config.color)}>
                <Icon className="size-3" />
                <span>{config.label}</span>
            </div>
        );
    };

    return (
        <>
            <section className="bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] tracking-tight">Order Contents</h3>
                    <span className="text-xs font-bold text-[var(--text-tertiary)] tabular-nums">#{order.order_number}</span>
                </div>
                <div className="divide-y divide-[var(--surface-muted)]">
                    {(order.order_products as unknown as OrderProductDetail[] || []).map((product) => (
                        <div key={product.id} className="group/product">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPreviewProduct(product);
                                }}
                                className="w-full p-4 flex gap-4 text-left hover:bg-[var(--surface-muted)] active:scale-[0.99] transition-all outline-none relative z-10"
                            >
                                <div className="size-16 bg-[var(--surface-muted)] rounded-[var(--radius-md)] relative overflow-hidden border border-[var(--border)] shrink-0">
                                    {product.product_image_url ? (
                                        <Image
                                            src={product.product_image_url}
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
                                        <p className="text-xs font-bold text-[var(--text-primary)] tabular-nums">x{product.quantity}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        {renderProductStatus(product)}
                                        <span className="text-xs font-bold text-[var(--text-primary)]">{formatCurrency(product.total_price)}</span>
                                    </div>

                                    {/* WYSHKIT 2026: Details Peek (When not in full review) */}
                                    {product.is_personalized && product.personalization_details && product.status !== 'preview_ready' && (
                                        <div className="mt-4 pt-4 border-t border-[var(--surface-muted)]/50">
                                            <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight mb-2">Submitted Brief</p>
                                            <div className="line-clamp-2 text-xs text-[var(--text-secondary)] italic">
                                                {Object.values(product.personalization_details).filter(v => typeof v === 'string').join(', ')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* WYSHKIT 2026: Preview Surface */}
            <ResponsiveSurface
                open={!!selectedPreviewProduct}
                onOpenChange={(open) => !open && setSelectedPreviewProduct(null)}
                className="p-0 sm:max-w-xl h-[85dvh] sm:h-[90dvh] bg-[var(--surface-muted)] border-none"
            >
                {selectedPreviewProduct && productPreviews[selectedPreviewProduct.id] && (
                    <div className="h-full overflow-y-auto overscroll-contain pb-safe scrollbar-hide">
                        <div className="p-4 sticky top-0 bg-[var(--surface)]/80 backdrop-blur-md z-10 border-b border-[var(--border)] flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                                {selectedPreviewProduct.status === 'preview_ready' ? 'Review Design' : 'Product Details'}
                            </h3>
                        </div>
                        <div className="p-4">
                            {selectedPreviewProduct.status === 'preview_ready' ? (
                                <PreviewApproval
                                    preview={productPreviews[selectedPreviewProduct.id]}
                                    orderProduct={selectedPreviewProduct}
                                    onApprove={async () => {
                                        setIsApproving(true);
                                        try {
                                            const result = await approve_preview(productPreviews[selectedPreviewProduct.id].id, order.id!);
                                            if (result.success) {
                                                toast.success('Product approved! Production has started.');
                                                setSelectedPreviewProduct(null);
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
                                                setSelectedPreviewProduct(null);
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
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight px-1">Tracking Status</span>
                                        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-[var(--radius-md)] bg-[var(--surface-muted)] flex items-center justify-center border border-[var(--border)]">
                                                    <Package className="size-5 text-[var(--text-tertiary)]" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-[var(--text-primary)] tracking-tight">{selectedPreviewProduct.status || order.status}</p>
                                                    <p className="text-xs text-[var(--text-secondary)] font-medium">Last updated recently</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedPreviewProduct.is_personalized && (
                                        <div className="space-y-3">
                                            <span className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight px-1">Personalisation Details</span>
                                            {selectedPreviewProduct.personalization_details ? (
                                                <SubmittedPersonalization
                                                    details={selectedPreviewProduct.personalization_details as any}
                                                    itemName={selectedPreviewProduct.product_name}
                                                />
                                            ) : (
                                                <div className="p-8 text-center bg-[var(--surface-muted)] rounded-[var(--radius-md)] border border-[var(--border)]">
                                                    <Sparkles className="size-8 text-[var(--border)] mx-auto mb-3" />
                                                    <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight">Awaiting Personalisation Brief</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </ResponsiveSurface>
        </>
    );
}
