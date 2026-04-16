/**
 * Google Analytics 4 (GA4) Integration
 *
 * Maps internal tracking events to gtag() calls.
 * Gracefully no-ops if gtag is not loaded on the page.
 */
import type { TrackingEventName, TrackingIntegration } from "@/services/types";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const EVENT_MAP: Record<TrackingEventName, string> = {
  AddToCart: "add_to_cart",
  ViewContent: "view_item",
  InitiateCheckout: "begin_checkout",
  Purchase: "purchase",
};

export const ga4Integration: TrackingIntegration = {
  name: "ga4",

  init() {
    if (!window.gtag) {
      console.info("[ga4] gtag not found — GA4 not loaded");
    }
  },

  track(event: TrackingEventName, data: Record<string, unknown>) {
    if (!window.gtag) return;

    const gaEvent = EVENT_MAP[event];
    if (!gaEvent) return;

    window.gtag("event", gaEvent, {
      currency: (data.currency as string) ?? "USD",
      value: data.price ?? data.value,
      items: data.productId
        ? [
            {
              item_id: data.productId,
              item_variant: data.variant,
              quantity: data.quantity,
              price: data.price,
            },
          ]
        : data.items,
    });
  },
};
