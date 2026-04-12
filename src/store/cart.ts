import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  quantity: number;
  selectedVariant?: string;
  selectedSize?: string;
  name?: string;
  image?: string;
  price?: number;
}

interface CartNotification {
  show: boolean;
  itemName: string;
  quantity: number;
  itemImage?: string;
}

interface CartStore {
  items: CartItem[];
  notification: CartNotification;

  addItem: (item: CartItem) => void;
  removeItem: (id: string, selectedVariant?: string, selectedSize?: string) => void;
  updateQuantity: (
    id: string,
    qty: number,
    selectedVariant?: string,
    selectedSize?: string
  ) => void;
  clear: () => void;

  showNotification: (name: string, qty: number, image?: string) => void;
  hideNotification: () => void;
}

const matchItem = (
  i: CartItem,
  id: string,
  selectedVariant?: string,
  selectedSize?: string
) =>
  i.id === id &&
  i.selectedVariant === selectedVariant &&
  i.selectedSize === selectedSize;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      notification: {
        show: false,
        itemName: "",
        quantity: 0,
        itemImage: undefined,
      },

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) =>
          matchItem(i, item.id, item.selectedVariant, item.selectedSize)
        );

        if (existing) {
          set({
            items: items.map((i) =>
              matchItem(i, item.id, item.selectedVariant, item.selectedSize)
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i
            ),
            notification: {
              show: true,
              itemName: item.name ?? existing.name ?? item.id,
              quantity: item.quantity ?? 1,
              itemImage: item.image ?? existing.image,
            },
          });
        } else {
          set({
            items: [...items, { ...item, quantity: item.quantity ?? 1 }],
            notification: {
              show: true,
              itemName: item.name ?? item.id,
              quantity: item.quantity ?? 1,
              itemImage: item.image,
            },
          });
        }
      },

      removeItem: (id, selectedVariant, selectedSize) =>
        set({
          items: get().items.filter(
            (i) => !matchItem(i, id, selectedVariant, selectedSize)
          ),
        }),

      updateQuantity: (id, qty, selectedVariant, selectedSize) => {
        if (qty <= 0) {
          get().removeItem(id, selectedVariant, selectedSize);
          return;
        }
        set({
          items: get().items.map((i) =>
            matchItem(i, id, selectedVariant, selectedSize)
              ? { ...i, quantity: qty }
              : i
          ),
        });
      },

      clear: () => set({ items: [] }),

      showNotification: (name, qty, image) =>
        set({ notification: { show: true, itemName: name, quantity: qty, itemImage: image } }),

      hideNotification: () =>
        set((s) => ({ notification: { ...s.notification, show: false } })),
    }),
    { name: "chaos-cart" }
  )
);

export const selectCartItems = (s: CartStore) => s.items;
export const selectCartCount = (s: CartStore) =>
  s.items.reduce((acc, i) => acc + i.quantity, 0);
export const selectNotification = (s: CartStore) => s.notification;
