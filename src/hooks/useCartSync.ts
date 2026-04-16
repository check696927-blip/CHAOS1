/**
 * useCartSync Hook
 *
 * Bridges the Zustand cart store with Supabase for cross-device sync.
 * Subscribes to local store changes and pushes to cloud.
 * Subscribes to Supabase realtime and merges into local store.
 *
 * CRITICAL: Never modifies the Zustand store shape. Only uses public
 * actions (addItem, removeItem, updateQuantity, clear).
 */
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cart";
import { flags } from "@/services/featureFlags";
import {
  syncCartToCloud,
  fetchCloudCart,
  mergeCart,
  subscribeToCartUpdates,
} from "@/services/cartSync";

export function useCartSync(): void {
  const { user } = useAuth();
  const isSyncing = useRef(false);
  const didInitialMerge = useRef(false);

  useEffect(() => {
    if (!flags.cartSync() || !user?.id) {
      didInitialMerge.current = false;
      return;
    }

    const userId = user.id;

    // -----------------------------------------------------------------------
    // Initial merge: fetch cloud cart and reconcile with local
    // -----------------------------------------------------------------------
    const doInitialMerge = async () => {
      if (didInitialMerge.current) return;
      didInitialMerge.current = true;

      try {
        const remoteItems = await fetchCloudCart(userId);
        if (remoteItems.length === 0) return;

        const localItems = useCartStore.getState().items;
        const merged = mergeCart(localItems, remoteItems);

        // Apply the merge by diffing against current local state
        isSyncing.current = true;
        applyMergedCart(merged);
        isSyncing.current = false;
      } catch (err) {
        console.warn("[useCartSync] Initial merge failed:", err);
        didInitialMerge.current = false;
      }
    };

    doInitialMerge();

    // -----------------------------------------------------------------------
    // Subscribe to local Zustand changes → push to cloud
    // -----------------------------------------------------------------------
    const unsubLocal = useCartStore.subscribe((state) => {
      if (isSyncing.current) return;
      syncCartToCloud(userId, state.items);
    });

    // -----------------------------------------------------------------------
    // Subscribe to Supabase realtime → merge into local
    // -----------------------------------------------------------------------
    const unsubRemote = subscribeToCartUpdates(userId, (remoteItems) => {
      if (isSyncing.current) return;

      isSyncing.current = true;
      const localItems = useCartStore.getState().items;
      const merged = mergeCart(localItems, remoteItems);
      applyMergedCart(merged);
      isSyncing.current = false;
    });

    return () => {
      unsubLocal();
      unsubRemote();
    };
  }, [user?.id]);
}

/**
 * Apply a merged cart by using the store's public API.
 * Clears the store and re-adds all merged items.
 */
function applyMergedCart(merged: import("@/store/cart").CartItem[]): void {
  const store = useCartStore.getState();
  store.clear();
  for (const item of merged) {
    store.addItem(item);
  }
}
