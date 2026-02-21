'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Plus, Minus, Star, Check, Loader2, PlayCircle, Clock, ShieldCheck, Info, AlertTriangle, Sparkles, IndianRupee } from 'lucide-react';
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
    const addonsArray = Array.isArray(item?.item_addons) ? item.item_addons : [];
    const personalizationArray = Array.isArray(item?.personalization_options) ? item.personalization_options : [];

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
        // WYSHKIT 2026: Variant price is an override, not an addition. Standard Swiggy pattern.
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
                    price: Number(p.price) || 0, // DYNAMIC PRICE from DB
                    requires_preview: true
                }))
            ];

            let result;
            if (isEditMode && initialState?.cartItemId) {
                // Swiggy 2026: Direct Update for Momentum flow
                // We'll need to implement this in CartProvider/draft-order.ts
                // For now, we fallback to removal + addition if update is missing, 
                // but we should implement update for premium feel.
                result = await addToDraftOrder(
                    item.id,
                    selectedVariantId,
                    { enabled: false }, // Placeholder, logic below handles it
                    allSelectedAddons,
                    quantity,
                    {
                        item_name: item.name,
                        item_image: item.images?.[0] || FALLBACK_IMAGE,
                        unit_price: unitPrice,
                        partner_id: item.partner_id!,
                        partner_name: item.partners?.name || item.partners?.display_name || partnerId,
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
                        partner_name: item.partners?.name || item.partners?.display_name || partnerId,
                    }
                );
            }

            if (result && result.success) {
                triggerHaptic(HapticPattern.SUCCESS);
                // Wyshkit 2026: Direct dismissal for "One-Tap-Feel"
                if (onBack) {
                    onBack();
                } else {
                    router.back();
                }
            } else if (result && result.code === 'PARTNER_MISMATCH') {
                // Handled globally by CartProvider (shows Replace Cart Dialog)
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
            <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar">
                {/* Immersive Navigation Bar */}
                <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
                    <button
                        onClick={handleBack}
                        className="size-10 rounded-full bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center pointer-events-auto active:scale-90 transition-all border border-black/5"
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
                            className="absolute bottom-6 right-6 z-10 size-12 rounded-full bg-white/90 backdrop-blur-md shadow-2xl flex items-center justify-center hover:bg-white active:scale-95 transition-all text-zinc-900 border border-white"
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

                <div className="px-6 py-6 space-y-8">
                    {/* Header Info */}
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                {item.brand && (
                                    <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em]">{item.brand}</p>
                                )}
                                <h1 className="text-2xl font-black text-zinc-950 leading-tight tracking-tighter uppercase">
                                    {item.name}
                                </h1>
                                <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">{item.category}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black text-zinc-950 tracking-tighter">{formatCurrency(unitPrice)}</span>
                                    {item.mrp && item.mrp > unitPrice && (
                                        <span className="text-xs text-zinc-500 line-through font-bold">{formatCurrency(item.mrp)}</span>
                                    )}
                                </div>
                                {item.mrp && item.mrp > unitPrice && (
                                    <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-100/50">
                                        {Math.round(((item.mrp - unitPrice) / item.mrp) * 100)}% OFF
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-2">
                            {((item.rating || item.partners?.rating) ?? 0) > 0 && (
                                <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-lg">
                                    <span className="text-[11px] font-black text-white leading-none">
                                        {((item.rating || item.partners?.rating) ?? 0).toFixed(1)}
                                    </span>
                                    <Star className="size-2.5 fill-white text-white" />
                                </div>
                            )}
                            {item.preview_time_minutes && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg text-amber-600 border border-amber-100/50">
                                    <Sparkles className="size-3" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">{item.preview_time_minutes} min preview</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-50 rounded-lg text-zinc-600 border border-zinc-100">
                                <IndianRupee className="size-3" />
                                <span className="text-[11px] font-black uppercase tracking-widest">Inc. {item.gst_percentage || 0}% GST</span>
                            </div>
                        </div>
                    </div>

                    {/* Variants Selection */}
                    {variantsArray.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Select Option</h3>
                                <span className="text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 uppercase tracking-widest">REQUIRED</span>
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
                                                "p-4 rounded-[24px] border-2 transition-all text-left group relative",
                                                isSelected
                                                    ? "bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-200"
                                                    : isOutOfStock
                                                        ? "bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed"
                                                        : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200"
                                            )}
                                        >
                                            <span className="text-sm font-black block leading-tight">{v.name}</span>
                                            <div className="flex items-baseline gap-1 mt-1">
                                                <span className={cn("text-xs font-bold", isSelected ? "text-white" : isOutOfStock ? "text-zinc-300" : "text-zinc-900")}>
                                                    {formatCurrency(v.price || 0)}
                                                </span>
                                                {isOutOfStock && <span className="text-[11px] font-black text-rose-500 uppercase tracking-tighter ml-1">Sold Out</span>}
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-3 right-3">
                                                    <div className="size-4 bg-white rounded-full flex items-center justify-center">
                                                        <Check className="size-2.5 text-zinc-900 stroke-[4]" />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Identity Section (WYSHKIT 2026 AUDIT FIX) */}
                    {personalizationArray.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="size-4 text-amber-500" />
                                    <h3 className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">Add Identity</h3>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-black text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-100 uppercase tracking-widest">Optional</span>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900 text-white text-[11px] font-black uppercase tracking-widest">
                                        <Clock className="size-3" />
                                        <span>4hr Preview</span>
                                    </div>
                                </div>
                            </div>

                            {/* Non-returnable warning */}
                            <div className={cn(
                                "grid transition-all duration-300 ease-in-out overflow-hidden",
                                selectedPersonalizations.length > 0 ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            )}>
                                <div className="min-h-0">
                                    <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl mb-2">
                                        <AlertTriangle className="size-4 text-[var(--primary)] shrink-0" />
                                        <p className="text-[11px] font-bold text-[var(--primary)] leading-tight uppercase tracking-wider">
                                            Important: Identity-linked items are non-returnable and non-refundable.
                                        </p>
                                    </div>
                                </div>
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
                                                "w-full flex items-center justify-between p-5 rounded-[24px] border-2 transition-all text-left",
                                                isSelected
                                                    ? "bg-[var(--primary)]/5 border-[var(--primary)] text-[var(--primary)]"
                                                    : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200"
                                            )}
                                        >
                                            <div className="flex gap-4">
                                                <div className={cn(
                                                    "size-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
                                                    isSelected ? "bg-[var(--primary)] border-[var(--primary)]" : "border-zinc-200"
                                                )}>
                                                    {isSelected && <Check className="size-3.5 text-white stroke-[4]" />}
                                                </div>
                                                <div>
                                                    <span className="text-[15px] font-black block leading-none">{p.name}</span>
                                                    <span className="text-[11px] font-bold uppercase tracking-widest mt-1.5 opacity-60 block italic">Requires Design Approval</span>
                                                </div>
                                            </div>
                                            <span className="text-[15px] font-black tabular-nums">+{formatCurrency(p.price || 0)}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Standard Add-ons Section */}
                    {addonsArray.length > 0 && (
                        <section className="space-y-4">
                            <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Complementary Gifts</h3>
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
                                                "w-full flex items-center justify-between p-5 rounded-[24px] border-2 transition-all text-left",
                                                isSelected
                                                    ? "bg-zinc-900 border-zinc-900 text-white"
                                                    : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200"
                                            )}
                                        >
                                            <div className="flex gap-4">
                                                <div className={cn(
                                                    "size-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
                                                    isSelected ? "bg-white border-white" : "border-zinc-200"
                                                )}>
                                                    {isSelected && <Check className="size-3.5 text-zinc-900 stroke-[4]" />}
                                                </div>
                                                <div>
                                                    <span className="text-[15px] font-black block leading-none">{addon.name}</span>
                                                </div>
                                            </div>
                                            <span className="text-[15px] font-black tabular-nums">+{formatCurrency(addon.price || 0)}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Technical Metadata Table - WYSHKIT 2026 AUDIT FIX */}
                    <section className="space-y-4 pt-6 border-t border-zinc-100">

                        <div className="flex items-center gap-2">
                            <h3 className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">Product Specifications</h3>
                            <div className="h-px flex-1 bg-zinc-100" />
                        </div>

                        <div className="grid grid-cols-1 gap-2 bg-zinc-50/50 rounded-[28px] p-2 border border-zinc-100">
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-4 rounded-2xl bg-white border border-zinc-100/50">
                                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Dimensions</span>
                                <span className="text-[13px] font-bold text-zinc-900 tracking-tight">
                                    {item.length_cm || '–'} × {item.width_cm || '–'} × {item.height_cm || '–'} cm
                                </span>
                            </div>
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-4 rounded-2xl bg-white border border-zinc-100/50">
                                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Weight</span>
                                <span className="text-[13px] font-bold text-zinc-900 tracking-tight">
                                    {item.weight_kg ? `${item.weight_kg} kg` : item.weight_grams ? `${item.weight_grams} g` : '–'}
                                </span>
                            </div>
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-4 rounded-2xl bg-white border border-zinc-100/50">
                                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Material</span>
                                <span className="text-[13px] font-bold text-zinc-900 tracking-tight">{item.material || 'Premium Finish'}</span>
                            </div>
                            <div className="grid grid-cols-[1fr,2fr] gap-4 p-4 rounded-2xl bg-white border border-zinc-100/50">
                                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">HSN Code</span>
                                <span className="text-[13px] font-bold text-emerald-600 tracking-widest">{item.hsn_code || '4901'} ({item.gst_percentage || 0}%)</span>
                            </div>
                            {item.manufacturer_info && (
                                <div className="p-4 rounded-2xl bg-white border border-zinc-100/50 flex flex-col gap-2">
                                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Manufacturer Details</span>
                                    <span className="text-[12px] font-medium text-zinc-600 leading-snug italic line-clamp-2">
                                        {item.manufacturer_info}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <div className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[11px]",
                                item.return_eligible ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-zinc-50 border-zinc-100 text-zinc-500"
                            )}>
                                <Info className="size-3" />
                                {item.return_eligible ? '7-Day Return' : 'Final Sale - No Returns'}
                            </div>
                            <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 bg-zinc-50 border-zinc-100 text-zinc-500 font-black uppercase tracking-widest text-[11px]">
                                <ShieldCheck className="size-3" />
                                Quality Assured
                            </div>
                        </div>
                    </section>

                    {/* Description Section */}
                    {item.description && (
                        <section className="space-y-3">
                            <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">About this product</h3>
                            <p className="text-[15px] text-zinc-600 leading-relaxed font-medium">
                                {item.description}
                            </p>
                        </section>
                    )}



                    {/* Buffer for footer */}
                    <div className="h-10" />
                </div>
            </div>

            {/* Fixed Action Footer */}
            <div className="bg-white px-6 py-6 pb-safe border-t border-zinc-50 shrink-0 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-zinc-100 rounded-2xl p-1 shrink-0">
                        <button
                            className="size-10 flex items-center justify-center rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-20"
                            onClick={() => { setQuantity(Math.max(1, quantity - 1)); triggerHaptic(HapticPattern.ACTION); }}
                            disabled={quantity <= 1 || continuing}
                            aria-label="Decrease quantity"
                        >
                            <Minus className="size-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-black tabular-nums" aria-live="polite">{quantity}</span>
                        <button
                            className="size-10 flex items-center justify-center rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-20"
                            onClick={() => { setQuantity(quantity + 1); triggerHaptic(HapticPattern.ACTION); }}
                            disabled={continuing}
                            aria-label="Increase quantity"
                        >
                            <Plus className="size-4" />
                        </button>
                    </div>

                    <button
                        className="flex-1 h-12 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-black text-[13px] uppercase tracking-widest rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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
