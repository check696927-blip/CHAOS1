import { ShoppingCart, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartStore, selectCartCount } from "@/store/cart";
import { CartDrawer } from "@/components/features/CartDrawer";
import { MobileMenu } from "@/components/features/MobileMenu";
import { AuthModal } from "@/components/features/AuthModal";
import { CurrencySelector } from "@/components/features/CurrencySelector";
import { useAuth } from "@/hooks/useAuth";
import { detectUserCurrency } from "@/lib/currency";
import { Currency } from "@/types";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { motion, AnimatePresence } from "framer-motion";
import { MOTION } from "@/lib/motionPresets";

/* ================= PARTICLE ================= */

const Particle = ({ delay, angle }: { delay: number; angle: number }) => {
  const distance = 18 + Math.random() * 8;
  const angleRad = (angle * Math.PI) / 180;

  const xOffset = Math.cos(angleRad) * distance;
  const yOffset = Math.sin(angleRad) * distance;

  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: xOffset, y: yOffset, opacity: 0, scale: 0.5 }}
      transition={{
        duration: MOTION.cartBadge.particle.duration,
        delay,
        ease: "easeOut",
      }}
    />
  );
};

interface HeaderProps {
  cartItemCount?: number;
  wishlistItemCount?: number;
  onOpenWishlist?: () => void;
}

export const Header = (props?: HeaderProps) => {

  const { user, isAuthenticated } = useAuth();

  const cartItemCount = useCartStore(selectCartCount);

  const { displayValue: animatedCount, isAnimating } =
    useAnimatedCounter(cartItemCount, 400);

  const prevCountRef = useRef(cartItemCount);

  const [showEffects, setShowEffects] = useState(false);
  const [particleKey, setParticleKey] = useState(0);
  const [addedAmount, setAddedAmount] = useState(0);
  const [showAddIndicator, setShowAddIndicator] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const [currency, setCurrency] = useState<Currency>(() => detectUserCurrency());

  /* ================= CART EFFECT ================= */

  useEffect(() => {

    const prev = prevCountRef.current;

    if (cartItemCount > prev) {

      const difference = cartItemCount - prev;

      setShowEffects(true);
      setParticleKey((k) => k + 1);

      setAddedAmount(difference);
      setShowAddIndicator(true);

      const timer = setTimeout(() => setShowEffects(false), 600);

      return () => clearTimeout(timer);
    }

    prevCountRef.current = cartItemCount;

  }, [cartItemCount]);

  /* ================= NAVIGATION ================= */

  const handleNavigation = (section: string) => {

    const element = document.getElementById(section);

    if (!element) return;

    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-chaos-darker/95 backdrop-blur-md border-b border-chaos-red/30">

        <div className="container mx-auto px-4">

          <div className="flex items-center justify-between h-20">

            {/* ================= LOGO ================= */}

            <button
              onClick={() => {
                if (location.pathname !== "/") {
                  navigate("/");
                }
              }}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-11 h-11">
                <img
                  src="https://cdn-ai.onspace.ai/onspace/files/dygAGWMY8Juq7Fix5a4kHk/IMG_20260206_203558.jpg"
                  alt="CHAOS Bear"
                  className="w-full h-full object-cover rounded-full border-2 border-chaos-purple/40 shadow-[0_0_20px_rgba(157,0,255,0.4)]"
                />
              </div>

              <div className="hidden sm:block">
                <h1 className="font-chaos text-2xl neon-text-red leading-none tracking-wider">
                  CHAOS
                </h1>

                <p className="font-neon text-[10px] neon-text-purple tracking-[0.3em] -mt-1">
                  BRACE THE WILD
                </p>
              </div>
            </button>

            {/* ================= DESKTOP NAV ================= */}

            <nav className="hidden md:flex items-center gap-8">

              <button
                onClick={() => handleNavigation("new-drops")}
                className="font-neon text-sm hover:text-chaos-red transition-colors"
              >
                NEW DROPS
              </button>

              <button
                onClick={() => handleNavigation("best-sellers")}
                className="font-neon text-sm hover:text-chaos-purple transition-colors"
              >
                BEST SELLERS
              </button>

              <button
                onClick={() => handleNavigation("accessories")}
                className="font-neon text-sm hover:text-chaos-cyan transition-colors"
              >
                ACCESSORIES
              </button>

            </nav>

            {/* ================= RIGHT SIDE ================= */}

            <div className="flex items-center gap-3">

              {/* Currency */}

              <div className="hidden md:block">
                <CurrencySelector
                  current={currency}
                  onChange={setCurrency}
                />
              </div>

              {/* ================= CART ================= */}

              <button
                onClick={() => setCartOpen(true)}
                data-cart-icon
                className="relative p-2 hover:bg-chaos-red/20 rounded-lg transition-all group"
              >

                <ShoppingCart className="w-6 h-6 text-chaos-red group-hover:scale-110 transition-transform" />

                <AnimatePresence>

                  {cartItemCount > 0 && (

                    <motion.div className="absolute -top-1 -right-1">

                      <motion.div
                        animate={showEffects ? MOTION.cartBadge.bounce : {}}
                        className="relative"
                      >

                        {/* Badge */}

                        <motion.div
                          animate={showEffects ? MOTION.cartBadge.glowPulse : {}}
                          className="w-5 h-5 rounded-full
                          bg-gradient-to-br from-purple-600 to-pink-600
                          flex items-center justify-center
                          border-2 border-[#050510]"
                        >

                          <motion.span
                            key={animatedCount}
                            initial={{ y: isAnimating ? 10 : 0, opacity: isAnimating ? 0 : 1 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="text-white text-xs font-black"
                          >
                            {animatedCount}
                          </motion.span>

                        </motion.div>

                        {/* Particles */}

                        {showEffects && (
                          <div key={particleKey} className="absolute inset-0 pointer-events-none">
                            {Array.from({
                              length: MOTION.cartBadge.particle.count,
                            }).map((_, i) => (
                              <Particle
                                key={i}
                                delay={i * 0.02}
                                angle={(360 / MOTION.cartBadge.particle.count) * i}
                              />
                            ))}
                          </div>
                        )}

                      </motion.div>

                      {/* +X Indicator */}

                      <AnimatePresence>

                        {showAddIndicator && (
                          <motion.div
                            initial={{ y: 0, opacity: 1 }}
                            animate={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            onAnimationComplete={() =>
                              setShowAddIndicator(false)
                            }
                            className="absolute -top-6 left-1/2 -translate-x-1/2"
                          >
                            <span className="text-xs font-black text-green-400">
                              +{addedAmount}
                            </span>
                          </motion.div>
                        )}

                      </AnimatePresence>

                    </motion.div>
                  )}

                </AnimatePresence>

              </button>

              {/* ================= MOBILE MENU ================= */}

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 hover:bg-chaos-purple/20 rounded-lg transition-all"
              >
                <Menu className="w-6 h-6 text-chaos-purple" />
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* DRAWERS + MODALS */}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};