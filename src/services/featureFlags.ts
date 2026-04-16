/**
 * Feature flag accessor for all commerce intelligence subsystems.
 * Each flag reads from a VITE_ENABLE_* environment variable.
 * All features are disabled by default (must be explicitly set to "true").
 */
export const flags = {
  // Commerce Intelligence Layer (Phase 1)
  inventorySync: () => import.meta.env.VITE_ENABLE_INVENTORY_SYNC === "true",
  cartSync: () => import.meta.env.VITE_ENABLE_CART_SYNC === "true",
  tracking: () => import.meta.env.VITE_ENABLE_TRACKING === "true",
  abandonedCart: () => import.meta.env.VITE_ENABLE_ABANDONED_CART === "true",
  upsells: () => import.meta.env.VITE_ENABLE_UPSELLS === "true",
  liveFeed: () => import.meta.env.VITE_ENABLE_LIVE_FEED === "true",

  // Ultra Premium Layer (Phase 2)
  pricing: () => import.meta.env.VITE_ENABLE_PRICING === "true",
  bundles: () => import.meta.env.VITE_ENABLE_BUNDLES === "true",
  dynamicLanding: () => import.meta.env.VITE_ENABLE_DYNAMIC_LANDING === "true",
  heatmap: () => import.meta.env.VITE_ENABLE_HEATMAP === "true",
  reviews: () => import.meta.env.VITE_ENABLE_REVIEWS === "true",
} as const;
