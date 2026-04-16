/**
 * Reviews Service
 *
 * Supabase-backed review CRUD with fallback to hardcoded mock data
 * when Supabase is unavailable.
 *
 * Required Supabase table:
 *
 * ```sql
 * create table reviews (
 *   id uuid default gen_random_uuid() primary key,
 *   product_id text not null,
 *   user_id uuid references auth.users(id),
 *   username text not null,
 *   rating int not null check (rating >= 1 and rating <= 5),
 *   comment text not null,
 *   verified boolean default false,
 *   helpful int default 0,
 *   created_at timestamptz default now()
 * );
 *
 * create index idx_reviews_product on reviews(product_id);
 * alter table reviews enable row level security;
 *
 * create policy "Reviews are viewable by everyone"
 *   on reviews for select using (true);
 *
 * create policy "Authenticated users can create reviews"
 *   on reviews for insert with check (auth.uid() = user_id);
 *
 * create policy "Users can update helpful count"
 *   on reviews for update using (true);
 * ```
 */
import { flags } from "@/services/featureFlags";
import { supabase } from "@/lib/supabaseClient";

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  username: string;
  rating: number;
  comment: string;
  verified: boolean;
  helpful: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Mock data (used when Supabase is unavailable or flag is off)
// ---------------------------------------------------------------------------

const MOCK_REVIEWS: Record<string, Review[]> = {
  default: [
    {
      id: "mock-1",
      product_id: "",
      username: "Liam Carter",
      rating: 5,
      verified: true,
      comment:
        "Absolutely fire! The quality is insane and the graphics are even better in person. Fits oversized perfectly.",
      helpful: 24,
      created_at: "2026-02-05",
    },
    {
      id: "mock-2",
      product_id: "",
      username: "Ava Brooks",
      rating: 5,
      verified: true,
      comment:
        "Been waiting for this drop and it did NOT disappoint. The fabric feels premium and the neon details glow perfectly under UV light.",
      helpful: 18,
      created_at: "2026-02-03",
    },
    {
      id: "mock-3",
      product_id: "",
      username: "Marcus Chen",
      rating: 4,
      verified: true,
      comment:
        "Love the design but wish the sleeves were a bit longer. Overall solid purchase though, gets compliments everywhere.",
      helpful: 12,
      created_at: "2026-01-31",
    },
  ],
};

function getMockReviews(productId: string): Review[] {
  return (MOCK_REVIEWS[productId] ?? MOCK_REVIEWS.default).map((r) => ({
    ...r,
    product_id: productId,
  }));
}

// ---------------------------------------------------------------------------
// Supabase CRUD
// ---------------------------------------------------------------------------

/**
 * Fetch reviews for a product. Falls back to mock data if Supabase fails.
 */
export async function fetchReviews(productId: string): Promise<Review[]> {
  if (!flags.reviews() || !supabase) {
    return getMockReviews(productId);
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // If no real reviews exist yet, merge with mock data for display
    if (!data || data.length === 0) {
      return getMockReviews(productId);
    }

    return data as Review[];
  } catch (err) {
    console.warn("[reviews] fetchReviews failed, using mock data:", err);
    return getMockReviews(productId);
  }
}

/**
 * Submit a new review.
 */
export async function submitReview(review: {
  product_id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
}): Promise<Review | null> {
  if (!supabase) {
    // Offline fallback: return a mock review object so UI updates instantly
    return {
      id: `local-${Date.now()}`,
      product_id: review.product_id,
      user_id: review.user_id,
      username: review.username,
      rating: review.rating,
      comment: review.comment,
      verified: true,
      helpful: 0,
      created_at: new Date().toISOString(),
    };
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id: review.product_id,
        user_id: review.user_id,
        username: review.username,
        rating: review.rating,
        comment: review.comment,
        verified: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  } catch (err) {
    console.warn("[reviews] submitReview failed:", err);
    return null;
  }
}

/**
 * Increment the "helpful" count on a review.
 */
export async function markHelpful(reviewId: string): Promise<void> {
  if (!supabase) return;

  try {
    // Use RPC or manual increment
    const { data } = await supabase
      .from("reviews")
      .select("helpful")
      .eq("id", reviewId)
      .single();

    if (data) {
      await supabase
        .from("reviews")
        .update({ helpful: (data.helpful ?? 0) + 1 })
        .eq("id", reviewId);
    }
  } catch (err) {
    console.warn("[reviews] markHelpful failed:", err);
  }
}
