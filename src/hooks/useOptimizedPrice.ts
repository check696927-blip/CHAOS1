/**
 * useOptimizedPrice Hook
 *
 * Returns optimized pricing for a product using the AI pricing engine.
 * Falls back to standard pricing when the flag is off.
 */
import { useMemo } from "react";
import { flags } from "@/services/featureFlags";
import { optimizePrice } from "@/engines/pricingEngine";
import type { Product } from "@/types";

interface OptimizedPriceResult {
  /** The base price (before discount), potentially adjusted by AI */
  price: number;
  /** After applying the standard 0.8 discount on the optimized base */
  discountedPrice: number;
  /** The AI multiplier applied (1.0 when disabled) */
  multiplier: number;
  /** Reason for the adjustment */
  reason: string;
}

export function useOptimizedPrice(product: Product): OptimizedPriceResult {
  return useMemo(() => {
    if (!flags.pricing()) {
      return {
        price: product.price,
        discountedPrice: product.price * 0.8,
        multiplier: 1.0,
        reason: "disabled",
      };
    }

    const result = optimizePrice(product);
    return {
      price: result.optimizedPrice,
      discountedPrice: result.discountedPrice,
      multiplier: result.multiplier,
      reason: result.reason,
    };
  }, [product.id, product.price]);
}
