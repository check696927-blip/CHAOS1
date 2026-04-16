/**
 * Inventory Sync Engine
 *
 * Maps store products to supplier products via Product.supplyChain,
 * polls for stock/price updates, and caches results in both memory
 * and localStorage for fast lookups.
 */
import { PRODUCTS } from "@/constants/products";
import { flags } from "@/services/featureFlags";
import type { SyncedInventoryItem } from "@/services/types";

// ---------------------------------------------------------------------------
// Cache layer (dual: in-memory Map + localStorage)
// ---------------------------------------------------------------------------
const CACHE_KEY = "chaos-inventory-sync";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MIN_SYNC_INTERVAL = 60 * 1000; // 60 seconds debounce

const cache: Map<string, SyncedInventoryItem> = new Map();
let lastSyncRun = 0;

function flushCacheToStorage(): void {
  try {
    const entries = Object.fromEntries(cache.entries());
    localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage may be full or disabled — fail silently
  }
}

function loadCacheFromStorage(): void {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const entries: Record<string, SyncedInventoryItem> = JSON.parse(raw);
    for (const [key, value] of Object.entries(entries)) {
      // Only load entries that haven't exceeded TTL
      if (Date.now() - value.lastSynced < CACHE_TTL) {
        cache.set(key, value);
      }
    }
  } catch {
    // Corrupt cache — clear it
    localStorage.removeItem(CACHE_KEY);
  }
}

// Hydrate from localStorage on module load
loadCacheFromStorage();

// ---------------------------------------------------------------------------
// Supplier mapping
// ---------------------------------------------------------------------------

/**
 * Builds a map from productId → supplier source URL using
 * the Product.supplyChain field.
 */
export function buildSupplierMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const product of PRODUCTS) {
    if (product.supplyChain?.sourceUrl) {
      map.set(product.id, product.supplyChain.sourceUrl);
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// Sync logic
// ---------------------------------------------------------------------------

/**
 * Fetches supplier data for all products with supplyChain configured.
 * In production, this would call a backend proxy API.
 * Currently uses the local supplyChain data as the source of truth.
 *
 * Debounced: will not run more than once per MIN_SYNC_INTERVAL.
 */
export async function syncInventory(): Promise<void> {
  if (!flags.inventorySync()) return;

  const now = Date.now();
  if (now - lastSyncRun < MIN_SYNC_INTERVAL) return;
  lastSyncRun = now;

  for (const product of PRODUCTS) {
    if (!product.supplyChain) continue;

    const existing = cache.get(product.id);
    if (existing && now - existing.lastSynced < CACHE_TTL) continue;

    // In production: fetch from proxy API hitting the supplier
    // For now, normalize from local supplyChain data
    const synced: SyncedInventoryItem = {
      productId: product.id,
      supplierProductId: product.supplyChain.sourceUrl,
      stockCount: product.supplyChain.inventoryCount ?? 0,
      price: product.supplyChain.supplierCost ?? product.price,
      lastSynced: now,
    };

    cache.set(product.id, synced);
  }

  // Flush to localStorage on idle
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => flushCacheToStorage());
  } else {
    setTimeout(flushCacheToStorage, 100);
  }
}

// ---------------------------------------------------------------------------
// Read API
// ---------------------------------------------------------------------------

/**
 * Returns synced supplier stock for a product, or null if not synced.
 * Checks in-memory cache first, then localStorage.
 */
export function getSyncedStock(
  productId: string
): SyncedInventoryItem | null {
  const memHit = cache.get(productId);
  if (memHit && Date.now() - memHit.lastSynced < CACHE_TTL) {
    return memHit;
  }

  // Attempt re-hydrate from storage if memory is stale
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const entries: Record<string, SyncedInventoryItem> = JSON.parse(raw);
      const stored = entries[productId];
      if (stored && Date.now() - stored.lastSynced < CACHE_TTL) {
        cache.set(productId, stored);
        return stored;
      }
    }
  } catch {
    // ignore
  }

  return null;
}

// ---------------------------------------------------------------------------
// Periodic sync
// ---------------------------------------------------------------------------

/**
 * Starts a periodic inventory sync.
 * Returns a cleanup function that stops the interval.
 */
export function startPeriodicSync(intervalMs = 5 * 60 * 1000): () => void {
  const id = setInterval(() => {
    syncInventory();
  }, intervalMs);

  return () => clearInterval(id);
}
