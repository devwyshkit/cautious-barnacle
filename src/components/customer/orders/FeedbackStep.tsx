'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, Loader2, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { ActionSlider } from '@/components/ui/ActionSlider';
import { logger } from '@/lib/logging/logger';
import { createClient } from '@/lib/supabase/client';

interface Product {
    id: string;
    order_item_id: string;
    name: string;
    is_personalized: boolean;
    mockup_url?: string;
}

interface FeedbackStepProps {
    orderId: string;
    products: Product[];
    onComplete?: () => void;
}

interface ItemReview {
    productId: string;
    orderItemId: string;
    rating: number;
    fidelityRating?: number;
    comment: string;
    tags: string[];
    mockupUrl?: string;
}

export function FeedbackStep({ orderId, products, onComplete }: FeedbackStepProps) {
    const [overallRating, setOverallRating] = useState(0);
    const [itemReviews, setItemReviews] = useState<Record<string, ItemReview>>(() => {
        const initial: Record<string, ItemReview> = {};
        products.forEach(p => {
            initial[p.order_item_id] = {
                productId: p.id,
                orderItemId: p.order_item_id,
                rating: 5,
                fidelityRating: p.is_personalized ? 5 : undefined,
                comment: '',
                tags: [],
                mockupUrl: p.mockup_url
            };
        });
        return initial;
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const fidelityTags = [
        { id: 'ColorMatch', label: 'Color Match' },
        { id: 'FontClarity', label: 'Font Clarity' },
        { id: 'SizeAccuracy', label: 'Size Accuracy' }
    ];

    const handleOverallRatingSelect = (s: number) => {
        setOverallRating(s);
        triggerHaptic(HapticPattern.ACTION);
    };

    const handleItemRatingChange = (orderItemId: string, field: keyof ItemReview, value: any) => {
        setItemReviews(prev => ({
            ...prev,
            [orderItemId]: { ...prev[orderItemId], [field]: value }
        }));
        if (field === 'rating' || field === 'fidelityRating') {
            triggerHaptic(HapticPattern.ACTION);
        }
    };

    const toggleTag = (orderItemId: string, tag: string) => {
        const currentTags = itemReviews[orderItemId].tags;
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];
        handleItemRatingChange(orderItemId, 'tags', newTags);
        triggerHaptic(HapticPattern.ACTION);
    };

    const handleSubmit = async () => {
        if (overallRating === 0) {
            toast.error('Please select an overall rating');
            return { success: false };
        }

        setIsSubmitting(true);
        try {
            const supabase = createClient();

            // WYSHKIT 2026: Atomic loop through item reviews
            const promises = Object.values(itemReviews).map(review =>
                supabase.rpc('add_item_review' as any, {
                    p_product_id: review.productId,
                    p_order_id: orderId,
                    p_order_item_id: review.orderItemId,
                    p_rating: review.rating,
                    p_comment: review.comment || (review.orderItemId === Object.keys(itemReviews)[0] ? `Overall order: ${overallRating}` : ''),
                    p_personalization_rating: review.fidelityRating,
                    p_fidelity_tags: review.tags,
                    p_approved_mockup_url: review.mockupUrl
                })
            );

            const results = await Promise.all(promises);
            const errors = results.filter(r => r.error);

            if (errors.length > 0) {
                logger.error('Some reviews failed to save', { errors });
                // We proceed if at least one worked, or show error if all failed
                if (errors.length === results.length) throw new Error('Failed to save reviews');
            }

            setSubmitted(true);
            triggerHaptic(HapticPattern.SUCCESS);
            toast.success('Thank you for your feedback!');
            if (onComplete) setTimeout(onComplete, 2000);
            return { success: true };
        } catch (error) {
            toast.error('Failed to submit feedback');
            return { success: false };
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-100 animate-in fade-in zoom-in duration-500">
                <div className="size-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="size-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-emerald-900 tracking-tight mb-2">Feedback Received</h3>
                <p className="text-sm text-emerald-600 font-medium">Your reviews help everyone in the community.</p>
            </div>
        );
    }

    const personalisedProducts = products.filter(p => p.is_personalized);

    return (
        <section className="bg-white rounded-xl border border-zinc-100 p-6 shadow-sm overflow-hidden space-y-8">
            <div className="flex items-center gap-3">
                <div className="size-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Star className="size-5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-zinc-900 tracking-tight uppercase">Rate your experience</h3>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5 tracking-tight">How was your order from our vendor?</p>
                </div>
            </div>

            {/* Overall Order Rating */}
            <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        key={s}
                        onClick={() => handleOverallRatingSelect(s)}
                        className="p-1 active:scale-90 transition-transform flex flex-col items-center gap-1"
                    >
                        <Star
                            className={cn(
                                "size-10 transition-colors",
                                overallRating >= s ? "text-amber-400 fill-amber-400" : "text-zinc-100"
                            )}
                        />
                    </button>
                ))}
            </div>

            {overallRating > 0 && personalisedProducts.length > 0 && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="h-px bg-zinc-50 w-full" />

                    {personalisedProducts.map(product => (
                        <div key={product.order_item_id} className="space-y-6 p-1">
                            <div className="flex items-center gap-2">
                                <Sparkles className="size-4 text-emerald-500" />
                                <h4 className="text-xs font-black text-zinc-900 tracking-tight uppercase">Personalization Fidelity</h4>
                            </div>

                            {/* Mockup Preview vs Fidelity Question */}
                            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex items-center gap-4">
                                <div className="size-20 rounded-xl bg-zinc-200 overflow-hidden relative group shrink-0">
                                    {product.mockup_url ? (
                                        <img src={product.mockup_url} alt="Design" className="size-full object-cover" />
                                    ) : (
                                        <div className="size-full flex items-center justify-center"><ImageIcon className="size-6 text-zinc-300" /></div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-[8px] font-black text-white uppercase tracking-wider">Preview</p>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-[11px] font-bold text-zinc-500 leading-tight">
                                        Did your <span className="text-zinc-900">&quot;{product.name}&quot;</span> match this preview?
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => handleItemRatingChange(product.order_item_id, 'fidelityRating', s)}
                                                className="transition-transform active:scale-90"
                                            >
                                                <Star
                                                    className={cn(
                                                        "size-5",
                                                        (itemReviews[product.order_item_id].fidelityRating || 0) >= s ? "fill-emerald-500 text-emerald-500" : "text-zinc-200"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Fidelity Tags */}
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {fidelityTags.map(tag => (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleTag(product.order_item_id, tag.label)}
                                        className={cn(
                                            "whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-black border transition-all flex items-center gap-1.5",
                                            itemReviews[product.order_item_id].tags.includes(tag.label)
                                                ? "bg-zinc-900 border-zinc-900 text-white"
                                                : "bg-white border-zinc-100 text-zinc-500"
                                        )}
                                    >
                                        {itemReviews[product.order_item_id].tags.includes(tag.label) && <Check className="size-3" />}
                                        #{tag.label.replace(' ', '')}
                                    </button>
                                ))}
                            </div>

                            {/* Comment */}
                            <textarea
                                value={itemReviews[product.order_item_id].comment}
                                onChange={(e) => handleItemRatingChange(product.order_item_id, 'comment', e.target.value)}
                                placeholder="Add any specific details about the design..."
                                className="w-full min-h-[80px] p-4 rounded-xl bg-zinc-50 border border-zinc-100 text-xs font-medium focus:bg-white focus:border-zinc-900 transition-all outline-none resize-none placeholder:text-zinc-300 text-zinc-900"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Submit Slider */}
            {overallRating > 0 && (
                <div className="pt-4 animate-in fade-in transition-all">
                    <ActionSlider
                        onConfirm={handleSubmit}
                        disabled={overallRating === 0 || isSubmitting}
                        isLoading={isSubmitting}
                        label="Slide to submit reviews"
                        successLabel="Verified"
                        variant="amber"
                        className="bg-black text-white"
                    />
                </div>
            )}
        </section>
    );
}
