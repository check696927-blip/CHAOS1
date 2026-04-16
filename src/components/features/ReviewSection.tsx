import { Star, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useReviews } from "@/hooks/useReviews";
import { ReviewModal } from "@/components/features/ReviewModal";
import { PRODUCTS } from "@/constants/products";

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const { reviews, averageRating, submitting, submitReview, markHelpful } =
    useReviews(productId);
  const [showModal, setShowModal] = useState(false);

  const product = PRODUCTS.find((p) => p.id === productId);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-chaos-cyan text-chaos-cyan' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6 border-t border-gray-800 pt-8 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-neon font-bold text-2xl mb-2">Customer Reviews</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-lg font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500">({reviews.length} reviews)</span>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-chaos-purple hover:bg-chaos-red px-6 py-3 rounded-lg font-bold transition-all"
        >
          Write Review
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-chaos-dark p-5 rounded-lg border border-gray-800">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{review.username}</span>
                  {review.verified && (
                    <span className="bg-chaos-cyan/20 text-chaos-cyan text-xs px-2 py-0.5 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-xs text-gray-500">{review.created_at}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-3 leading-relaxed">{review.comment}</p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => markHelpful(review.id)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-chaos-purple transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      <ReviewModal
        open={showModal}
        onClose={() => setShowModal(false)}
        productId={productId}
        productName={product?.name ?? "Product"}
        onSubmit={submitReview}
        submitting={submitting}
      />
    </div>
  );
};
