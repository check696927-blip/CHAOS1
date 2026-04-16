/**
 * useUpsells Hook
 *
 * Provides upsell product recommendations based on the current cart.
 * Memoized to avoid recalculation on every render.
 */
import { useMemo } from "react";
import { useCartStore, selectCartItems } from "@/store/cart";
import { flags } from "@/services/featureFlags";
import { getUpsellProducts } from "@/engines/upsellEngine";
import type { Product } from "@/types";

export function useUpsells(): { products: Product[]; loading: boolean } {
  const items = useCartStore(selectCartItems);

  const products = useMemo(() => {
    if (!flags.upsells() || items.length === 0) return [];
    return getUpsellProducts(items);
  }, [items]);

  return { products, loading: false };
}
