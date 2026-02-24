"use client";

import { useEffect, useState, useTransition } from "react";
import { Star, User, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/client";
// import { submitItemReview } from "@/lib/actions/vendor/catalog";
import { triggerHaptic, HapticPattern } from "@/lib/utils/haptic";

interface ItemReviewsProps {
  itemId: string;
  initialReviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user?: {
      full_name?: string;
      email?: string;
    };
  }>;
}

export function ItemReviews({ itemId, initialReviews }: ItemReviewsProps) {
  const { user } = useAuth();

  // WYSHKIT 2026: Use server-provided initial reviews (data comes to user)
  const [reviews, setReviews] = useState<any[]>(initialReviews || []);
  const [loading, setLoading] = useState(!initialReviews);
  const [isPending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // WYSHKIT 2026: Only fetch if initialReviews not provided (fallback)
  useEffect(() => {
    if (!initialReviews) {
      // Table purged in Swiggy 2026 lean model. Reviews handled by external feedback engine if enabled.
      setReviews([]);
      setLoading(false);
    }
  }, [itemId, initialReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      triggerHaptic(HapticPattern.ERROR);
      toast.error("Please sign in to leave a review");
      return;
    }

    setSubmitting(true);
    triggerHaptic(HapticPattern.ACTION);

    try {
      // Feature Disabled: Review table purged for system hardening.
      toast.info("Reviews are currently disabled for system maintenance.");
    } catch (error) {
      triggerHaptic(HapticPattern.ERROR);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="size-6 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-zinc-900">Ratings & Reviews</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    "size-3.5",
                    s <= Math.round(averageRating) ? "fill-green-600 text-green-600" : "text-zinc-200"
                  )}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-zinc-900">{averageRating.toFixed(1)}</span>
            <span className="text-xs font-medium text-zinc-400">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 tracking-tight">Your Rating</label>
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
                      s <= rating ? "fill-green-600 text-green-600" : "text-zinc-200"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 tracking-tight">Your Experience</label>
            <Textarea
              placeholder="Tell others what you liked or disliked about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] rounded-xl border-zinc-200 focus:border-green-600 focus:ring-green-600/10 resize-none bg-white font-medium"
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : "Submit Review"}
          </Button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="space-y-3 pb-6 border-b border-zinc-100 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-zinc-100 flex items-center justify-center">
                    <User className="size-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">
                      {review.user?.full_name || "Anonymous User"}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "size-2.5",
                              s <= review.rating ? "fill-green-600 text-green-600" : "text-zinc-200"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-zinc-400">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
            <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <MessageSquare className="size-6 text-zinc-200" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-900">No reviews yet</p>
              <p className="text-xs font-medium text-zinc-400">Be the first to review this product!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
