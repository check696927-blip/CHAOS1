/**
 * Dynamic Landing Engine
 *
 * Detects traffic source from UTM params and referrer,
 * returns context-aware headline/subtitle/urgency overrides.
 * Does NOT modify layout — only provides data.
 */
import { flags } from "@/services/featureFlags";

// ---------------------------------------------------------------------------
// Source detection
// ---------------------------------------------------------------------------

export type TrafficSource =
  | "tiktok"
  | "instagram"
  | "facebook"
  | "google"
  | "twitter"
  | "youtube"
  | "direct"
  | "unknown";

export interface LandingContext {
  source: TrafficSource;
  headline?: string;
  subtitle?: string;
  urgencyLabel?: string;
  campaign?: string;
}

const SOURCE_PROFILES: Record<
  Exclude<TrafficSource, "direct" | "unknown">,
  { headline: string; subtitle: string; urgencyLabel: string }
> = {
  tiktok: {
    headline: "CHAOS",
    subtitle: "AS SEEN ON TIKTOK",
    urgencyLabel: "Trending Now — Limited Drop",
  },
  instagram: {
    headline: "CHAOS",
    subtitle: "EXCLUSIVE IG DROP",
    urgencyLabel: "Instagram Exclusive — 24hr Access",
  },
  facebook: {
    headline: "CHAOS",
    subtitle: "SPECIAL COLLECTION",
    urgencyLabel: "Flash Sale — While Stocks Last",
  },
  google: {
    headline: "CHAOS",
    subtitle: "BRACE THE WILD",
    urgencyLabel: "Free Shipping on First Order",
  },
  twitter: {
    headline: "CHAOS",
    subtitle: "X EXCLUSIVE DROP",
    urgencyLabel: "Limited Edition — Don't Miss Out",
  },
  youtube: {
    headline: "CHAOS",
    subtitle: "CREATOR'S PICK",
    urgencyLabel: "Featured Drop — Selling Fast",
  },
};

/**
 * Detect the traffic source from URL params and document.referrer.
 */
export function detectSource(): LandingContext {
  if (!flags.dynamicLanding()) {
    return { source: "direct" };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source")?.toLowerCase();
    const utmCampaign = params.get("utm_campaign") ?? undefined;
    const referrer = document.referrer?.toLowerCase() ?? "";

    let source: TrafficSource = "direct";

    // Check UTM first (higher priority)
    if (utmSource) {
      if (utmSource.includes("tiktok")) source = "tiktok";
      else if (utmSource.includes("instagram") || utmSource.includes("ig"))
        source = "instagram";
      else if (utmSource.includes("facebook") || utmSource.includes("fb"))
        source = "facebook";
      else if (utmSource.includes("google")) source = "google";
      else if (utmSource.includes("twitter") || utmSource.includes("x.com"))
        source = "twitter";
      else if (utmSource.includes("youtube") || utmSource.includes("yt"))
        source = "youtube";
      else source = "unknown";
    }
    // Fallback to referrer
    else if (referrer) {
      if (referrer.includes("tiktok.com")) source = "tiktok";
      else if (referrer.includes("instagram.com")) source = "instagram";
      else if (referrer.includes("facebook.com") || referrer.includes("fb.com"))
        source = "facebook";
      else if (referrer.includes("google.")) source = "google";
      else if (referrer.includes("twitter.com") || referrer.includes("x.com"))
        source = "twitter";
      else if (referrer.includes("youtube.com")) source = "youtube";
    }

    const profile = SOURCE_PROFILES[source as keyof typeof SOURCE_PROFILES];

    return {
      source,
      headline: profile?.headline,
      subtitle: profile?.subtitle,
      urgencyLabel: profile?.urgencyLabel,
      campaign: utmCampaign,
    };
  } catch {
    return { source: "direct" };
  }
}
