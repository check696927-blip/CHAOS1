/**
 * useCommerceIntelligence Hook — Master Orchestrator
 *
 * Initializes and coordinates all commerce intelligence subsystems.
 * Called once in AppInner (inside BrowserRouter) so it has access
 * to React Router's useLocation().
 *
 * Each subsystem is independently gated by its feature flag.
 * When all flags are off, this hook is essentially a no-op.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cart";
import { flags } from "@/services/featureFlags";

// Services
import {
  syncInventory,
  startPeriodicSync,
} from "@/services/inventorySync";
import {
  registerIntegration,
  initTracking,
  trackEvent,
} from "@/services/tracking";
import {
  startAbandonmentTracking,
  resetAbandonTimer,
} from "@/services/abandonedCart";

// Integrations
import {
  metaPixelIntegration,
  ga4Integration,
  tiktokIntegration,
} from "@/integrations";
import { initHeatmap } from "@/integrations/heatmap";

// Engines
import { warmPricingCache, recordDemandSignal } from "@/engines/pricingEngine";

// Hooks (cart sync runs its own lifecycle)
import { useCartSync } from "@/hooks/useCartSync";

export function useCommerceIntelligence(): void {
  const { user } = useAuth();
  const location = useLocation();

  // -------------------------------------------------------------------
  // 1. Inventory Sync — periodic polling
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!flags.inventorySync()) return;

    // Schedule initial sync on idle
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => syncInventory());
    } else {
      setTimeout(() => syncInventory(), 2000);
    }

    const cleanup = startPeriodicSync();
    return cleanup;
  }, []);

  // -------------------------------------------------------------------
  // 2. Cart Sync — Supabase realtime (internally checks flag + user)
  // -------------------------------------------------------------------
  useCartSync();

  // -------------------------------------------------------------------
  // 3. Conversion Tracking — register integrations once
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!flags.tracking()) return;

    registerIntegration(metaPixelIntegration);
    registerIntegration(ga4Integration);
    registerIntegration(tiktokIntegration);
    initTracking();
  }, []);

  // -------------------------------------------------------------------
  // 4. cart:add event listener — tracking + abandon timer reset
  // -------------------------------------------------------------------
  useEffect(() => {
    const handler = () => {
      // Fire AddToCart tracking event
      if (flags.tracking()) {
        const items = useCartStore.getState().items;
        const lastItem = items[items.length - 1];
        if (lastItem) {
          trackEvent("AddToCart", {
            productId: lastItem.id,
            variant: lastItem.selectedVariant,
            quantity: lastItem.quantity,
            price: lastItem.price,
          });
        }
      }

      // Reset abandoned cart timer on activity
      if (flags.abandonedCart()) {
        resetAbandonTimer();
      }

      // Record demand signal for pricing engine
      if (flags.pricing()) {
        const items = useCartStore.getState().items;
        const lastItem = items[items.length - 1];
        if (lastItem) {
          recordDemandSignal(lastItem.id, "cartAdd");
        }
      }
    };

    window.addEventListener("cart:add", handler);
    return () => window.removeEventListener("cart:add", handler);
  }, []);

  // -------------------------------------------------------------------
  // 5. Route-based tracking — ViewContent, InitiateCheckout, Purchase
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!flags.tracking()) return;

    // Product page → ViewContent
    const productMatch = location.pathname.match(/^\/product\/(.+)$/);
    if (productMatch) {
      trackEvent("ViewContent", { productId: productMatch[1] });
    }

    // Checkout page → InitiateCheckout
    if (location.pathname === "/checkout") {
      trackEvent("InitiateCheckout", {
        items: useCartStore.getState().items,
      });
    }

    // Success page → Purchase
    if (location.pathname === "/success") {
      trackEvent("Purchase", {
        items: useCartStore.getState().items,
      });
    }
  }, [location.pathname]);

  // -------------------------------------------------------------------
  // 6. Abandoned Cart — timer-based detection
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!flags.abandonedCart()) return;

    const cleanup = startAbandonmentTracking(
      () => useCartStore.getState().items,
      () => user?.id ?? null
    );

    return cleanup;
  }, [user?.id]);

  // -------------------------------------------------------------------
  // 7. Heatmap — Microsoft Clarity
  // -------------------------------------------------------------------
  useEffect(() => {
    initHeatmap(); // internally checks flag
  }, []);

  // -------------------------------------------------------------------
  // 8. AI Pricing — warm cache on startup
  // -------------------------------------------------------------------
  useEffect(() => {
    warmPricingCache(); // internally checks flag
  }, []);

  // -------------------------------------------------------------------
  // 9. Route-based demand signals for pricing engine
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!flags.pricing()) return;

    const productMatch = location.pathname.match(/^\/product\/(.+)$/);
    if (productMatch) {
      recordDemandSignal(productMatch[1], "view");
    }
  }, [location.pathname]);
}
