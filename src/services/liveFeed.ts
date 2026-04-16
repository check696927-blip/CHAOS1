/**
 * Live Purchase Feed Service
 *
 * Provides a stream of recent purchase events — either real
 * (from Supabase orders table) or simulated as a fallback.
 */
import { flags } from "@/services/featureFlags";
import { supabase } from "@/lib/supabaseClient";
import { PRODUCTS } from "@/constants/products";
import type { LivePurchaseEvent } from "@/services/types";

const SIMULATED_CITIES = [
  "New York",
  "Los Angeles",
  "London",
  "Tokyo",
  "Berlin",
  "Sydney",
  "Toronto",
  "Paris",
  "Dubai",
  "Seoul",
  "Mumbai",
  "Mexico City",
];

// ---------------------------------------------------------------------------
// Simulated feed
// ---------------------------------------------------------------------------

/**
 * Generate a single simulated purchase event for testing/demo.
 */
export function generateSimulatedPurchase(): LivePurchaseEvent {
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const city =
    SIMULATED_CITIES[Math.floor(Math.random() * SIMULATED_CITIES.length)];

  return {
    productName: product.name,
    productImage: product.image,
    city,
    timestamp: Date.now(),
  };
}

// ---------------------------------------------------------------------------
// Subscription
// ---------------------------------------------------------------------------

/**
 * Subscribe to live purchase events.
 *
 * If Supabase is available, subscribes to the orders table for real events.
 * Otherwise falls back to simulated events at random intervals (15-45s).
 *
 * Returns an unsubscribe/cleanup function.
 */
export function subscribeToLivePurchases(
  onPurchase: (event: LivePurchaseEvent) => void
): () => void {
  if (!flags.liveFeed()) return () => {};

  let cancelled = false;

  // Try real Supabase subscription first
  if (supabase) {
    const channel = supabase
      .channel("live-purchases")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          if (cancelled) return;

          const order = payload.new as {
            items?: Array<{
              name?: string;
              image?: string;
            }>;
          };

          const firstItem = order?.items?.[0];
          if (firstItem) {
            onPurchase({
              productName: firstItem.name ?? "Product",
              productImage: firstItem.image ?? "",
              city:
                SIMULATED_CITIES[
                  Math.floor(Math.random() * SIMULATED_CITIES.length)
                ],
              timestamp: Date.now(),
            });
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase?.removeChannel(channel);
    };
  }

  // Fallback: simulated feed
  let timeoutId: ReturnType<typeof setTimeout>;

  function scheduleNext() {
    if (cancelled) return;
    const delay = 15000 + Math.random() * 30000; // 15-45 seconds
    timeoutId = setTimeout(() => {
      if (cancelled) return;
      onPurchase(generateSimulatedPurchase());
      scheduleNext();
    }, delay);
  }

  // Start with a delay so it doesn't fire immediately on page load
  timeoutId = setTimeout(() => {
    if (cancelled) return;
    onPurchase(generateSimulatedPurchase());
    scheduleNext();
  }, 8000 + Math.random() * 7000); // 8-15s initial delay

  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
}
