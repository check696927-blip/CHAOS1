/**
 * Shared TypeScript interfaces for the commerce intelligence layer.
 */

export interface SyncedInventoryItem {
  productId: string;
  supplierProductId: string;
  stockCount: number;
  price: number;
  lastSynced: number; // epoch ms
}

export interface CloudCartRow {
  id: string;
  user_id: string;
  product_id: string;
  variant: string | null;
  size: string | null;
  quantity: number;
  updated_at: string;
}

export type TrackingEventName =
  | "AddToCart"
  | "ViewContent"
  | "InitiateCheckout"
  | "Purchase";

export interface TrackingIntegration {
  name: string;
  init: () => void;
  track: (event: TrackingEventName, data: Record<string, unknown>) => void;
}

export interface TrackingEvent {
  event: TrackingEventName;
  data: Record<string, unknown>;
  timestamp: number;
}

export interface LivePurchaseEvent {
  productName: string;
  productImage: string;
  city: string;
  timestamp: number;
}
