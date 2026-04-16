/**
 * UpsellSection Component
 *
 * Self-contained upsell UI for CartDrawer. Displays 2-3 complementary
 * product recommendations in a horizontal scroll.
 *
 * Feature-flag gated: renders null when VITE_ENABLE_UPSELLS is not "true".
 * Dispatches cart:add event when items are added, preserving existing flow.
 */
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { useUpsells } from "@/hooks/useUpsells";
import { useCartStore } from "@/store/cart";
import { useCurrency } from "@/lib/currency";
import { flags } from "@/services/featureFlags";
import type { Product } from "@/types";

export function UpsellSection() {
  if (!flags.upsells()) return null;

  const { products } = useUpsells();
  const addItem = useCartStore((s) => s.addItem);
  const { convertPrice, formatPrice } = useCurrency();

  if (products.length === 0) return null;

  const handleAdd = (product: Product) => {
    const firstVariant = product.variants?.[0];

    addItem({
      id: product.id,
      quantity: 1,
      selectedVariant: firstVariant?.id,
      name: product.name,
      image: firstVariant?.images?.[0] ?? product.image,
      price: firstVariant?.price ?? product.price,
    });

    // Dispatch cart:add to trigger existing notification + tracking
    window.dispatchEvent(new Event("cart:add"));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="px-6 py-4 border-t border-pink-500/20"
      >
        {/* Section header */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-purple-400" />
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            Complete Your Look
          </span>
        </div>

        {/* Horizontal scroll of product cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {products.map((product) => {
            const displayPrice =
              product.variants?.[0]?.price ?? product.price;
            const discountedPrice = displayPrice * 0.8;

            return (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 w-[140px] bg-white/5 rounded-lg border border-purple-500/20 overflow-hidden"
              >
                {/* Product image */}
                <div className="w-full h-[100px] overflow-hidden">
                  <img
                    src={
                      product.variants?.[0]?.images?.[0] ?? product.image
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Product info */}
                <div className="p-2 space-y-1">
                  <p className="text-white text-[11px] font-semibold leading-tight line-clamp-2">
                    {product.name}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500 text-[10px] line-through">
                      {formatPrice(convertPrice(displayPrice))}
                    </span>
                    <span className="text-purple-400 text-xs font-bold">
                      {formatPrice(convertPrice(discountedPrice))}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAdd(product)}
                    className="w-full mt-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded bg-gradient-to-r from-pink-600 to-purple-600 text-white flex items-center justify-center gap-1"
                  >
                    <Plus size={10} />
                    Add
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
