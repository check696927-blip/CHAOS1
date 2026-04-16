/**
 * TikTok Pixel Integration
 *
 * Maps internal tracking events to ttq.track() calls.
 * Gracefully no-ops if the TikTok pixel script is not loaded.
 */
import type { TrackingEventName, TrackingIntegration } from "@/services/types";

declare global {
  interface Window {
    ttq?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

const EVENT_MAP: Record<TrackingEventName, string> = {
  AddToCart: "AddToCart",
  ViewContent: "ViewContent",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "CompletePayment",
};

export const tiktokIntegration: TrackingIntegration = {
  name: "tiktok",

  init() {
    if (!window.ttq) {
      console.info("[tiktok] ttq not found — TikTok pixel not loaded");
    }
  },

  track(event: TrackingEventName, data: Record<string, unknown>) {
    if (!window.ttq) return;

    const ttEvent = EVENT_MAP[event];
    if (!ttEvent) return;

    window.ttq.track(ttEvent, {
      content_id: data.productId as string,
      content_type: "product",
      quantity: data.quantity,
      price: data.price,
      value: data.price ?? data.value,
      currency: (data.currency as string) ?? "USD",
    });
  },
};
