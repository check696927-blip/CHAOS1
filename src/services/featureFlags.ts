/**
 * Feature flag accessor for all commerce intelligence subsystems.
 * Each flag reads from a VITE_ENABLE_* environment variable.
 * All features are disabled by default (must be explicitly set to "true").
 */
export const flags = {
  inventorySync: () => import.meta.env.VITE_ENABLE_INVENTORY_SYNC === "true",
  cartSync: () => import.meta.env.VITE_ENABLE_CART_SYNC === "true",
  tracking: () => import.meta.env.VITE_ENABLE_TRACKING === "true",
  abandonedCart: () => import.meta.env.VITE_ENABLE_ABANDONED_CART === "true",
  upsells: () => import.meta.env.VITE_ENABLE_UPSELLS === "true",
  liveFeed: () => import.meta.env.VITE_ENABLE_LIVE_FEED === "true",
} as const;
