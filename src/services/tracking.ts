/**
 * Conversion Tracking Service
 *
 * Central event dispatcher that fans out tracking events to all registered
 * integrations (Meta Pixel, GA4, TikTok, etc.) via requestIdleCallback
 * so tracking never blocks the UI thread.
 */
import { flags } from "@/services/featureFlags";
import type { TrackingEventName, TrackingIntegration } from "@/services/types";

const integrations: TrackingIntegration[] = [];

/**
 * Register a tracking integration. Call once per integration during init.
 */
export function registerIntegration(integration: TrackingIntegration): void {
  // Prevent duplicate registration
  if (integrations.some((i) => i.name === integration.name)) return;
  integrations.push(integration);
}

/**
 * Initialize all registered integrations.
 * Should be called once after all integrations are registered.
 */
export function initTracking(): void {
  if (!flags.tracking()) return;

  for (const integration of integrations) {
    try {
      integration.init();
    } catch (err) {
      console.warn(`[tracking] Failed to init ${integration.name}:`, err);
    }
  }
}

/**
 * Fire a tracking event to all registered integrations.
 * Uses requestIdleCallback to avoid blocking the UI thread.
 */
export function trackEvent(
  event: TrackingEventName,
  data: Record<string, unknown>
): void {
  if (!flags.tracking()) return;

  const dispatch = () => {
    for (const integration of integrations) {
      try {
        integration.track(event, data);
      } catch (err) {
        console.warn(
          `[tracking] Error in ${integration.name} for ${event}:`,
          err
        );
      }
    }
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(dispatch);
  } else {
    setTimeout(dispatch, 0);
  }
}
