/**
 * ReviewModal Component
 *
 * Modal for submitting a product review.
 * Requires authentication. Matches existing modal styling (AuthModal pattern).
 */
import { useState } from "react";
import { X, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onSubmit: (data: {
    product_id: string;
    user_id: string;
    username: string;
    rating: number;
    comment: string;
  }) => Promise<boolean>;
  submitting: boolean;
}

export const ReviewModal = ({
  open,
  onClose,
  productId,
  productName,
  onSubmit,
  submitting,
}: ReviewModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated || !user) {
      setError("Please sign in to write a review.");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Review must be at least 10 characters.");
      return;
    }

    const result = await onSubmit({
      product_id: productId,
      user_id: user.id,
      username: user.name || user.email || "Anonymous",
      rating,
      comment: comment.trim(),
    });

    if (result) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setComment("");
        setRating(5);
      }, 1500);
    } else {
      setError("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-chaos-dark border-2 border-chaos-purple/50 rounded-lg max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-chaos-purple/20 to-chaos-red/20 p-6 border-b border-chaos-purple/30 flex items-center justify-between">
          <div>
            <h2 className="font-chaos text-2xl neon-text-purple">
              WRITE REVIEW
            </h2>
            <p className="text-sm text-gray-400 mt-1">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-green-400 text-sm">
              Review submitted! Thank you.
            </div>
          )}

          {!isAuthenticated ? (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-2">
                Please sign in to write a review.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="text-sm font-bold text-gray-300 block mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          i < (hoverRating || rating)
                            ? "fill-chaos-cyan text-chaos-cyan"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-400">
                    {rating}/5
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="text-sm font-bold text-gray-300 block mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others what you think about this product..."
                  rows={4}
                  className="w-full bg-chaos-darker border border-chaos-purple/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-chaos-purple resize-none"
                  required
                  minLength={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 10 characters
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || success}
                className="w-full bg-gradient-to-r from-chaos-purple to-chaos-red py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : success
                  ? "Submitted!"
                  : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
