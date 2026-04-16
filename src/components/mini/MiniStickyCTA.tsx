import { useEffect, useState } from "react";

interface MiniStickyCTAProps {
  name: string;
  price: number;
  image: string;
  onAdd: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function MiniStickyCTA({ name, price, image, onAdd }: MiniStickyCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-chaos-darker/95 backdrop-blur-md border-t border-chaos-red/60 shadow-[0_-10px_30px_rgba(255,0,85,0.3)]">
        <div className="container mx-auto px-3 py-3 flex items-center gap-3">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover border border-chaos-red/50 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="font-chaos text-sm md:text-base truncate text-white">
              {name}
            </div>
            <div className="font-neon text-xs md:text-sm text-chaos-cyan">
              ${price.toFixed(2)}
            </div>
          </div>
          <button
            onClick={onAdd}
            className="px-4 md:px-8 py-3 bg-chaos-red text-white font-chaos tracking-wider text-sm md:text-base rounded-lg neon-box-glow hover:bg-chaos-pink transition-colors whitespace-nowrap"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}
