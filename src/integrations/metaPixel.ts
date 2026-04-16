/**
 * Meta (Facebook) Pixel Integration
 *
 * Maps internal tracking events to fbq() calls.
 * Gracefully no-ops if the Meta Pixel script is not loaded.
 */
import type { TrackingEventName, TrackingIntegration } from "@/services/types";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const EVENT_MAP: Record<TrackingEventName, string> = {
  AddToCart: "AddToCart",
  ViewContent: "ViewContent",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "Purchase",
};

export const metaPixelIntegration: TrackingIntegration = {
  name: "meta-pixel",

  init() {
    if (!window.fbq) {
      console.info("[meta-pixel] fbq not found — pixel not loaded");
    }
  },

  track(event: TrackingEventName, data: Record<string, unknown>) {
    if (!window.fbq) return;

    const fbEvent = EVENT_MAP[event];
    if (!fbEvent) return;

    window.fbq("track", fbEvent, {
      content_ids: data.productId ? [data.productId] : undefined,
      content_type: "product",
      value: data.price ?? data.value,
      currency: (data.currency as string) ?? "USD",
      num_items: data.quantity,
    });
  },
};
