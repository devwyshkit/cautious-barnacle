'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Plus, Minus, Star, Check, Loader2, PlayCircle, Clock, ShieldCheck, Info, AlertTriangle, Sparkles, IndianRupee, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useCart, CartActionResult } from '@/components/customer/CartProvider';

import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { formatCurrency } from '@/lib/utils/pricing';

const FALLBACK_IMAGE = '/images/logo.png';

import { WyshkitItem } from '@/lib/types/item';

interface ItemDetailViewProps {
    item: WyshkitItem;
    onBack?: () => void;
    /** When in sheet from partner page, pass for optional View cart CTA. */
    partnerId?: string;
    /** Initial state for Edit mode from Checkout */
    initialState?: {
        variantId?: string | null;
        quantity?: number;
        addonIds?: string[];
        cartItemId?: string;
    };
}

export function ItemDetailView({ item, onBack, partnerId, initialState }: ItemDetailViewProps) {
    const router = useRouter();

    const { addToDraftOrder, isPending, draftOrder } = useCart();
    const [continuing, setContinuing] = useState(false);
    const [quantity, setQuantity] = useState(initialState?.quantity ?? 1);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(initialState?.variantId ?? null);
    const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(new Set(initialState?.addonIds ?? []));
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Default to first variant if needed
    useEffect(() => {
        const variants = Array.isArray(item?.variants) ? item.variants : [];
        if (variants.length > 0 && selectedVariantId == null) {
            setSelectedVariantId(String(variants[0].id));
        }
    }, [item?.variants, selectedVariantId]);

    const handleBack = useCallback(() => {
        triggerHaptic(HapticPattern.ACTION);
        if (onBack) onBack();
        else router.back();
    }, [onBack, router]);


    const variantsArray = Array.isArray(item?.variants) ? item.variants : [];
    const addonsArray: any[] = []; // Deprecated table
    const personalizationArray: any[] = Array.isArray(item?.personalization_options) ? item.personalization_options as any[] : [];

    const selectedVariant = useMemo(() => {
        return variantsArray.find(v => String(v.id) === selectedVariantId) || null;
    }, [variantsArray, selectedVariantId]);

    const selectedAddons = useMemo(() => {
        return addonsArray.filter(addon => selectedAddonIds.has(String(addon.id)));
    }, [addonsArray, selectedAddonIds]);

    const selectedPersonalizations = useMemo(() => {
        return personalizationArray.filter(p => selectedAddonIds.has(String(p.id)));
    }, [personalizationArray, selectedAddonIds]);

    const isOutOfStock = useMemo(() => {
        if (variantsArray.length > 0) {
            return !selectedVariant || (typeof selectedVariant.stock_quantity === 'number' && selectedVariant.stock_quantity <= 0);
        }
        return typeof item.stock_quantity === 'number' && item.stock_quantity <= 0;
    }, [variantsArray.length, selectedVariant, item.stock_quantity]);

    const canAdd = (variantsArray.length === 0 || selectedVariantId != null) && !isOutOfStock;

    const unitPrice = useMemo(() => {
        const basePrice = Number(item.base_price) || 0;
        const effectiveBasePrice = selectedVariant ? (Number(selectedVariant.price) || 0) : basePrice;

        const addonsSum = selectedAddons.reduce((sum, addon) => sum + (Number(addon.price) || 0), 0);
        const personalizationSum = selectedPersonalizations.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
        return effectiveBasePrice + addonsSum + personalizationSum;
    }, [item.base_price, selectedVariant, selectedAddons, selectedPersonalizations]);

    const totalPrice = unitPrice * quantity;

    const isEditMode = !!initialState?.cartItemId;

    const handleAddToCart = async () => {
        if (continuing) return;

        setContinuing(true);
        try {
            const allSelectedAddons = [
                ...selectedAddons.map(a => ({
                    id: String(a.id),
                    name: a.name || 'Add-on',
                    price: Number(a.price) || 0,
                    requires_preview: a.requires_preview || false
                })),
                ...selectedPersonalizations.map(p => ({
                    id: String(p.id),
                    name: p.name || 'Personalization',
                    price: Number(p.price) || 0,
                    requires_preview: true
                }))
            ];

            let result;
            if (isEditMode && initialState?.cartItemId) {
                result = await addToDraftOrder(
                    item.id,
                    selectedVariantId,
                    { enabled: false },
                    allSelectedAddons,
                    quantity,
                    {
                        item_name: item.name,
                        item_image: item.images?.[0] || FALLBACK_IMAGE,
                        unit_price: unitPrice,
                        partner_id: item.partner_id!,
                        partner_name: item.partners?.name || partnerId,
                        update_item_id: initialState.cartItemId
                    }
                );
            } else {
                result = await addToDraftOrder(
                    item.id,
                    selectedVariantId,
                    { enabled: false },
                    allSelectedAddons,
                    quantity,
                    {
                        item_name: item.name,
                        item_image: item.images?.[0] || FALLBACK_IMAGE,
                        unit_price: unitPrice,
                        partner_id: item.partner_id!,
                        partner_name: item.partners?.name || partnerId,
                    }
                );
            }

            if (result && result.success) {
                triggerHaptic(HapticPattern.SUCCESS);
                if (onBack) onBack();
                else router.back();
            } else if (result && result.code === 'PARTNER_MISMATCH') {
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
        if (item.images?.length) return item.images;
        return [FALLBACK_IMAGE];
    }, [selectedVariant, item.images]);

    return (
        <div className="flex flex-col h-full bg-white font-sans overflow-hidden">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar" data-vaul-no-drag>
                {/* Immersive Navigation Bar */}
                <div className="sticky top-0 left-0 right-0 z-50 p-4 pointer-events-none">
                    <button
                        onClick={handleBack}
                        className="size-11 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center pointer-events-auto active:scale-90 transition-all border border-black/5"
                        aria-label="Back"
                    >
                        <Plus className="size-5 rotate-45 text-zinc-900" />
                    </button>
                </div>

                {/* Image Section */}
                <div className="relative bg-white w-full aspect-[4/3] md:aspect-square">
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
                            <div key={idx} className="w-full h-full min-w-full flex-shrink-0 snap-center snap-always relative bg-zinc-50">
                                <ImageWithFallback
                                    src={img || FALLBACK_IMAGE}
                                    alt={`${item.name} - ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={idx === 0}
                                    sizes="(max-width: 768px) 100vw, 540px"
                                />
                            </div>
                        ))}
                    </div>

                    {item.video_url && (
                        <button
                            onClick={(e) => { e.stopPropagation(); window.open(item.video_url!, '_blank'); }}
                            className="absolute bottom-6 right-6 z-10 size-12 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center hover:bg-white active:scale-95 transition-all text-zinc-900 border border-white"
                        >
                            <PlayCircle className="size-7" />
                        </button>
                    )}

                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-6 flex gap-1.5 z-10 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20">
                            {images.map((_img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setActiveImageIndex(idx);
                                        imageContainerRef.current?.scrollTo({ left: idx * imageContainerRef.current.clientWidth, behavior: 'smooth' });
                                    }}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all",
                                        idx === activeImageIndex ? "bg-white w-4" : "bg-white/40"
                                    )}
                                    aria-label={`View product image ${idx + 1}`}
                                    aria-current={idx === activeImageIndex ? 'true' : 'false'}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-5 py-5 space-y-6">
                    {/* Header Info */}
                    <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-zinc-500 tracking-tight">{item.category}</p>
                                    <div className="size-1 rounded-full bg-zinc-200" />
                                    <p className="text-sm font-semibold text-zinc-500 tracking-tight">{item.partners?.name || partnerId}</p>
                                </div>
                                <h2 className="text-2xl font-black text-zinc-900 leading-tight tracking-tight">
                                    {item.name}
                                </h2>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                                <span className="text-2xl font-black text-[var(--primary)] tabular-nums">
                                    {formatCurrency(unitPrice)}
                                </span>
                                {item.mrp && item.mrp > unitPrice && (
                                    <span className="text-sm text-zinc-400 line-through tabular-nums decoration-zinc-300">
                                        {formatCurrency(item.mrp)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            {('is_veg' in item && (item as any).is_veg !== null) && (
                                <span className={cn(
                                    "text-[11px] font-semibold px-2 py-0.5 rounded-md tracking-tight border",
                                    (item as any).is_veg
                                        ? "text-emerald-600 bg-emerald-50 border-emerald-100/50"
                                        : "text-rose-600 bg-rose-50 border-rose-100/50"
                                )}>
                                    {(item as any).is_veg ? 'VEG' : 'NON-VEG'}
                                </span>
                            )}
                            {('is_bestseller' in item && (item as any).is_bestseller) && (
                                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md tracking-tight border border-amber-100/50">
                                    BESTSELLER
                                </span>
                            )}
                            {item.preview_time_minutes && item.preview_time_minutes > 0 && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 text-white rounded-lg shadow-sm">
                                    <Sparkles className="size-3 text-amber-400" />
                                    <span className="text-[11px] font-semibold tracking-tight">{item.preview_time_minutes} min preview</span>
                                </div>
                            )}
                            <span className="text-[11px] font-semibold text-zinc-400 tracking-tight">Inc. {item.gst_percentage || 0}% GST</span>
                        </div>
                    </div>

                    {/* Variants Selection */}
                    {variantsArray.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[15px] font-semibold text-zinc-900 tracking-tight">Select Option</h3>
                                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 tracking-tight">Required</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {variantsArray.map((v) => {
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
                                                "flex flex-col items-start p-3 rounded-xl border text-left transition-all active:scale-[0.98]",
                                                isSelected
                                                    ? "bg-zinc-900 border-zinc-900 text-white shadow-md shadow-zinc-200"
                                                    : isOutOfStock
                                                        ? "bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed"
                                                        : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200"
                                            )}
                                        >
                                            <span className="text-xs font-semibold leading-tight mb-1">{v.name}</span>
                                            <span className={cn(
                                                "text-xs font-bold tabular-nums",
                                                isSelected ? "text-white/80" : isOutOfStock ? "text-zinc-300" : "text-zinc-400"
                                            )}>
                                                {formatCurrency(v.price || 0)}
                                            </span>
                                            {isOutOfStock && <span className="text-[11px] font-semibold text-rose-500 tracking-tight ml-1">Sold Out</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Identity Section */}
                    {personalizationArray.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[15px] font-semibold text-zinc-900 tracking-tight">Add Personalization</h3>
                                    {personalizationArray.some(p => ('is_required' in p && (p as any).is_required)) && (
                                        <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 tracking-tight">Required</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl mb-2">
                                <AlertTriangle className="size-4 text-rose-500 shrink-0" />
                                <p className="text-[11px] font-semibold text-rose-800 leading-tight">
                                    Personalized items are crafted specially for you and are non-returnable.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {personalizationArray.map((p) => {
                                    const isSelected = selectedAddonIds.has(p.id);
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => {
                                                const next = new Set(selectedAddonIds);
                                                if (next.has(p.id)) next.delete(p.id);
                                                else { next.add(p.id); triggerHaptic(HapticPattern.SUCCESS); }
                                                setSelectedAddonIds(next);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.99]",
                                                isSelected
                                                    ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                                                    : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "size-5 rounded-md border flex items-center justify-center transition-colors",
                                                    isSelected ? "bg-white border-white" : "bg-zinc-50 border-zinc-200"
                                                )}>
                                                    {isSelected && <Check className="size-3 text-zinc-900" strokeWidth={4} />}
                                                </div>
                                                <span className="text-sm font-semibold">{p.name}</span>
                                            </div>
                                            <span className={cn(
                                                "text-xs font-bold tabular-nums",
                                                isSelected ? "text-white/60" : "text-zinc-400"
                                            )}>
                                                +{formatCurrency(p.price || 0)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Standard Add-ons Section */}
                    {addonsArray.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[15px] font-semibold text-zinc-900 tracking-tight">Add Extras</h3>
                                <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-100 tracking-tight">Optional</span>
                            </div>
                            <div className="space-y-3">
                                {addonsArray.map((addon) => {
                                    const isSelected = selectedAddonIds.has(addon.id);
                                    return (
                                        <button
                                            key={addon.id}
                                            onClick={() => {
                                                const next = new Set(selectedAddonIds);
                                                if (next.has(addon.id)) {
                                                    next.delete(addon.id);
                                                    triggerHaptic(HapticPattern.ACTION);
                                                } else {
                                                    next.add(addon.id);
                                                    triggerHaptic(HapticPattern.SUCCESS);
                                                }
                                                setSelectedAddonIds(next);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.99]",
                                                isSelected
                                                    ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-md shadow-rose-100"
                                                    : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "size-5 rounded-md border flex items-center justify-center transition-colors",
                                                    isSelected ? "bg-white border-white" : "bg-zinc-50 border-zinc-200"
                                                )}>
                                                    {isSelected && <Check className="size-3 text-[var(--primary)]" strokeWidth={4} />}
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-semibold">{addon.name}</span>
                                                    {isSelected && (
                                                        <p className="text-[11px] font-bold text-white/80 leading-tight tracking-tight">
                                                            Added to your gift
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "text-xs font-bold tabular-nums",
                                                isSelected ? "text-white/80" : "text-zinc-400"
                                            )}>
                                                +{formatCurrency(addon.price || 0)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Technical Metadata Table */}
                    <section className="space-y-4 pt-6 border-t border-zinc-100">
                        <h3 className="text-[15px] font-semibold text-zinc-900 tracking-tight px-1">Specifications</h3>
                        <div className="grid grid-cols-1 gap-2 bg-zinc-50/50 rounded-xl p-2 border border-zinc-100">
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-3 rounded-lg bg-white border border-zinc-100/50">
                                <span className="text-[11px] font-semibold text-zinc-500 tracking-tight">Dimensions</span>
                                <span className="text-xs font-semibold text-zinc-900">
                                    {item.dimensions ? (typeof item.dimensions === 'string' ? item.dimensions : JSON.stringify(item.dimensions).replace(/["{}]/g, '').replace(/:/g, ': ')) : '–'}
                                </span>
                            </div>
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-3 rounded-lg bg-white border border-zinc-100/50">
                                <span className="text-[11px] font-semibold text-zinc-500 tracking-tight">Weight</span>
                                <span className="text-xs font-semibold text-zinc-900">
                                    {item.net_weight || '–'}
                                </span>
                            </div>
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-3 rounded-lg bg-white border border-zinc-100/50">
                                <span className="text-[11px] font-semibold text-zinc-500 tracking-tight">Material</span>
                                <span className="text-xs font-semibold text-zinc-900">{item.material || 'Premium Finish'}</span>
                            </div>
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-3 rounded-lg bg-white border border-zinc-100/50">
                                <span className="text-[11px] font-semibold text-zinc-500 tracking-tight">HSN Code</span>
                                <span className="text-xs font-semibold text-emerald-600 tracking-tight">{item.hsn_code || '4901'} ({item.gst_percentage || 0}%)</span>
                            </div>
                            {item.manufacturer_info && (
                                <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-zinc-100/50">
                                    <span className="text-[11px] font-semibold text-zinc-500 tracking-tight">Manufacturer Details</span>
                                    <span className="text-[11px] font-medium text-zinc-400 leading-relaxed line-clamp-2">
                                        {item.manufacturer_info}
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Support Section */}
                    <section className="flex items-center gap-3 pt-4">
                        <div className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-semibold tracking-tight text-[11px]",
                            item.return_eligible ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-zinc-50 border-zinc-100 text-zinc-500"
                        )}>
                            <Info className="size-4" />
                            {item.return_eligible ? '7-Day Return' : 'Final Sale - No Returns'}
                        </div>
                        <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 bg-zinc-50 border-zinc-100 text-zinc-500 font-semibold tracking-tight text-[11px]">
                            <ShieldCheck className="size-4" />
                            Secure Order
                        </div>
                    </section>

                    {/* Description Section */}
                    {item.description && (
                        <section className="space-y-3">
                            <h3 className="text-[15px] font-semibold text-zinc-900 tracking-tight px-1">About product</h3>
                            <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                                {item.description}
                            </p>
                        </section>
                    )}

                    {/* Buffer for footer */}
                    <div className="h-10" />
                </div>
            </div>

            {/* Fixed Action Footer */}
            <div className="bg-white px-5 py-5 pb-safe border-t border-zinc-50 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-zinc-100 rounded-xl p-1 shrink-0">
                        <button
                            onClick={() => { triggerHaptic(HapticPattern.ACTION); setQuantity(Math.max(1, quantity - 1)); }}
                            className="size-10 flex items-center justify-center active:scale-90 transition-all text-zinc-900"
                            disabled={quantity <= 1}
                        >
                            <span className="text-xl font-bold">−</span>
                        </button>
                        <span className="w-8 text-center font-black text-sm tabular-nums text-zinc-900">
                            {quantity}
                        </span>
                        <button
                            onClick={() => { triggerHaptic(HapticPattern.ACTION); setQuantity(quantity + 1); }}
                            className="size-10 flex items-center justify-center active:scale-90 transition-all text-zinc-900"
                        >
                            <span className="text-xl font-bold">+</span>
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        className="flex-1 h-12 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold text-[14px] tracking-tight rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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
                                <span>{isEditMode ? 'Update Item' : 'Add to Cart'}</span>
                                <div className="h-4 w-px bg-white/20" />
                                <span>{formatCurrency(totalPrice)}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
