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
    orderProductId: string;
    name: string;
    is_personalized: boolean;
    mockup_url?: string;
}

interface FeedbackStepProps {
    orderId: string;
    products: Product[];
    onComplete?: () => void;
}

interface ProductReview {
    productId: string;
    orderProductId: string;
    rating: number;
    fidelityRating?: number;
    comment: string;
    tags: string[];
    mockupUrl?: string;
}

export function FeedbackStep({ orderId, products, onComplete }: FeedbackStepProps) {
    const [overallRating, setOverallRating] = useState(0);
    const [productReviews, setProductReviews] = useState<Record<string, ProductReview>>(() => {
        const initial: Record<string, ProductReview> = {};
        products.forEach(p => {
            initial[p.orderProductId] = {
                productId: p.id,
                orderProductId: p.orderProductId,
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

    const handleProductRatingChange = (orderProductId: string, field: keyof ProductReview, value: any) => {
        setProductReviews(prev => ({
            ...prev,
            [orderProductId]: { ...prev[orderProductId], [field]: value }
        }));
        if (field === 'rating' || field === 'fidelityRating') {
            triggerHaptic(HapticPattern.ACTION);
        }
    };

    const toggleTag = (orderProductId: string, tag: string) => {
        const currentTags = productReviews[orderProductId].tags;
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];
        handleProductRatingChange(orderProductId, 'tags', newTags);
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

            // WYSHKIT 2026: Atomic loop through product reviews
            const promises = Object.values(productReviews).map(review =>
                supabase.rpc('add_product_review', {
                    p_product_id: review.productId,
                    p_order_id: orderId,
                    p_order_product_id: review.orderProductId,
                    p_rating: review.rating,
                    p_comment: review.comment || (review.orderProductId === Object.keys(productReviews)[0] ? `Overall order: ${overallRating}` : ''),
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
            <div className="p-8 text-center bg-[var(--well-success)] rounded-[var(--radius-md)] border border-[var(--success)]/10 animate-in fade-in zoom-in duration-500">
                <div className="size-16 bg-[var(--success)]/10 rounded-[var(--radius-md)] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="size-8 text-[var(--success)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight mb-2">Feedback Received</h3>
                <p className="text-sm text-[var(--success)] font-medium">Your reviews help everyone in the community.</p>
            </div>
        );
    }

    const personalisedProducts = products.filter(p => p.is_personalized);

    return (
        <section className="bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] p-6 shadow-sm overflow-hidden space-y-8">
            <div className="flex items-center gap-3">
                <div className="size-10 bg-[var(--well-warning)] rounded-[var(--radius-md)] flex items-center justify-center">
                    <Star className="size-5 text-[var(--warning)] fill-[var(--warning)]" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight uppercase">Rate your experience</h3>
                    <p className="text-xs text-[var(--text-tertiary)] font-medium mt-0.5 tracking-tight">How was your order from our vendor?</p>
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
                                overallRating >= s ? "text-[var(--warning)] fill-[var(--warning)]" : "text-[var(--border)]"
                            )}
                        />
                    </button>
                ))}
            </div>

            {overallRating > 0 && personalisedProducts.length > 0 && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="h-px bg-[var(--surface-muted)] w-full" />

                    {personalisedProducts.map(product => (
                        <div key={product.orderProductId} className="space-y-6 p-1">
                            <div className="flex items-center gap-2">
                                <Sparkles className="size-4 text-[var(--success)]" />
                                <h4 className="text-xs font-bold text-[var(--text-primary)] tracking-tight uppercase">Personalization Fidelity</h4>
                            </div>

                            {/* Mockup Preview vs Fidelity Question */}
                            <div className="bg-[var(--surface-muted)] rounded-[var(--radius-lg)] p-4 border border-[var(--border)] flex items-center gap-4">
                                <div className="size-20 rounded-[var(--radius-md)] bg-[var(--border)] overflow-hidden relative group shrink-0">
                                    {product.mockup_url ? (
                                        <img src={product.mockup_url} alt="Design" className="size-full object-cover" />
                                    ) : (
                                        <div className="size-full flex items-center justify-center"><ImageIcon className="size-6 text-[var(--text-tertiary)]" /></div>
                                    )}
                                    <div className="absolute inset-0 bg-[var(--foreground)]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-[8px] font-bold text-[var(--text-inverse)] uppercase tracking-wider">Preview</p>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-xs font-bold text-[var(--text-secondary)] leading-tight">
                                        Did your <span className="text-[var(--text-primary)]">&quot;{product.name}&quot;</span> match this preview?
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => handleProductRatingChange(product.orderProductId, 'fidelityRating', s)}
                                                className="transition-transform active:scale-90"
                                            >
                                                <Star
                                                    className={cn(
                                                        "size-5",
                                                        (productReviews[product.orderProductId].fidelityRating || 0) >= s ? "fill-[var(--success)] text-[var(--success)]" : "text-[var(--border)]"
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
                                        onClick={() => toggleTag(product.orderProductId, tag.label)}
                                        className={cn(
                                            "whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5",
                                            productReviews[product.orderProductId].tags.includes(tag.label)
                                                ? "bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--text-inverse)]"
                                                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)]"
                                        )}
                                    >
                                        {productReviews[product.orderProductId].tags.includes(tag.label) && <Check className="size-3" />}
                                        #{tag.label.replace(' ', '')}
                                    </button>
                                ))}
                            </div>

                            {/* Comment */}
                            <textarea
                                value={productReviews[product.orderProductId].comment}
                                onChange={(e) => handleProductRatingChange(product.orderProductId, 'comment', e.target.value)}
                                placeholder="Add any specific details about the design..."
                                className="w-full min-h-[80px] p-4 rounded-[var(--radius-xl)] bg-[var(--surface-muted)] border border-[var(--border)] text-xs font-medium focus:bg-[var(--surface)] focus:border-[var(--primary)] transition-all outline-none resize-none placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)]"
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
                        className="bg-[var(--foreground)] text-[var(--text-inverse)]"
                    />
                </div>
            )}
        </section>
    );
}
