import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface AddToCartNotificationProps {
  show: boolean;
  itemName: string;
  quantity: number;
  itemImage?: string;
  onHide?: () => void;
}

export const AddToCartNotification = ({
  show,
  itemName,
  quantity,
  itemImage,
  onHide,
}: AddToCartNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        onHide?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-24 right-4 sm:right-8 z-50 max-w-sm"
        >
          <div className="relative rounded-xl p-4 bg-[#0a0a18] border border-pink-500/30 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" fill="currentColor" />
                </div>
              </div>

              {itemImage && (
                <img
                  src={itemImage}
                  alt={itemName}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}

              <div className="flex-1">
                <p className="text-green-400 font-bold text-sm">
                  ADDED TO CART
                </p>
                <p className="text-white text-sm font-semibold truncate">
                  {itemName}
                </p>
                <p className="text-xs text-gray-400">
                  Quantity: {quantity}
                </p>
              </div>
            </div>

            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};