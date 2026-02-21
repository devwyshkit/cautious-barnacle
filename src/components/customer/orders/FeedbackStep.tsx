'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitItemReview } from '@/lib/actions/partner/catalog';
import { toast } from 'sonner';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { ActionSlider } from '@/components/ui/ActionSlider';

interface FeedbackStepProps {
    orderId: string;
    items: Array<{ id: string; name: string }>;
    onComplete?: () => void;
}

export function FeedbackStep({ orderId, items, onComplete }: FeedbackStepProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleRatingSelect = (s: number) => {
        setRating(s);
        triggerHaptic(HapticPattern.ACTION);
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return { success: false };
        }

        setIsSubmitting(true);
        try {
            // WYSHKIT 2026: Rate the primary item to represent the order experience
            // Swiggy Pattern: One experience, one rating.
            const primaryItem = items[0];
            if (primaryItem) {
                await submitItemReview(primaryItem.id, rating, comment);
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
            <div className="p-8 text-center bg-emerald-50 rounded-[32px] border border-emerald-100 animate-in fade-in zoom-in duration-500">
                <div className="size-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="size-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-emerald-900 uppercase tracking-tight mb-2">Feedback Received</h3>
                <p className="text-sm text-emerald-600 font-medium">Your feedback helps us improve the experience.</p>
            </div>
        );
    }

    return (
        <section className="bg-white rounded-[32px] border border-zinc-100 p-6 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="size-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Star className="size-5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Rate your experience</h3>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">How was your order #{orderId.slice(0, 8)}?</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Star Rating */}
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleRatingSelect(s)}
                            className="p-1 active:scale-90 transition-transform"
                        >
                            <Star
                                className={cn(
                                    "size-10 transition-colors",
                                    rating >= s ? "text-amber-400 fill-amber-400" : "text-zinc-200"
                                )}
                            />
                        </button>
                    ))}
                </div>

                {/* Comment Box */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                        <MessageSquare className="size-3 text-zinc-400" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Comments (Optional)</span>
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what you liked or how we can improve..."
                        className="w-full h-24 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 text-sm focus:bg-white focus:border-zinc-900 transition-all outline-none resize-none placeholder:text-zinc-300 border shadow-none text-zinc-900 leading-relaxed"
                    />
                </div>

                {/* Submit Slider */}
                <div className="pt-2">
                    <ActionSlider
                        onConfirm={handleSubmit}
                        disabled={rating === 0}
                        isLoading={isSubmitting}
                        label="Slide to Rate"
                        successLabel="Rated"
                        variant="amber"
                        className="bg-black text-white"
                    />
                </div>
            </div>
        </section>
    );
}
