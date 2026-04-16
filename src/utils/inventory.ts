import { PRODUCTS } from "@/constants/products";
import { flags } from "@/services/featureFlags";
import { getSyncedStock } from "@/services/inventorySync";

/**
 * Validate stock before adding to cart
 */
export const validateInventory = (
  productId: string,
  quantity: number
): boolean => {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return false;

  if (!product.stockCount) return true;

  const localValid = quantity <= product.stockCount;

  // Flag-gated fallback: check synced supplier stock when local is unavailable
  if (!localValid && flags.inventorySync()) {
    const synced = getSyncedStock(productId);
    if (synced) return quantity <= synced.stockCount;
  }

  return localValid;
};