import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "@/constants/products";
import { useCurrency } from "@/lib/currency";
import { X, Trash2, Plus, Minus, Truck } from "lucide-react";
import { UpsellSection } from "@/engines/UpsellSection";

const safeNum = (v: unknown) => {
  const n = Number(v);
  return isNaN(n) || !isFinite(n) ? 0 : n;
};

const ROW_HEIGHT = 140;
const BUFFER_ROWS = 6;

/* GLOBAL CONFIG READY */
const FREE_SHIPPING_THRESHOLD = 50;
const DISCOUNT_MULTIPLIER = 0.8;

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const navigate = useNavigate();
  const { convertPrice, formatPrice } = useCurrency();

  const rawSubtotal = useMemo(
    () =>
      items.reduce((acc, item) => {
        const product = PRODUCTS.find((p) => p.id === item.id);
        if (!product) return acc;

        const variant = item.selectedVariant
          ? product.variants?.find((v) => v.id === item.selectedVariant)
          : null;

        const basePrice = safeNum(variant?.price ?? product.price ?? 0);

        return acc + basePrice * DISCOUNT_MULTIPLIER * safeNum(item.quantity);
      }, 0),
    [items]
  );

  const shippingProgress = useMemo(() => {
    const qualified = rawSubtotal >= FREE_SHIPPING_THRESHOLD;
    const remaining = Math.max(FREE_SHIPPING_THRESHOLD - rawSubtotal, 0);
    const progress = Math.min((rawSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

    return { progress, remaining, qualified };
  }, [rawSubtotal]);

  const [animatedSubtotal, setAnimatedSubtotal] = useState(rawSubtotal);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const start = animatedSubtotal;
    const end = rawSubtotal;
    const duration = 300;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setAnimatedSubtotal(start + (end - start) * ease);

      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [rawSubtotal]);

  useEffect(() => {
    const handler = () => {
      setAnimatedSubtotal((prev) => prev + 0);
    };

    window.addEventListener("cart:add", handler);
    return () => window.removeEventListener("cart:add", handler);
  }, []);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: 20,
  });

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;

    setVisibleRange({
      start: Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS),
      end: Math.min(
        items.length,
        Math.ceil((scrollTop + clientHeight) / ROW_HEIGHT) + BUFFER_ROWS
      ),
    });
  }, [items.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    handleScroll();
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const totalQuantity = items.reduce(
    (acc, item) => acc + safeNum(item.quantity),
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 h-full w-full sm:w-[460px] bg-[#050510] z-50 flex flex-col shadow-2xl"
          >
            <div className="px-6 py-6 border-b border-pink-500/20 flex justify-between">
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  CART VAULT
                </h2>
                <p className="text-sm text-gray-400">{totalQuantity} Items</p>
              </div>

              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
                <X size={22} />
              </motion.button>
            </div>

            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto relative px-6"
              style={{ contain: "layout paint size" }}
            >
              <div
                style={{
                  height: items.length * ROW_HEIGHT,
                  position: "relative",
                }}
              >
                {items
                  .slice(visibleRange.start, visibleRange.end)
                  .map((item, index) => {
                    const product = PRODUCTS.find((p) => p.id === item.id);
                    if (!product) return null;

                    const variant = item.selectedVariant
                      ? product.variants?.find(
                          (v) => v.id === item.selectedVariant
                        )
                      : null;

                    const name = variant?.name || product.name;
                    const image = variant?.images?.[0] || product.image;

                    const price =
                      safeNum(variant?.price ?? product.price ?? 0) *
                      DISCOUNT_MULTIPLIER;

                    return (
                      <motion.div
                        key={`${item.id}-${item.selectedVariant ?? "base"}-${item.selectedSize ?? "std"}`}
                        style={{
                          position: "absolute",
                          top: (visibleRange.start + index) * ROW_HEIGHT,
                          width: "100%",
                          height: ROW_HEIGHT,
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 40,
                        }}
                      >
                        <div className="flex gap-4 bg-purple-950/20 rounded-xl p-3 h-full">
                          <img
                            src={image}
                            loading="lazy"
                            alt={name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />

                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between">
                              <h3 className="text-white text-sm font-bold">
                                {name}
                              </h3>

                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  removeItem(
                                    item.id,
                                    item.selectedVariant,
                                    item.selectedSize
                                  )
                                }
                              >
                                <Trash2 size={14} />
                              </motion.button>
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, safeNum(item.quantity) - 1),
                                    item.selectedVariant,
                                    item.selectedSize
                                  )
                                }
                              >
                                <Minus size={14} />
                              </motion.button>

                              <span className="text-white font-bold">
                                {item.quantity}
                              </span>

                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    safeNum(item.quantity) + 1,
                                    item.selectedVariant,
                                    item.selectedSize
                                  )
                                }
                              >
                                <Plus size={14} />
                              </motion.button>

                              <span className="ml-auto font-bold">
                                {formatPrice(
                                  convertPrice(
                                    price * safeNum(item.quantity)
                                  )
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>

            <UpsellSection />

            <div className="p-6 border-t border-pink-500/20 space-y-4">
              {!shippingProgress.qualified && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-gray-400">
                        Free shipping at ${FREE_SHIPPING_THRESHOLD}
                      </span>
                    </div>

                    <span className="text-cyan-400 font-semibold">
                      ${shippingProgress.remaining.toFixed(2)} away
                    </span>
                  </div>

                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingProgress.progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {shippingProgress.qualified && (
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping 🎉</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-300">Total</span>

                <span className="font-bold text-xl">
                  {formatPrice(convertPrice(animatedSubtotal))}
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full py-3 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 font-bold text-white shadow-lg disabled:cursor-not-allowed transition-all"
              >
                RELEASE CHAOS
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;