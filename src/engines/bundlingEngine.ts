/**
 * Smart Bundling Engine
 *
 * Creates "buy together & save" bundles by finding complementary
 * products and applying automatic 5-15% discounts.
 */
import { PRODUCTS, hasAnyStock } from "@/constants/products";
import type { Product } from "@/types";

// ---------------------------------------------------------------------------
// Complementary type mapping
// ---------------------------------------------------------------------------

type ProductType = Product["productType"];

const COMPLEMENTS: Record<ProductType, ProductType[]> = {
  hoodie: ["pants", "beanie", "chain"],
  pants: ["hoodie", "tee", "ring"],
  tee: ["pants", "cap", "chain"],
  beanie: ["hoodie", "chain"],
  cap: ["tee", "chain"],
  ring: ["chain", "pendant"],
  chain: ["ring", "pendant"],
  pendant: ["chain", "ring"],
};

// ---------------------------------------------------------------------------
// Bundle interface
// ---------------------------------------------------------------------------

export interface ProductBundle {
  id: string;
  name: string;
  products: Product[];
  originalTotal: number;
  bundlePrice: number;
  savings: number;
  discountPercent: number;
}

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

/**
 * Generate bundle suggestions for a given product.
 * Returns 1-2 bundles, each containing the source product plus 1-2 complementary items.
 */
export function getBundles(product: Product): ProductBundle[] {
  const complements = COMPLEMENTS[product.productType] ?? [];
  if (complements.length === 0) return [];

  // Find candidate complement products (in stock, different ID)
  const candidates = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      complements.includes(p.productType) &&
      hasAnyStock(p)
  );

  if (candidates.length === 0) return [];

  const bundles: ProductBundle[] = [];

  // Bundle 1: Product + best complement (2-item bundle, 10% off)
  const bestComplement = candidates[0];
  if (bestComplement) {
    const products = [product, bestComplement];
    const originalTotal = products.reduce((sum, p) => sum + p.price, 0);
    const discountPercent = 10;
    const savings = originalTotal * (discountPercent / 100);
    const bundlePrice = originalTotal - savings;

    bundles.push({
      id: `bundle-${product.id}-${bestComplement.id}`,
      name: "Style Duo",
      products,
      originalTotal,
      bundlePrice,
      savings,
      discountPercent,
    });
  }

  // Bundle 2: Product + 2 complements (3-item bundle, 15% off) — if enough candidates
  if (candidates.length >= 2) {
    // Pick two different type complements for variety
    const seen = new Set<ProductType>();
    const picks: Product[] = [];
    for (const c of candidates) {
      if (!seen.has(c.productType) && picks.length < 2) {
        seen.add(c.productType);
        picks.push(c);
      }
    }

    if (picks.length === 2) {
      const products = [product, ...picks];
      const originalTotal = products.reduce((sum, p) => sum + p.price, 0);
      const discountPercent = 15;
      const savings = originalTotal * (discountPercent / 100);
      const bundlePrice = originalTotal - savings;

      bundles.push({
        id: `bundle-${product.id}-trio`,
        name: "Complete the Look",
        products,
        originalTotal,
        bundlePrice,
        savings,
        discountPercent,
      });
    }
  }

  return bundles;
}
