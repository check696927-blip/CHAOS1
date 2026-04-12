import { CartItem } from "@/types";
import { PRODUCTS } from "@/constants/products";

const CART_KEY = "chaos_cart";

// ❌ REMOVE async (not needed)
export const loadCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

// ✅ KEEP THIS — VERY IMPORTANT
export const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return sum;

    const variant = item.selectedVariant
      ? product.variants?.find(v => v.id === item.selectedVariant)
      : null;

    const basePrice = variant?.price ?? product.price;
    const price = Number(basePrice) || 0;

    return sum + price * item.quantity;
  }, 0);

  const discount = subtotal * 0.2;
  const total = subtotal - discount;

  return { subtotal, discount, total };
};

export const FREE_SHIPPING_THRESHOLD = 50;

export const getFreeShippingProgress = (total: number) => {
  return {
    progress: Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100),
    remaining: Math.max(FREE_SHIPPING_THRESHOLD - total, 0),
    qualified: total >= FREE_SHIPPING_THRESHOLD,
  };
};

export const calculateShipping = (
  total: number,
  method: 'standard' | 'express' | 'overnight'
) => {
  if (total >= FREE_SHIPPING_THRESHOLD) return 0;

  const rates = {
    standard: 5.99,
    express: 14.99,
    overnight: 24.99,
  };

  return rates[method];
};

export const validateCartStock = (
  items: CartItem[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const item of items) {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) {
      errors.push(`Product "${item.id}" no longer exists.`);
      continue;
    }

    if (item.selectedVariant) {
      const variant = product.variants?.find(
        (v) => v.id === item.selectedVariant
      );
      if (!variant) {
        errors.push(`Variant for "${product.name}" is no longer available.`);
        continue;
      }
      if (!variant.inStock || variant.stockCount < item.quantity) {
        errors.push(
          `"${product.name} – ${variant.name}" only has ${variant.stockCount} in stock.`
        );
      }
    } else {
      const stock = product.stockCount ?? 0;
      if (!product.inStock || stock < item.quantity) {
        errors.push(`"${product.name}" only has ${stock} in stock.`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
};