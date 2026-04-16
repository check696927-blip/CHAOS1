import { useMemo, lazy, Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { useCartStore } from "@/store/cart";
import { flyToCart } from "@/utils/flyToCart";
import { CART_EMOJIS } from "@/constants/cartEmojis";
import { PRODUCTS } from "@/constants/products";

import { MiniHero } from "@/components/mini/MiniHero";
import { MiniStory } from "@/components/mini/MiniStory";
import { MiniBenefits } from "@/components/mini/MiniBenefits";
import { MiniUrgency } from "@/components/mini/MiniUrgency";
import { MiniStickyCTA } from "@/components/mini/MiniStickyCTA";

const MiniVideoSection = lazy(() =>
  import("@/components/mini/MiniVideoSection").then((m) => ({
    default: m.MiniVideoSection,
  }))
);
const ReviewSection = lazy(() =>
  import("@/components/features/ReviewSection").then((m) => ({
    default: m.ReviewSection,
  }))
);

export default function MiniStore() {
  const addItem = useCartStore((s) => s.addItem);

  const product = useMemo(() => {
    return (
      PRODUCTS.find((p) => p.id === "anime-joggers-001") ||
      PRODUCTS[0]
    );
  }, []);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const emoji = CART_EMOJIS[Math.floor(Math.random() * CART_EMOJIS.length)];

    addItem({
      id: product.id,
      quantity: 1,
      name: product.name,
      image: product.image,
      price: product.price,
      selectedSize: product.sizes?.[1] || product.sizes?.[0],
      selectedVariant: product.variants?.[0]?.id,
    });

    flyToCart(emoji, rect.left + rect.width / 2, rect.top + rect.height / 2);

    // Pulse/open the cart drawer by simulating a click on the cart icon
    setTimeout(() => {
      const cartBtn = document.querySelector(
        "[data-cart-icon]"
      ) as HTMLElement | null;
      cartBtn?.click();
    }, 750);
  };

  return (
    <div className="min-h-screen bg-chaos-darker text-white overflow-x-hidden">
      <AnnouncementBar />
      <Header />

      <MiniHero
        image={product.image}
        headline={product.name}
        subhead="One product. Zero compromise. Engineered for the ones who brace the wild."
        onBuy={handleAdd}
      />

      <MiniStory />

      <Suspense fallback={<div className="h-64" />}>
        <MiniVideoSection videos={[]} />
      </Suspense>

      <MiniBenefits />

      <MiniUrgency initialStock={product.stockCount ?? 17} minutes={15} />

      <section className="py-16 md:py-24 border-b border-chaos-purple/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-chaos text-4xl md:text-6xl neon-text-red mb-3">
              THE VERDICT
            </h2>
            <p className="font-neon text-white/60 tracking-widest text-sm">
              REAL REVIEWS. NO FILTER.
            </p>
          </div>
          <Suspense
            fallback={
              <div className="text-center text-white/40 font-neon">
                Loading reviews...
              </div>
            }
          >
            <ReviewSection productId={product.id} />
          </Suspense>
        </div>
      </section>

      <section className="py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-chaos text-5xl md:text-7xl neon-text-purple mb-6">
            LAST CHANCE.
          </h2>
          <p className="font-neon text-white/70 max-w-xl mx-auto mb-8">
            When it's gone, it's gone. This drop won't be restocked.
          </p>
          <button
            onClick={handleAdd}
            className="px-10 py-5 bg-chaos-red text-white font-chaos text-2xl tracking-wider neon-box-glow holographic-button hover:bg-chaos-pink transition-colors"
          >
            CLAIM YOURS → ${product.price}
          </button>
        </div>
      </section>

      <footer className="py-10 text-center border-t border-white/10">
        <p className="font-neon text-white/40 text-xs tracking-widest">
          © CHAOS — BRACE THE WILD
        </p>
      </footer>

      <MiniStickyCTA
        name={product.name}
        price={product.price}
        image={product.image}
        onAdd={handleAdd}
      />
    </div>
  );
}
