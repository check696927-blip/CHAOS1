import { PRODUCTS } from "@/constants/products";

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

  return quantity <= product.stockCount;
};