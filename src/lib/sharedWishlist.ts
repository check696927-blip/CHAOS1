import { SharedWishlist, WishlistNotification } from "@/types/wishlist";
import { Product } from "@/types";
import { PRODUCTS } from "@/constants/products";

const SHARED_WISHLIST_KEY = 'chaos_shared_wishlists';
const NOTIFICATIONS_KEY = 'chaos_wishlist_notifications';

export const generateShareCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const createSharedWishlist = (
  userId: string,
  name: string,
  productIds: string[],
  options: {
    privacy?: 'public' | 'private' | 'friends-only';
    description?: string;
    occasion?: SharedWishlist['occasion'];
    eventDate?: Date;
    isGiftRegistry?: boolean;
  } = {}
): SharedWishlist => {
  const wishlist: SharedWishlist = {
    id: `wishlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    name,
    description: options.description,
    privacy: options.privacy || 'private',
    shareCode: generateShareCode(),
    productIds,
    collaborators: [],
    occasion: options.occasion,
    eventDate: options.eventDate,
    isGiftRegistry: options.isGiftRegistry || false,
    purchasedItems: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const wishlists = getAllSharedWishlists();
  wishlists.push(wishlist);
  localStorage.setItem(SHARED_WISHLIST_KEY, JSON.stringify(wishlists));

  return wishlist;
};

export const getSharedWishlist = (shareCode: string): SharedWishlist | null => {
  const wishlists = getAllSharedWishlists();
  const wishlist = wishlists.find(w => w.shareCode === shareCode);
  if (!wishlist) return null;

  return {
    ...wishlist,
    createdAt: new Date(wishlist.createdAt),
    updatedAt: new Date(wishlist.updatedAt),
    eventDate: wishlist.eventDate ? new Date(wishlist.eventDate) : undefined,
    purchasedItems: wishlist.purchasedItems?.map(p => ({
      ...p,
      purchasedAt: new Date(p.purchasedAt)
    }))
  };
};

export const getUserSharedWishlists = (userId: string): SharedWishlist[] => {
  const wishlists = getAllSharedWishlists();
  return wishlists
    .filter(w => w.userId === userId || w.collaborators?.includes(userId))
    .map(w => ({
      ...w,
      createdAt: new Date(w.createdAt),
      updatedAt: new Date(w.updatedAt),
      eventDate: w.eventDate ? new Date(w.eventDate) : undefined
    }));
};

export const getAllSharedWishlists = (): SharedWishlist[] => {
  const stored = localStorage.getItem(SHARED_WISHLIST_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const addCollaborator = (shareCode: string, userId: string): void => {
  const wishlists = getAllSharedWishlists();
  const wishlist = wishlists.find(w => w.shareCode === shareCode);
  
  if (wishlist) {
    if (!wishlist.collaborators) wishlist.collaborators = [];
    if (!wishlist.collaborators.includes(userId)) {
      wishlist.collaborators.push(userId);
      wishlist.updatedAt = new Date();
      localStorage.setItem(SHARED_WISHLIST_KEY, JSON.stringify(wishlists));
    }
  }
};

export const markAsPurchased = (shareCode: string, productId: string, purchasedBy: string): void => {
  const wishlists = getAllSharedWishlists();
  const wishlist = wishlists.find(w => w.shareCode === shareCode);
  
  if (wishlist) {
    if (!wishlist.purchasedItems) wishlist.purchasedItems = [];
    wishlist.purchasedItems.push({
      productId,
      purchasedBy,
      purchasedAt: new Date()
    });
    wishlist.updatedAt = new Date();
    localStorage.setItem(SHARED_WISHLIST_KEY, JSON.stringify(wishlists));
  }
};

export const checkPriceDrops = (userId: string): void => {
  // Simulate price drop notifications
  const wishlists = getUserSharedWishlists(userId);
  const notifications = getWishlistNotifications(userId);

  wishlists.forEach(wishlist => {
    wishlist.productIds.forEach(productId => {
      const product = PRODUCTS.find(p => p.id === productId);
      if (product && Math.random() < 0.1) { // 10% chance for demo
        const notification: WishlistNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId,
          productId,
          type: 'price_drop',
          message: `Price dropped on ${product.name}! Now $${(product.price * 0.8).toFixed(0)}`,
          read: false,
          createdAt: new Date()
        };
        notifications.push(notification);
      }
    });
  });

  localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(notifications));
};

export const checkLowStock = (userId: string): void => {
  const wishlists = getUserSharedWishlists(userId);
  const notifications = getWishlistNotifications(userId);

  wishlists.forEach(wishlist => {
    wishlist.productIds.forEach(productId => {
      const product = PRODUCTS.find(p => p.id === productId);
      if (product && product.stockCount && product.stockCount < 5) {
        const notification: WishlistNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId,
          productId,
          type: 'low_stock',
          message: `Only ${product.stockCount} left of ${product.name}!`,
          read: false,
          createdAt: new Date()
        };
        notifications.push(notification);
      }
    });
  });

  localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(notifications));
};

export const getWishlistNotifications = (userId: string): WishlistNotification[] => {
  const stored = localStorage.getItem(`${NOTIFICATIONS_KEY}_${userId}`);
  if (!stored) return [];
  
  try {
    const notifications = JSON.parse(stored);
    return notifications.map((n: any) => ({
      ...n,
      createdAt: new Date(n.createdAt)
    }));
  } catch {
    return [];
  }
};

export const markNotificationRead = (userId: string, notificationId: string): void => {
  const notifications = getWishlistNotifications(userId);
  const notification = notifications.find(n => n.id === notificationId);
  
  if (notification) {
    notification.read = true;
    localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(notifications));
  }
};

export const getShareableUrl = (shareCode: string): string => {
  return `${window.location.origin}/wishlist/${shareCode}`;
};
