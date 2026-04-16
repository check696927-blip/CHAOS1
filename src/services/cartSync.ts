/**
 * Cross-Device Cart Sync Service
 *
 * Pure service layer for Supabase cart_items table operations.
 * No React dependencies — all React bridging happens in useCartSync hook.
 *
 * Required Supabase table (run this migration):
 *
 * ```sql
 * create table cart_items (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id uuid references auth.users(id) on delete cascade,
 *   product_id text not null,
 *   variant text,
 *   size text,
 *   quantity int not null default 1,
 *   updated_at timestamptz default now(),
 *   unique(user_id, product_id, variant, size)
 * );
 *
 * create index idx_cart_items_user on cart_items(user_id);
 * alter table cart_items enable row level security;
 *
 * create policy "Users own their cart" on cart_items
 *   for all using (auth.uid() = user_id);
 * ```
 */
import { flags } from "@/services/featureFlags";
import { supabase } from "@/lib/supabaseClient";
import type { CartItem } from "@/store/cart";
import type { CloudCartRow } from "@/services/types";

// ---------------------------------------------------------------------------
// Debounce helper
// ---------------------------------------------------------------------------
let syncTimer: ReturnType<typeof setTimeout> | null = null;
const SYNC_DEBOUNCE = 2000; // 2 seconds

// ---------------------------------------------------------------------------
// Cloud operations
// ---------------------------------------------------------------------------

/**
 * Push the full local cart to Supabase.
 * Uses upsert with conflict resolution on (user_id, product_id, variant, size).
 * Removes cloud rows that are no longer in the local cart.
 *
 * Debounced: waits 2s after last call before executing.
 */
export function syncCartToCloud(userId: string, items: CartItem[]): void {
  if (!flags.cartSync() || !supabase) return;

  if (syncTimer) clearTimeout(syncTimer);

  syncTimer = setTimeout(async () => {
    try {
      // Upsert current items
      if (items.length > 0) {
        const rows = items.map((item) => ({
          user_id: userId,
          product_id: item.id,
          variant: item.selectedVariant ?? null,
          size: item.selectedSize ?? null,
          quantity: item.quantity,
          updated_at: new Date().toISOString(),
        }));

        await supabase
          .from("cart_items")
          .upsert(rows, {
            onConflict: "user_id,product_id,variant,size",
          });
      }

      // Fetch all cloud items for this user to find stale rows
      const { data: cloudItems } = await supabase
        .from("cart_items")
        .select("id, product_id, variant, size")
        .eq("user_id", userId);

      if (cloudItems) {
        const localKeys = new Set(
          items.map(
            (i) => `${i.id}|${i.selectedVariant ?? ""}|${i.selectedSize ?? ""}`
          )
        );

        const staleIds = cloudItems
          .filter(
            (row) =>
              !localKeys.has(
                `${row.product_id}|${row.variant ?? ""}|${row.size ?? ""}`
              )
          )
          .map((row) => row.id);

        if (staleIds.length > 0) {
          await supabase.from("cart_items").delete().in("id", staleIds);
        }
      }
    } catch (err) {
      console.warn("[cartSync] syncCartToCloud failed:", err);
    }
  }, SYNC_DEBOUNCE);
}

/**
 * Fetch the user's cloud cart and convert to CartItem[].
 */
export async function fetchCloudCart(userId: string): Promise<CartItem[]> {
  if (!flags.cartSync() || !supabase) return [];

  try {
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    if (!data) return [];

    return (data as CloudCartRow[]).map((row) => ({
      id: row.product_id,
      quantity: row.quantity,
      selectedVariant: row.variant ?? undefined,
      selectedSize: row.size ?? undefined,
    }));
  } catch (err) {
    console.warn("[cartSync] fetchCloudCart failed:", err);
    return [];
  }
}

/**
 * Merge local and remote cart items.
 * Strategy: for items present in both (matching id+variant+size),
 * take the higher quantity. Items unique to either side are included.
 */
export function mergeCart(local: CartItem[], remote: CartItem[]): CartItem[] {
  const keyFn = (i: CartItem) =>
    `${i.id}|${i.selectedVariant ?? ""}|${i.selectedSize ?? ""}`;

  const merged = new Map<string, CartItem>();

  // Add all local items
  for (const item of local) {
    merged.set(keyFn(item), { ...item });
  }

  // Merge remote items
  for (const item of remote) {
    const key = keyFn(item);
    const existing = merged.get(key);

    if (existing) {
      // Take the higher quantity
      existing.quantity = Math.max(existing.quantity, item.quantity);
    } else {
      merged.set(key, { ...item });
    }
  }

  return Array.from(merged.values());
}

/**
 * Subscribe to real-time cart updates for a user via Supabase.
 * Returns an unsubscribe function.
 */
export function subscribeToCartUpdates(
  userId: string,
  onUpdate: (items: CartItem[]) => void
): () => void {
  if (!flags.cartSync() || !supabase) return () => {};

  const channel = supabase
    .channel(`cart-sync:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cart_items",
        filter: `user_id=eq.${userId}`,
      },
      async () => {
        // On any change, refetch the full cart to stay consistent
        const items = await fetchCloudCart(userId);
        onUpdate(items);
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}
