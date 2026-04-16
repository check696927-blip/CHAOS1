/**
 * useReviews Hook
 *
 * Manages review data for a product — fetching, submitting, and helpful actions.
 */
import { useState, useEffect, useCallback } from "react";
import {
  fetchReviews,
  submitReview as submitReviewService,
  markHelpful as markHelpfulService,
  type Review,
} from "@/services/reviewService";

interface UseReviewsResult {
  reviews: Review[];
  averageRating: number;
  loading: boolean;
  submitting: boolean;
  submitReview: (data: {
    product_id: string;
    user_id: string;
    username: string;
    rating: number;
    comment: string;
  }) => Promise<boolean>;
  markHelpful: (reviewId: string) => void;
}

export function useReviews(productId: string): UseReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const data = await fetchReviews(productId);
      if (!cancelled) {
        setReviews(data);
        setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const submitReview = useCallback(
    async (data: {
      product_id: string;
      user_id: string;
      username: string;
      rating: number;
      comment: string;
    }): Promise<boolean> => {
      setSubmitting(true);
      const result = await submitReviewService(data);
      setSubmitting(false);

      if (result) {
        // Optimistically add to local state
        setReviews((prev) => [result, ...prev]);
        return true;
      }
      return false;
    },
    []
  );

  const markHelpful = useCallback((reviewId: string) => {
    // Optimistic update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      )
    );
    markHelpfulService(reviewId);
  }, []);

  return {
    reviews,
    averageRating,
    loading,
    submitting,
    submitReview,
    markHelpful,
  };
}
