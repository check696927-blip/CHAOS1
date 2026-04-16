/**
 * Abandoned Cart Recovery Service
 *
 * Tracks cart activity and triggers recovery actions when a user
 * has items in their cart but does not proceed to checkout within
 * a configurable timeout (default 30 minutes).
 */
import { flags } from "@/services/featureFlags";
import { supabase } from "@/lib/supabaseClient";
import type { CartItem } from "@/store/cart";

const ABANDON_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SNAPSHOT_KEY = "chaos-abandoned-cart";

let timer: ReturnType<typeof setTimeout> | null = null;
let getCartItemsFn: (() => CartItem[]) | null = null;
let getUserIdFn: (() => string | null) | null = null;

// ---------------------------------------------------------------------------
// Timer management
// ---------------------------------------------------------------------------

/**
 * Reset the abandon timer. Call on every meaningful cart interaction
 * (add to cart, quantity change, checkout navigation, etc.).
 */
export function resetAbandonTimer(): void {
  if (!flags.abandonedCart()) return;

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  timer = setTimeout(() => {
    handleAbandonment();
  }, ABANDON_TIMEOUT);
}

/**
 * Handle an abandoned cart event.
 * Snapshots the cart and persists it for recovery.
 */
async function handleAbandonment(): Promise<void> {
  if (!getCartItemsFn) return;

  const items = getCartItemsFn();
  if (items.length === 0) return;

  // Save snapshot to localStorage (always, for anonymous users)
  try {
    localStorage.setItem(
      SNAPSHOT_KEY,
      JSON.stringify({
        items,
        abandonedAt: Date.now(),
      })
    );
  } catch {
    // localStorage unavailable
  }

  // Persist to Supabase if user is authenticated
  const userId = getUserIdFn?.();
  if (userId && supabase) {
    try {
      await supabase.from("abandoned_carts").insert({
        user_id: userId,
        cart_snapshot: items,
        recovered: false,
      });
    } catch (err) {
      console.warn("[abandonedCart] Failed to persist to Supabase:", err);
    }
  }
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

/**
 * Start tracking cart abandonment.
 * Returns a cleanup function that clears the timer.
 */
export function startAbandonmentTracking(
  getCartItems: () => CartItem[],
  getUserId: () => string | null
): () => void {
  if (!flags.abandonedCart()) return () => {};

  getCartItemsFn = getCartItems;
  getUserIdFn = getUserId;

  // Start the initial timer
  resetAbandonTimer();

  return () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    getCartItemsFn = null;
    getUserIdFn = null;
  };
}

// ---------------------------------------------------------------------------
// Recovery APIs
// ---------------------------------------------------------------------------

/**
 * Retrieve the most recent abandoned cart snapshot from localStorage.
 */
export function getAbandonedCartSnapshot(): {
  items: CartItem[];
  abandonedAt: number;
} | null {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear the abandoned cart snapshot after successful recovery.
 */
export function clearAbandonedCartSnapshot(): void {
  localStorage.removeItem(SNAPSHOT_KEY);
}
