/**
 * BundleSection Component
 *
 * "Buy together & save" bundle recommendations for ProductDetail page.
 * Feature-flag gated. Returns null when disabled.
 * Does NOT modify any existing layout.
 */
import { motion } from "framer-motion";
import { Package, Plus, ShoppingCart } from "lucide-react";
import { useBundles } from "@/hooks/useBundles";
import { useCartStore } from "@/store/cart";
import { useCurrency } from "@/lib/currency";
import { flags } from "@/services/featureFlags";

interface BundleSectionProps {
  productId: string;
}

export function BundleSection({ productId }: BundleSectionProps) {
  if (!flags.bundles()) return null;

  const { bundles } = useBundles(productId);
  const addItem = useCartStore((s) => s.addItem);
  const { convertPrice, formatPrice } = useCurrency();

  if (bundles.length === 0) return null;

  const handleAddBundle = (
    products: import("@/types").Product[]
  ) => {
    for (const product of products) {
      const firstVariant = product.variants?.[0];
      addItem({
        id: product.id,
        quantity: 1,
        selectedVariant: firstVariant?.id,
        name: product.name,
        image: firstVariant?.images?.[0] ?? product.image,
        price: firstVariant?.price ?? product.price,
      });
    }
    window.dispatchEvent(new Event("cart:add"));
  };

  return (
    <div className="space-y-6 border-t border-gray-800 pt-8 mt-8">
      <div className="flex items-center gap-3">
        <Package className="w-5 h-5 text-chaos-purple" />
        <h3 className="font-neon font-bold text-2xl">Buy Together & Save</h3>
      </div>

      <div className="space-y-4">
        {bundles.map((bundle) => (
          <motion.div
            key={bundle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-5"
          >
            {/* Bundle header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-chaos-purple uppercase tracking-wider">
                {bundle.name}
              </span>
              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                Save {bundle.discountPercent}%
              </span>
            </div>

            {/* Product row */}
            <div className="flex items-center gap-3 mb-4">
              {bundle.products.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-3">
                  {idx > 0 && (
                    <Plus className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  )}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <img
                      src={product.variants?.[0]?.images?.[0] ?? product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate max-w-[120px]">
                        {product.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatPrice(convertPrice(product.price * 0.8))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing + CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-800">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 line-through text-sm">
                  {formatPrice(convertPrice(bundle.originalTotal * 0.8))}
                </span>
                <span className="text-white font-bold text-lg">
                  {formatPrice(convertPrice(bundle.bundlePrice * 0.8))}
                </span>
                <span className="text-green-400 text-xs">
                  (−{formatPrice(convertPrice(bundle.savings * 0.8))})
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAddBundle(bundle.products)}
                className="flex items-center gap-2 bg-gradient-to-r from-chaos-red to-chaos-purple text-white font-bold py-2.5 px-5 rounded-lg text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                Add Bundle
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
