/**
 * useLandingContext Hook
 *
 * Exposes traffic source and dynamic content overrides.
 * Computed once on mount and memoized.
 */
import { useMemo } from "react";
import { detectSource, type LandingContext } from "@/services/landingEngine";

export function useLandingContext(): LandingContext {
  return useMemo(() => detectSource(), []);
}
