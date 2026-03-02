"use client";

import { useEffect, useState, useTransition } from "react";
import { Star, User, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/AuthProvider";
import { logger } from "@/lib/logging/logger";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/client";
// import { submitItemReview } from "@/lib/actions/vendor/catalog";
import { triggerHaptic, HapticPattern } from "@/lib/utils/haptic";

interface ProductReviewsProps {
  productId: string;
  orderProductId?: string; // WYSHKIT 2026: Link to the specific order product
  approvedMockupUrl?: string; // WYSHKIT 2026: Pass the mockup seen by customer
  initialReviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    personalization_rating?: number;
    fidelity_tags?: string[];
    approved_mockup_url?: string;
    user?: {
      full_name?: string;
      email?: string;
    };
  }>;
}

export function ProductReviews({ productId, orderProductId, approvedMockupUrl, initialReviews }: ProductReviewsProps) {
  const { user } = useAuth();

  // WYSHKIT 2026: Use server-provided initial reviews (data comes to user)
  const [reviews, setReviews] = useState<any[]>(initialReviews || []);
  const [loading, setLoading] = useState(!initialReviews);
  const [isPending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [personalizationRating, setPersonalizationRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fidelityTags = [
    { id: 'color_match', label: 'Color Match' },
    { id: 'material_quality', label: 'Material Quality' },
    { id: 'font_clarity', label: 'Font Clarity' },
    { id: 'size_accuracy', label: 'Size Accuracy' }
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // WYSHKIT 2026: Only fetch if initialReviews not provided (fallback)
  useEffect(() => {
    if (!initialReviews) {
      // Table purged in WYSHKIT 2026 lean model. Reviews handled by external feedback engine if enabled.
      setReviews([]);
      setLoading(false);
    }
  }, [productId, initialReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      triggerHaptic(HapticPattern.ERROR);
      toast.error("Please sign in to leave a review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please provide a comment");
      return;
    }

    setSubmitting(true);
    triggerHaptic(HapticPattern.ACTION);

    try {
      const supabase = createClient();

      // WYSHKIT 2026: Atomic Review Submission via RPC (Single Trip)
      const { data, error: rpc_error } = await (supabase.rpc as any)('add_product_review', {
        p_product_id: productId,
        p_order_id: (reviews[0]?.order_id || null), // We should ideally pass this in props if available
        p_order_product_id: orderProductId,
        p_rating: rating,
        p_comment: comment.trim(),
        p_personalization_rating: personalizationRating,
        p_fidelity_tags: selectedTags.length > 0 ? selectedTags : ['quality_match'],
        p_approved_mockup_url: approvedMockupUrl
      });

      if (rpc_error) throw rpc_error;

      const result = data as any;
      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Review submitted! Thank you for the feedback.");
      setComment("");
      setSelectedTags([]);
      // Optimistically we could refresh the list here
    } catch (error: any) {
      triggerHaptic(HapticPattern.ERROR);
      logger.error('Review submission failed', { error });
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="size-6 animate-spin text-[var(--text-tertiary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Ratings & Reviews</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    "size-3.5",
                    s <= Math.round(averageRating) ? "fill-green-600 text-green-600" : "text-[var(--border)]"
                  )}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[var(--text-primary)]">{averageRating.toFixed(1)}</span>
            <span className="text-xs font-medium text-[var(--text-tertiary)]">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-[var(--surface-muted)] rounded-xl border border-[var(--border)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase">Product Quality</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      className={cn(
                        "size-6",
                        s <= rating ? "fill-green-600 text-green-600" : "text-[var(--border)]"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            {/* WYSHKIT 2026: Personalization Moat */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase">Personalization Accuracy</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPersonalizationRating(s)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      className={cn(
                        "size-6",
                        s <= personalizationRating ? "fill-[var(--warning)] text-[var(--warning)]" : "text-[var(--border)]"
                      )}
                    />
                  </button>
                ))}
                <span className="text-xs text-[var(--text-tertiary)] font-bold italic ml-1">Matches Mockup</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase">Fidelity Tags</label>
            <div className="flex flex-wrap gap-2">
              {fidelityTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.label)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                    selectedTags.includes(tag.label)
                      ? "bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--text-inverse)] shadow-sm"
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border)]"
                  )}
                >
                  #{tag.label.replace(' ', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase">Your Experience</label>
            <Textarea
              placeholder="Tell others what you liked or disliked. Was it just like the preview?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] rounded-xl border-[var(--border)] focus:border-green-600 focus:ring-green-600/10 resize-none bg-[var(--surface)] font-medium text-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 bg-[var(--text-primary)] hover:bg-[var(--text-primary)] text-[var(--text-inverse)] rounded-xl font-bold shadow-lg shadow-black/5 active:scale-[0.98] transition-transform"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : "Submit Review"}
          </Button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="space-y-3 pb-6 border-b border-[var(--border)] last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-[var(--surface-muted)] flex items-center justify-center">
                    <User className="size-4 text-[var(--text-tertiary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      {review.user?.full_name || "Anonymous User"}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "size-2.5",
                              s <= review.rating ? "fill-green-600 text-green-600" : "text-[var(--border)]"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-[var(--text-tertiary)]">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                {review.comment}
              </p>

              {review.approved_mockup_url && (
                <div className="mt-4 p-3 bg-[var(--surface-muted)] rounded-xl border border-[var(--border)] flex items-center gap-4">
                  <div className="size-16 rounded-lg bg-[var(--border)] overflow-hidden flex-shrink-0">
                    <img
                      src={review.approved_mockup_url}
                      alt="Original Mockup"
                      className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-zoom-in"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-tight">Verified Mockup Match</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={cn("size-2", s <= (review.personalization_rating || 0) ? "fill-[var(--warning)] text-[var(--warning)]" : "text-[var(--border)]")} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {review.fidelity_tags?.slice(0, 2).map((t: string) => `#${t.replace(/\s+/g, '')}`).join(' ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 bg-[var(--surface-muted)] rounded-xl border border-dashed border-[var(--border)]">
            <div className="size-12 rounded-full bg-[var(--surface)] flex items-center justify-center shadow-sm">
              <MessageSquare className="size-6 text-[var(--border)]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[var(--text-primary)]">No reviews yet</p>
              <p className="text-xs font-medium text-[var(--text-tertiary)]">Be the first to review this product!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
