/**
 * Heatmap + Session Replay Integration
 *
 * Injects Microsoft Clarity script for heatmaps, session replays,
 * and behavioral analytics. Feature-flag gated.
 */
import { flags } from "@/services/featureFlags";

let initialized = false;

/**
 * Initialize Microsoft Clarity.
 * Injects the Clarity script tag into the document head.
 * No-ops if already initialized or if the flag/ID is missing.
 */
export function initHeatmap(): void {
  if (!flags.heatmap()) return;
  if (initialized) return;

  const clarityId = import.meta.env.VITE_CLARITY_ID;
  if (!clarityId) {
    console.info("[heatmap] VITE_CLARITY_ID not set — skipping Clarity init");
    return;
  }

  try {
    // Microsoft Clarity snippet
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.textContent = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");
    `;

    document.head.appendChild(script);
    initialized = true;
  } catch (err) {
    console.warn("[heatmap] Failed to initialize Clarity:", err);
  }
}
