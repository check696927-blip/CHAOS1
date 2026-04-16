/**
 * AI Upsell Engine
 *
 * Deterministic product recommendation engine based on category affinity
 * and complementary product type mapping. Returns the most relevant
 * products that complement items already in the cart.
 */
import { PRODUCTS } from "@/constants/products";
import { hasAnyStock } from "@/constants/products";
import type { Product } from "@/types";
import type { CartItem } from "@/store/cart";

// ---------------------------------------------------------------------------
// Complementary product type mapping
// ---------------------------------------------------------------------------

type ProductType = Product["productType"];

const COMPLEMENTS: Record<ProductType, ProductType[]> = {
  hoodie: ["pants", "beanie", "cap", "chain"],
  pants: ["hoodie", "tee", "chain", "ring"],
  tee: ["pants", "chain", "cap"],
  beanie: ["hoodie", "chain", "pendant"],
  cap: ["tee", "hoodie", "chain"],
  ring: ["chain", "pendant"],
  chain: ["ring", "pendant"],
  pendant: ["chain", "ring"],
};

// ---------------------------------------------------------------------------
// Core recommendation logic
// ---------------------------------------------------------------------------

/**
 * Get upsell product recommendations based on current cart contents.
 *
 * Algorithm:
 * 1. Collect product types currently in cart
 * 2. Build a scored set of complementary types
 * 3. Filter PRODUCTS to complementary types, excluding items already in cart
 * 4. Sort by relevance score, stock availability, then price
 * 5. Return top N (default 3)
 */
export function getUpsellProducts(
  cartItems: CartItem[],
  limit: number = 3
): Product[] {
  if (cartItems.length === 0) return [];

  // Collect product types and IDs in cart
  const cartProductIds = new Set(cartItems.map((i) => i.id));
  const cartProducts = PRODUCTS.filter((p) => cartProductIds.has(p.id));
  const cartTypes = new Set(cartProducts.map((p) => p.productType));

  // Score each product type by how many cart types complement it
  const typeScores = new Map<ProductType, number>();
  for (const cartType of cartTypes) {
    const complements = COMPLEMENTS[cartType] ?? [];
    for (const complementType of complements) {
      typeScores.set(
        complementType,
        (typeScores.get(complementType) ?? 0) + 1
      );
    }
  }

  // Remove types already in cart (don't upsell what they already have)
  for (const cartType of cartTypes) {
    typeScores.delete(cartType);
  }

  if (typeScores.size === 0) return [];

  // Filter and score candidate products
  const candidates = PRODUCTS.filter(
    (p) =>
      !cartProductIds.has(p.id) &&
      typeScores.has(p.productType) &&
      hasAnyStock(p)
  ).map((product) => ({
    product,
    score: typeScores.get(product.productType) ?? 0,
  }));

  // Sort: highest relevance score first, then by price descending
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.product.price - a.product.price;
  });

  return candidates.slice(0, limit).map((c) => c.product);
}

/**
 * Get products frequently bought together with a given product.
 * Returns top complementary products of different types.
 */
export function getFrequentlyBoughtTogether(
  productId: string,
  limit: number = 2
): Product[] {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return [];

  const complements = COMPLEMENTS[product.productType] ?? [];
  if (complements.length === 0) return [];

  return PRODUCTS.filter(
    (p) =>
      p.id !== productId &&
      complements.includes(p.productType) &&
      hasAnyStock(p)
  )
    .sort((a, b) => b.price - a.price)
    .slice(0, limit);
}
