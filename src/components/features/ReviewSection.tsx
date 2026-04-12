import { Star, ThumbsUp, Image as ImageIcon, Video } from "lucide-react";
import { useState } from "react";

interface Review {
  id: string;
  username: string;
  rating: number;
  date: string;
  verified: boolean;
  text: string;
  images?: string[];
  helpful: number;
}

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const [reviews] = useState<Review[]>([
    {
      id: "1",
      username: "ChaosKing92",
      rating: 5,
      date: "2026-02-05",
      verified: true,
      text: "Absolutely fire hoodie! The quality is insane and the graphics are even better in person. Fits oversized perfectly.",
      helpful: 24
    },
    {
      id: "2",
      username: "StreetVibes",
      rating: 5,
      date: "2026-02-03",
      verified: true,
      text: "Been waiting for this drop and it did NOT disappoint. The fabric feels premium and the neon details glow perfectly under UV light.",
      helpful: 18
    },
    {
      id: "3",
      username: "DarkAesthetics",
      rating: 4,
      date: "2026-01-31",
      verified: true,
      text: "Love the design but wish the sleeves were a bit longer. Overall solid purchase though, gets compliments everywhere.",
      helpful: 12
    }
  ]);

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

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
        <button className="bg-chaos-purple hover:bg-chaos-red px-6 py-3 rounded-lg font-bold transition-all">
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
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-3 leading-relaxed">{review.text}</p>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-chaos-purple transition-colors">
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
