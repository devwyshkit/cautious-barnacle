'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ArrowLeft, Minus, Plus, ShoppingBag, Store, Clock, Star, Heart, TrendingUp, Sparkles, AlertCircle, Loader2, Info, Snowflake, PlayCircle, AlertTriangle, Check, ShieldCheck } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useCart, CartActionResult } from '@/components/customer/CartProvider';

import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { formatCurrency } from '@/lib/utils/pricing';

const FALLBACK_IMAGE = '/images/logo.png';

import { WyshkitProduct } from '@/lib/types/product';
import { Badge } from '@/components/ui/ProductBadge';

interface ProductDetailViewProps {
    product: WyshkitProduct;
    onBack?: () => void;
    /** When in sheet from vendor page, pass for optional View cart CTA. */
    vendorId?: string;
    /** Initial state for Edit mode from Checkout */
    initialState?: {
        variantId?: string | null;
        quantity?: number;
        addonIds?: string[];
        cartProductId?: string;
    };
}

export function ProductDetailView({ product, onBack, vendorId, initialState }: ProductDetailViewProps) {
    const router = useRouter();

    const { addToDraftOrder, isPending, draftOrder } = useCart();
    const [continuing, setContinuing] = useState(false);
    const [quantity, setQuantity] = useState(initialState?.quantity ?? 1);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(initialState?.variantId ?? null);
    const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(new Set(initialState?.addonIds ?? []));
    const [isPersonalizationEnabled, setIsPersonalizationEnabled] = useState(initialState?.addonIds?.some(id => id === 'wysh_personalization') ?? false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Default to first variant if needed
    useEffect(() => {
        const variants = Array.isArray(product?.variants) ? product.variants : [];
        if (variants.length > 0 && selectedVariantId == null) {
            setSelectedVariantId(String(variants[0].id));
        }
    }, [product?.variants, selectedVariantId]);

    const handleBack = useCallback(() => {
        triggerHaptic(HapticPattern.ACTION);
        if (onBack) onBack();
        else router.back();
    }, [onBack, router]);


    const variantsArray = Array.isArray(product?.variants) ? product.variants : [];
    // WYSHKIT 2026: Strictly defined personalization as a post-payment service
    const hasPersonalizationService = !!product.has_personalization;
    const personalizationPrice = product.personalization_fee || 0;

    const selectedVariant = variantsArray.find((v: any) => String(v.id) === selectedVariantId) || null;

    const selectedAddons = useMemo(() => {
        // WYSHKIT 2026: Combined Add-ons (Limit 8 total)
        return []; // Simple list for now
    }, []);

    const isOutOfStock = useMemo(() => {
        if (variantsArray.length > 0) {
            return !selectedVariant || (typeof selectedVariant.stock_quantity === 'number' && selectedVariant.stock_quantity <= 0);
        }
        return typeof product.stock_quantity === 'number' && product.stock_quantity <= 0;
    }, [variantsArray.length, selectedVariant, product.stock_quantity]);

    const canAdd = (variantsArray.length === 0 || selectedVariantId != null) && !isOutOfStock;

    const unitPrice = useMemo(() => {
        const basePrice = Number(product.base_price) || 0;
        return selectedVariant ? (Number(selectedVariant.price) || 0) : basePrice;
    }, [product.base_price, selectedVariant]);


    const isEditMode = !!initialState?.cartProductId;

    const handleAddToCart = async () => {
        if (continuing) return;

        setContinuing(true);
        try {
            const allSelectedAddons = Array.from(selectedAddonIds).map(id => ({
                id,
                name: id === 'wysh_personalization' ? 'Personalisation Service' : 'Add-on',
                price: id === 'wysh_personalization' ? personalizationPrice : 0,
                requires_preview: id === 'wysh_personalization'
            }));

            const result = await addToDraftOrder(
                product.id,
                selectedVariantId,
                {
                    enabled: isPersonalizationEnabled,
                    fields: {} // EMPTY: To be filled post-payment in tracking
                },
                allSelectedAddons,
                quantity,
                {
                    product_name: product.name,
                    product_image: product.images?.[0] || FALLBACK_IMAGE,
                    unit_price: Number(unitPrice) || 0,
                    vendor_id: product.vendor_id!,
                    vendor_name: product.vendor_name || 'Store',
                    update_product_id: initialState?.cartProductId
                }
            );

            if (result && result.success) {
                triggerHaptic(HapticPattern.SUCCESS);
                if (onBack) onBack();
                else router.back();
            } else if (result && result.code === 'VENDOR_MISMATCH') {
            } else if (result && result.error) {
                toast.error(result.error || "Could not save changes");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setContinuing(false);
        }
    };


    const images = useMemo(() => {
        if (selectedVariant?.images?.length) return selectedVariant.images;
        if (product.images?.length) return product.images;
        return [FALLBACK_IMAGE];
    }, [selectedVariant, product.images]);

    return (
        <div className="flex flex-col h-full min-h-0 bg-[var(--surface)] font-sans overflow-hidden">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Immersive Navigation Bar */}
                <div className="sticky top-0 left-0 right-0 z-[var(--z-nav)] p-4 pointer-events-none">
                    <button
                        onClick={handleBack}
                        className="size-11 rounded-full bg-[var(--surface)]/80 backdrop-blur-md shadow-sm flex items-center justify-center pointer-events-auto active:scale-90 transition-all border border-[var(--border)]"
                        aria-label="Back"
                    >
                        <ArrowLeft className="size-5 text-[var(--text-primary)]" />
                    </button>
                </div>

                {/* Image Section - Instamart Standard Aspect Ratio */}
                <div className="relative bg-[var(--surface)] w-full aspect-square md:aspect-[4/3]">
                    <div
                        ref={imageContainerRef}
                        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
                        onScroll={(e) => {
                            const width = e.currentTarget.offsetWidth;
                            const scrollLeft = e.currentTarget.scrollLeft;
                            const index = Math.round(scrollLeft / width);
                            if (index !== activeImageIndex) setActiveImageIndex(index);
                        }}
                    >
                        {images.map((img: string, idx: number) => (
                            <div key={idx} className="w-full h-full min-w-full flex-shrink-0 snap-center snap-always relative bg-[var(--surface-muted)]">
                                <ImageWithFallback
                                    src={img || FALLBACK_IMAGE}
                                    alt={`${product.name} - ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={idx === 0}
                                    sizes="(max-width: 768px) 100vw, 540px"
                                />
                            </div>
                        ))}
                    </div>

                    {product.video_url && (
                        <button
                            onClick={(e) => { e.stopPropagation(); window.open(product.video_url!, '_blank'); }}
                            className="absolute bottom-6 right-6 z-10 size-12 rounded-full bg-[var(--surface)]/90 backdrop-blur-md shadow-sm flex items-center justify-center hover:bg-[var(--surface)] active:scale-95 transition-all text-[var(--text-primary)] border border-[var(--border)]"
                        >
                            <PlayCircle className="size-7" />
                        </button>
                    )}

                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-6 flex gap-1.5 z-10 p-2 rounded-full bg-[var(--foreground)]/30 backdrop-blur-md border border-[var(--border)]/20">
                            {images.map((_img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setActiveImageIndex(idx);
                                        imageContainerRef.current?.scrollTo({ left: idx * imageContainerRef.current.clientWidth, behavior: 'smooth' });
                                    }}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all",
                                        idx === activeImageIndex ? "bg-[var(--surface)] w-4" : "bg-[var(--surface)]/40"
                                    )}
                                    aria-label={`View product image ${idx + 1}`}
                                    aria-current={idx === activeImageIndex ? 'true' : 'false'}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-4 py-5 space-y-6">
                    {/* Header Info */}
                    <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-[var(--text-secondary)]">{product.category_name || 'Product'}</p>
                                    <div className="size-1 rounded-full bg-[var(--border)]" />
                                    <p className="text-sm font-medium text-[var(--text-secondary)]">{product.vendor_name || product.vendors?.name || 'Store'}</p>
                                </div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] leading-tight tracking-tight">
                                    {product.name}
                                </h2>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                                <span className="text-2xl font-bold text-[var(--primary)] tabular-nums">
                                    {formatCurrency(unitPrice)}
                                </span>
                                {product.mrp && product.mrp > unitPrice && (
                                    <span className="text-sm text-[var(--text-tertiary)] line-through tabular-nums decoration-[var(--border)]">
                                        {formatCurrency(product.mrp)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Elite Signals (Urgency & Scarcity) */}
                        {product.elite_signals && (
                            <div className="flex flex-wrap gap-2">
                                {product.elite_signals.urgency_signal && (
                                    <Badge type="delivery" value={product.elite_signals.urgency_signal} className="animate-pulse" />
                                )}
                                {product.elite_signals.delivery_signal && (
                                    <Badge type="fulfillment" value={product.elite_signals.delivery_signal} />
                                )}
                                {product.elite_signals.badges?.map((badge, idx) => (
                                    <Badge
                                        key={idx}
                                        type={badge.variant === 'fast' ? 'delivery' : 'status'}
                                        value={badge.text}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            {/* Physical Transparency Chips - Law 7 Mandatory */}
                            {product.dimensions && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)]">
                                    {typeof product.dimensions === 'string' ? product.dimensions : 'Custom Size'}
                                </span>
                            )}
                            {product.material && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)]">
                                    {product.material}
                                </span>
                            )}
                            {product.is_cold && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--well-info)] px-3 py-1 text-xs font-bold text-[var(--well-info-text)] border border-[var(--well-info-text)]/20">
                                    <Snowflake className="size-2.5" />
                                    <span>Chilled</span>
                                </span>
                            )}
                            {product.preview_time_minutes !== undefined && product.preview_time_minutes !== null && product.preview_time_minutes > 0 && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--text-primary)] text-[var(--background)] rounded-full shadow-sm">
                                    <Sparkles className="size-3 text-[var(--warning)]" />
                                    <span className="text-xs font-semibold">{product.preview_time_minutes} min preview</span>
                                </div>
                            )}
                            {product.production_time_minutes !== undefined && product.production_time_minutes !== null && product.production_time_minutes > 0 && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--surface-muted)] text-[var(--text-primary)] rounded-full border border-[var(--border)]">
                                    <Clock className="size-3" />
                                    <span className="text-xs font-semibold">Ready in {product.production_time_minutes}m</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Variants Selection - Swiggy Chip Strategy */}
                    {variantsArray.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-[var(--text-primary)]">Select Option</h3>
                                <span className="text-xs font-medium text-[var(--warning)]">Required</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {variantsArray.slice(0, 16).map((v: any) => {
                                    const isSelected = selectedVariantId === String(v.id);
                                    const isOutOfStock = typeof v.stock_quantity === 'number' && v.stock_quantity <= 0;
                                    return (
                                        <button
                                            key={v.id}
                                            disabled={isOutOfStock}
                                            onClick={() => {
                                                if (isOutOfStock) return;
                                                setSelectedVariantId(String(v.id));
                                                triggerHaptic(HapticPattern.ACTION);
                                            }}
                                            className={cn(
                                                "px-4 py-2 rounded-full border text-xs font-medium transition-all active:scale-95",
                                                isSelected
                                                    ? "bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--background)] shadow-sm"
                                                    : isOutOfStock
                                                        ? "bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-tertiary)] cursor-not-allowed"
                                                        : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]"
                                            )}
                                        >
                                            <span className="mr-2">{v.name}</span>
                                            <span className={cn(
                                                "font-bold tabular-nums",
                                                isSelected ? "opacity-90" : "text-[var(--text-tertiary)]"
                                            )}>
                                                {formatCurrency(v.price || 0)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Personalization Section (Post-Payment Strategy) */}
                    {hasPersonalizationService && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-medium text-[var(--text-primary)] tracking-tight">Add Personalisation</h3>
                                    <Sparkles className="size-3.5 text-[var(--warning)]" />
                                </div>
                                <span className="text-xs font-bold text-[var(--primary)]">{formatCurrency(personalizationPrice)}</span>
                            </div>

                            <button
                                onClick={() => {
                                    setIsPersonalizationEnabled(!isPersonalizationEnabled);
                                    const next = new Set(selectedAddonIds);
                                    if (isPersonalizationEnabled) next.delete('wysh_personalization');
                                    else { next.add('wysh_personalization'); triggerHaptic(HapticPattern.SUCCESS); }
                                    setSelectedAddonIds(next);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-[var(--radius-lg)] border transition-all active:scale-[0.99]",
                                    isPersonalizationEnabled
                                        ? "bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--background)] shadow-[var(--shadow-md)]"
                                        : "bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-secondary)]"
                                )}
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "size-5 rounded-[var(--radius-sm)] border flex items-center justify-center transition-colors",
                                            isPersonalizationEnabled ? "bg-[var(--surface)] border-[var(--background)]" : "bg-[var(--surface)] border-[var(--border)]"
                                        )}>
                                            {isPersonalizationEnabled && <Check className="size-3 text-[var(--text-primary)]" strokeWidth={4} />}
                                        </div>
                                        <span className="text-sm font-medium">Make it special</span>
                                    </div>
                                    <p className={cn(
                                        "text-[10px] font-bold tracking-tight pl-8",
                                        isPersonalizationEnabled ? "text-[var(--text-inverse)]/70" : "text-[var(--text-tertiary)]"
                                    )}>
                                        Details will be collected post-payment
                                    </p>
                                </div>
                            </button>
                        </section>
                    )}

                    {/* description for the fixed footer */}
                    <div className="h-4" />

                    {/* Technical Metadata Table */}
                    <section className="space-y-4 pt-6 border-t border-[var(--border)]">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight px-1">Specifications</h3>
                        <div className="grid grid-cols-1 gap-2 bg-[var(--surface-muted)]/50 rounded-[var(--radius-lg)] p-2 border border-[var(--border)]">
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]/50">
                                <span className="text-xs font-medium text-[var(--text-secondary)] tracking-tight">Dimensions</span>
                                <span className="text-xs font-medium text-[var(--text-primary)]">
                                    {product.dimensions ? (typeof product.dimensions === 'string' ? product.dimensions : JSON.stringify(product.dimensions).replace(/["{}]/g, '').replace(/:/g, ': ')) : '–'}
                                </span>
                            </div>
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]/50">
                                <span className="text-xs font-medium text-[var(--text-secondary)] tracking-tight">Weight</span>
                                <span className="text-xs font-medium text-[var(--text-primary)]">
                                    {product.weight_kg ? `${product.weight_kg} kg` : '–'}
                                </span>
                            </div>
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]/50">
                                <span className="text-xs font-medium text-[var(--text-secondary)] tracking-tight">Material</span>
                                <span className="text-xs font-medium text-[var(--text-primary)]">{product.material || 'Premium Finish'}</span>
                            </div>
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]/50">
                                <span className="text-xs font-semibold text-[var(--text-secondary)] tracking-tight">HSN Code</span>
                                <span className="text-xs font-semibold text-[var(--well-success-text)] tracking-tight">{product.hsn_code || '4901'} ({product.gst_percentage || 0}%)</span>
                            </div>
                            {product.manufacturer_info && (
                                <div className="flex flex-col gap-1.5 p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]/50">
                                    <span className="text-xs font-semibold text-[var(--text-secondary)] tracking-tight">Manufacturer Details</span>
                                    <span className="text-xs font-medium text-[var(--text-tertiary)] leading-relaxed line-clamp-2">
                                        {product.manufacturer_info}
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Law of Physical Transparency - Return Window */}
                    <section className="flex items-center gap-3 pt-4">
                        <div className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-4 rounded-[var(--radius-lg)] border font-semibold text-xs transition-colors",
                            (product.return_eligible || !isPersonalizationEnabled)
                                ? "bg-[var(--well-info)] border-[var(--well-info-text)]/10 text-[var(--well-info-text)]"
                                : "bg-[var(--well-neutral)] border-[var(--border)] text-[var(--text-secondary)]"
                        )}>
                            <Info className="size-4" />
                            {isPersonalizationEnabled ? "No returns after preview" : "24h return (damaged/wrong)"}
                        </div>
                        <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[var(--radius-lg)] border bg-[var(--well-neutral)] border-[var(--border)] text-[var(--text-secondary)] font-semibold text-xs">
                            <ShieldCheck className="size-4" />
                            Secure Order
                        </div>
                    </section>

                    {/* Description Section */}
                    {product.description && (
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight px-1">About product</h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                                {product.description}
                            </p>
                        </section>
                    )}

                    {/* Buffer for footer */}
                    <div className="h-10" />
                </div>
            </div>

            {/* Fixed Action Footer: WYSHKIT 2026 High Commitment Surface */}
            <div className="bg-[var(--surface)] px-5 pt-5 pb-[max(var(--space-5),env(safe-area-inset-bottom,0px))] border-t border-[var(--surface-muted)] shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-[var(--z-nav)]">
                <div className="flex items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-[var(--surface-muted)] rounded-[var(--radius-lg)] p-1 shrink-0">
                        <button
                            onClick={() => { triggerHaptic(HapticPattern.ACTION); setQuantity(Math.max(1, quantity - 1)); }}
                            className="size-10 flex items-center justify-center active:scale-90 transition-all text-[var(--text-primary)]"
                            disabled={quantity <= 1}
                        >
                            <span className="text-xl font-bold">−</span>
                        </button>
                        <span className="w-8 text-center font-bold text-sm tabular-nums text-[var(--text-primary)]">
                            {quantity}
                        </span>
                        <button
                            onClick={() => { triggerHaptic(HapticPattern.ACTION); setQuantity(quantity + 1); }}
                            className="size-10 flex items-center justify-center active:scale-90 transition-all text-[var(--text-primary)]"
                        >
                            <span className="text-xl font-bold">+</span>
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        className="flex-1 h-12 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] font-semibold text-sm tracking-tight rounded-[var(--radius-lg)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        onClick={handleAddToCart}
                        data-testid="add-to-cart-drawer"
                        disabled={continuing || !canAdd}
                    >
                        {continuing ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : isOutOfStock ? (
                            <span>Sold Out</span>
                        ) : (
                            <>
                                <span>{isEditMode ? 'Update Product' : 'Add to Cart'}</span>
                                <div className="h-4 w-px bg-[var(--surface)]/20" />
                                <span>{formatCurrency(Number(unitPrice) || 0)}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
