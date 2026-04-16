import { useState, useEffect } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/features/HeroSection";
import { ProductCard } from "@/components/features/ProductCard";
import { DiscountPopup } from "@/components/features/DiscountPopup";

import { SoundReactiveBackground } from "@/components/features/SoundReactiveBackground";
import { InteractionEffects } from "@/components/features/InteractionEffects";
import { IntensityControl } from "@/components/features/IntensityControl";
import { useWishlist } from "@/hooks/useWishlist";
import { useInteractionEffects } from "@/hooks/useInteractionEffects";
import { useLandingContext } from "@/hooks/useLandingContext";
import { PRODUCTS } from "@/constants/products";

const Index = () => {
  const { toggleItem, isInWishlist } = useWishlist();
  const { effects, settings, updateSettings } = useInteractionEffects();
  const landing = useLandingContext();
  const [showPopup, setShowPopup] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  useEffect(() => {
    // Show discount popup after 12 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem('chaos_popup_seen');
      if (!hasSeenPopup) {
        setShowPopup(true);
        sessionStorage.setItem('chaos_popup_seen', 'true');
      }
    }, 12000);

    return () => clearTimeout(timer);
  }, []);

  const categories = ['NEW DROPS', 'BEST SELLERS', 'ACCESSORIES'];

  return (
    <div className="min-h-screen bg-chaos-darker text-white relative">
      {/* Sound Reactive Background */}
      <SoundReactiveBackground />
      
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection
        headline={landing.headline}
        subtitle={landing.subtitle}
        urgencyLabel={landing.urgencyLabel}
      />

      {/* Jump directly to NEW DROPS */}
      <div id="new-drops" className="scroll-mt-20"></div>

      {/* Product Sections */}
      <main className="container mx-auto px-4 py-16 space-y-24">
        {categories.map((category) => {
          const categoryProducts = PRODUCTS.filter((p) => p.category === category);
          const sectionId = category === 'NEW DROPS' ? 'new-drops' : category.toLowerCase().replace(' ', '-');

          return (
            <section key={category} id={sectionId} className="scroll-mt-20">
              {/* Category Header */}
              <div className="mb-12 text-center">
                <h2 className="font-chaos text-4xl md:text-6xl neon-text-red mb-4 tracking-wider relative inline-block">
                  {category}
                  {/* Subtle drip effect */}
                  <svg className="absolute -bottom-4 left-0 w-full h-8 opacity-60" viewBox="0 0 400 30" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`section-drip-${sectionId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FF0055" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#9D00FF" stopOpacity="0.3"/>
                      </linearGradient>
                    </defs>
                    {[50, 120, 200, 280, 350].map((x, i) => (
                      <path
                        key={i}
                        d={`M${x},0 L${x},${10 + Math.random() * 15}`}
                        stroke={`url(#section-drip-${sectionId})`}
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        className="animate-drip"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </svg>
                </h2>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isInWishlist={isInWishlist(product.id)}
                    onToggleWishlist={toggleItem}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="border-t border-chaos-red/30 bg-chaos-dark py-12 mt-24">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img 
              src="https://cdn-ai.onspace.ai/onspace/files/5FW5Jq6exi5rojAuoiQPtw/bear-logo.png" 
              alt="CHAOS Bear" 
              className="w-10 h-10 object-contain opacity-80"
            />
            <h3 className="font-chaos text-xl neon-text-red">CHAOS</h3>
          </div>
          <div className="flex justify-center items-center gap-6 my-4 flex-wrap">
            <a href="https://www.instagram.com/chaosmerch1?igsh=cmg1NTlhOGJoNGo4" target="_blank" rel="noopener noreferrer"
               className="text-white text-xl transition-all duration-300 hover:text-pink-500 hover:drop-shadow-[0_0_10px_#ff00ff]">
              <i className="fab fa-instagram"></i>
            </a>

            <a href="https://www.tiktok.com/@chaos.merch?_r=1&_t=ZS-95ViTQnvc8t" target="_blank" rel="noopener noreferrer"
               className="text-white text-xl transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_10px_#00f2ea]">
              <i className="fab fa-tiktok"></i>
            </a>

            <a href="https://www.facebook.com/share/1CceDzksA3/" target="_blank" rel="noopener noreferrer"
               className="text-white text-xl transition-all duration-300 hover:text-blue-500 hover:drop-shadow-[0_0_10px_#1877f2]">
              <i className="fab fa-facebook"></i>
            </a>

            <a href="https://x.com/CHAOS158761" target="_blank" rel="noopener noreferrer"
               className="text-white text-xl transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_10px_#1da1f2]">
              <i className="fab fa-x-twitter"></i>
            </a>
          </div>
          <p className="text-gray-500 text-sm font-neon tracking-wider">
            BRACE THE WILD © 2026
          </p>
          <p className="text-gray-600 text-xs">
            Premium streetwear brand • Bold designs • Limitless energy
          </p>
        </div>
      </footer>

      {/* Discount Popup */}
      {showPopup && <DiscountPopup onClose={() => setShowPopup(false)} />}


    </div>
  );
};

export default Index;