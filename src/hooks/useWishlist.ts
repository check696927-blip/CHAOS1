import { useState, useEffect } from "react";
import { Product } from "@/types";
import { loadWishlist, saveWishlist } from "@/lib/wishlist";

export const useWishlist = () => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    setItems(loadWishlist());
  }, []);

  useEffect(() => {
    saveWishlist(items);
  }, [items]);

  const addItem = (product: Product) => {
    setItems((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) return current;
      return [...current, product];
    });
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const toggleItem = (product: Product) => {
    const exists = items.some((item) => item.id === product.id);
    if (exists) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id);
  };

  return {
    items,
    itemCount: items.length,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
  };
};
