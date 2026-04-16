import { motion } from "framer-motion";

interface MiniHeroProps {
  image: string;
  headline: string;
  subhead: string;
  onBuy: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function MiniHero({ image, headline, subhead, onBuy }: MiniHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-chaos-red/30">
      <div className="absolute inset-0 bg-gradient-to-br from-chaos-red/20 via-chaos-purple/10 to-chaos-cyan/10 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #FF0055 0%, transparent 40%), radial-gradient(circle at 80% 70%, #9D00FF 0%, transparent 45%)",
        }}
      />

      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-chaos-red/50 rounded-full bg-chaos-red/10 text-chaos-red text-xs font-neon tracking-[0.2em] animate-neon-pulse">
              ⚡ LIMITED DROP
            </div>
            <h1 className="font-chaos text-5xl md:text-7xl lg:text-8xl leading-none neon-text-red mb-6">
              {headline}
            </h1>
            <p className="font-neon text-lg md:text-xl text-white/80 mb-8 max-w-md">
              {subhead}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBuy}
                className="group relative px-8 py-4 bg-chaos-red text-white font-chaos text-xl tracking-wider neon-box-glow holographic-button overflow-hidden"
              >
                <span className="relative z-10">BUY NOW →</span>
                <span className="absolute inset-0 bg-chaos-purple translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              </button>
              <div className="flex items-center gap-2 text-chaos-cyan font-neon text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-chaos-cyan animate-pulse" />
                FREE SHIPPING $50+
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-chaos-red via-chaos-purple to-chaos-cyan blur-3xl opacity-40 animate-neon-pulse" />
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-chaos-red/60 neon-border-red">
              <img
                src={image}
                alt={headline}
                loading="eager"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm border border-chaos-cyan/60 rounded-full">
                <span className="font-neon text-xs text-chaos-cyan tracking-widest">
                  🔥 TRENDING
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
