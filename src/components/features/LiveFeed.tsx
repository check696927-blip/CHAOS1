/**
 * LiveFeed Component
 *
 * Floating bottom-left notification showing recent purchases.
 * "Someone in {city} just bought {product}" — either real
 * (from Supabase orders) or simulated as a fallback.
 *
 * Feature-flag gated: renders null when VITE_ENABLE_LIVE_FEED is not "true".
 */
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { flags } from "@/services/featureFlags";
import { subscribeToLivePurchases } from "@/services/liveFeed";
import type { LivePurchaseEvent } from "@/services/types";

const DISPLAY_DURATION = 5000; // 5 seconds

export function LiveFeed() {
  if (!flags.liveFeed()) return null;

  const [current, setCurrent] = useState<LivePurchaseEvent | null>(null);
  const queue = useRef<LivePurchaseEvent[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isShowing = useRef(false);

  const showNext = useCallback(() => {
    if (queue.current.length === 0) {
      isShowing.current = false;
      return;
    }

    isShowing.current = true;
    const next = queue.current.shift()!;
    setCurrent(next);

    timeoutRef.current = setTimeout(() => {
      setCurrent(null);
      // Small delay between notifications
      setTimeout(() => showNext(), 500);
    }, DISPLAY_DURATION);
  }, []);

  const handleNewPurchase = useCallback(
    (event: LivePurchaseEvent) => {
      queue.current.push(event);
      if (!isShowing.current) {
        showNext();
      }
    },
    [showNext]
  );

  const dismiss = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrent(null);
    setTimeout(() => showNext(), 300);
  }, [showNext]);

  useEffect(() => {
    const unsubscribe = subscribeToLivePurchases(handleNewPurchase);

    return () => {
      unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleNewPurchase]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 25,
          }}
          className="fixed bottom-4 left-4 z-30 max-w-[320px] bg-[#0a0a1a]/95 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-900/20 overflow-hidden"
        >
          <div className="flex items-center gap-3 p-3">
            {/* Product thumbnail */}
            {current.productImage ? (
              <img
                src={current.productImage}
                alt={current.productName}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={20} className="text-purple-400" />
              </div>
            )}

            {/* Purchase info */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-gray-400">
                Someone in{" "}
                <span className="text-cyan-400 font-medium">
                  {current.city}
                </span>{" "}
                just bought
              </p>
              <p className="text-white text-xs font-bold truncate mt-0.5">
                {current.productName}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {formatTimeAgo(current.timestamp)}
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={dismiss}
              className="flex-shrink-0 p-1 text-gray-500 hover:text-white transition-colors"
            >
              <X size={12} />
            </button>
          </div>

          {/* Auto-dismiss progress bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: DISPLAY_DURATION / 1000, ease: "linear" }}
            className="h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}
