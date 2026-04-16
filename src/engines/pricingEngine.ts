/**
 * AI Price Optimization Engine
 *
 * Dynamically adjusts product prices based on demand signals,
 * stock levels, and conversion data. Outputs a multiplier in
 * the 0.75–1.25 range that is applied ON TOP of the existing
 * 0.8 discount multiplier.
 *
 * Never breaks the existing discount UI — the 0.8 multiplier
 * remains intact; this engine adjusts the base price fed into it.
 */
import { PRODUCTS, getTotalStock } from "@/constants/products";
import { flags } from "@/services/featureFlags";
import type { Product } from "@/types";

// ---------------------------------------------------------------------------
// Demand signal tracking (localStorage-based)
// ---------------------------------------------------------------------------

const DEMAND_KEY = "chaos-demand-signals";
const CACHE_KEY = "chaos-pricing-cache";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

interface DemandSignals {
  cartAdds: Record<string, number>; // productId -> count
  views: Record<string, number>; // productId -> count
  lastReset: number;
}

interface PricingResult {
  multiplier: number;
  basePrice: number;
  optimizedPrice: number;
  discountedPrice: number; // after 0.8 discount
  reason: string;
}

// In-memory cache
const priceCache = new Map<string, { result: PricingResult; timestamp: number }>();

// ---------------------------------------------------------------------------
// Demand signal management
// ---------------------------------------------------------------------------

function loadDemandSignals(): DemandSignals {
  try {
    const raw = localStorage.getItem(DEMAND_KEY);
    if (raw) {
      const signals: DemandSignals = JSON.parse(raw);
      // Reset signals daily
      if (Date.now() - signals.lastReset > 24 * 60 * 60 * 1000) {
        return { cartAdds: {}, views: {}, lastReset: Date.now() };
      }
      return signals;
    }
  } catch {
    // ignore
  }
  return { cartAdds: {}, views: {}, lastReset: Date.now() };
}

function saveDemandSignals(signals: DemandSignals): void {
  try {
    localStorage.setItem(DEMAND_KEY, JSON.stringify(signals));
  } catch {
    // ignore
  }
}

/**
 * Record a demand signal (cart add or view).
 * Call from tracking/event listeners.
 */
export function recordDemandSignal(
  productId: string,
  type: "cartAdd" | "view"
): void {
  const signals = loadDemandSignals();
  if (type === "cartAdd") {
    signals.cartAdds[productId] = (signals.cartAdds[productId] ?? 0) + 1;
  } else {
    signals.views[productId] = (signals.views[productId] ?? 0) + 1;
  }
  saveDemandSignals(signals);
}

// ---------------------------------------------------------------------------
// Core optimization
// ---------------------------------------------------------------------------

/**
 * Calculate the optimal price multiplier for a product.
 *
 * Factors:
 * 1. Demand score (cart adds + views relative to average)
 * 2. Stock scarcity (low stock = higher price)
 * 3. Supply chain margin (if available)
 *
 * Output: multiplier in range [0.75, 1.25]
 */
export function optimizePrice(product: Product): PricingResult {
  if (!flags.pricing()) {
    return {
      multiplier: 1.0,
      basePrice: product.price,
      optimizedPrice: product.price,
      discountedPrice: product.price * 0.8,
      reason: "pricing_disabled",
    };
  }

  // Check cache
  const cached = priceCache.get(product.id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const signals = loadDemandSignals();
  let multiplier = 1.0;
  const reasons: string[] = [];

  // Factor 1: Demand score
  const cartAdds = signals.cartAdds[product.id] ?? 0;
  const views = signals.views[product.id] ?? 0;

  // Calculate average demand across all products
  const allCartAdds = Object.values(signals.cartAdds);
  const avgCartAdds =
    allCartAdds.length > 0
      ? allCartAdds.reduce((a, b) => a + b, 0) / allCartAdds.length
      : 0;

  if (cartAdds > avgCartAdds * 1.5 && avgCartAdds > 0) {
    // High demand → slight price increase
    const demandFactor = Math.min((cartAdds / avgCartAdds - 1) * 0.1, 0.15);
    multiplier += demandFactor;
    reasons.push("high_demand");
  } else if (cartAdds < avgCartAdds * 0.3 && avgCartAdds > 2) {
    // Low demand → price decrease to stimulate sales
    multiplier -= 0.1;
    reasons.push("low_demand");
  }

  // Factor 2: Stock scarcity
  const totalStock = getTotalStock(product);
  const supplyInventory = product.supplyChain?.inventoryCount ?? 100;

  if (totalStock <= 3) {
    // Very low stock → scarcity premium
    multiplier += 0.1;
    reasons.push("scarce_stock");
  } else if (totalStock > supplyInventory * 0.8) {
    // Overstocked → encourage sales
    multiplier -= 0.08;
    reasons.push("overstock_clearance");
  }

  // Factor 3: Margin consideration
  if (product.supplyChain) {
    const currentMargin =
      (product.price - product.supplyChain.supplierCost) / product.price;
    if (currentMargin > 0.6) {
      // High margin → room to discount more aggressively
      multiplier -= 0.05;
      reasons.push("margin_headroom");
    }
  }

  // Factor 4: View-to-cart conversion signal
  if (views > 5 && cartAdds === 0) {
    // Lots of views but no cart adds → price too high
    multiplier -= 0.12;
    reasons.push("low_conversion");
  }

  // Clamp to [0.75, 1.25]
  multiplier = Math.max(0.75, Math.min(1.25, multiplier));

  // Round to 2 decimal places
  multiplier = Math.round(multiplier * 100) / 100;

  const optimizedPrice = product.price * multiplier;
  const discountedPrice = optimizedPrice * 0.8;

  const result: PricingResult = {
    multiplier,
    basePrice: product.price,
    optimizedPrice,
    discountedPrice,
    reason: reasons.length > 0 ? reasons.join(",") : "stable",
  };

  // Cache result
  priceCache.set(product.id, { result, timestamp: Date.now() });

  return result;
}

/**
 * Warm the pricing cache for all products on idle.
 */
export function warmPricingCache(): void {
  if (!flags.pricing()) return;

  const compute = () => {
    for (const product of PRODUCTS) {
      optimizePrice(product);
    }
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(compute);
  } else {
    setTimeout(compute, 3000);
  }
}
