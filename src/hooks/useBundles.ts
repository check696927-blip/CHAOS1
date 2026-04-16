/**
 * useBundles Hook
 *
 * Returns smart bundle suggestions for a given product.
 */
import { useMemo } from "react";
import { flags } from "@/services/featureFlags";
import { getBundles, type ProductBundle } from "@/engines/bundlingEngine";
import { PRODUCTS } from "@/constants/products";

export function useBundles(productId: string): {
  bundles: ProductBundle[];
  loading: boolean;
} {
  const bundles = useMemo(() => {
    if (!flags.bundles()) return [];

    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return [];

    return getBundles(product);
  }, [productId]);

  return { bundles, loading: false };
}
