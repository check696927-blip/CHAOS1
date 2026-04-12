import { Product } from "@/types";

const WISHLIST_KEY = 'chaos_wishlist';

export const saveWishlist = (items: Product[]) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
};

export const loadWishlist = (): Product[] => {
  const saved = localStorage.getItem(WISHLIST_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const isInWishlist = (productId: string, wishlist: Product[]): boolean => {
  return wishlist.some(item => item.id === productId);
};
