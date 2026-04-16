import { motion } from "framer-motion";

export function MiniStory() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden border-b border-chaos-red/20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-chaos-red/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-neon text-chaos-red tracking-[0.3em] text-xs mb-4">
              THE PROBLEM
            </div>
            <h3 className="font-chaos text-3xl md:text-5xl text-white mb-5 leading-tight">
              BORING FITS. <br /> DEAD STYLE.
            </h3>
            <p className="font-neon text-white/70 leading-relaxed">
              Everyone's wearing the same filtered, sanitized basics. Mass-produced. Forgettable. You deserve more than a logo and a tag.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative p-8 rounded-2xl bg-chaos-dark/70 border border-chaos-cyan/40 neon-box-glow"
          >
            <div className="font-neon text-chaos-cyan tracking-[0.3em] text-xs mb-4">
              THE SOLUTION
            </div>
            <h3 className="font-chaos text-3xl md:text-5xl neon-text-cyan mb-5 leading-tight">
              BRACE THE WILD.
            </h3>
            <p className="font-neon text-white/80 leading-relaxed">
              Engineered chaos. Limited drops. Loud silhouettes built for the ones who refuse to blend in. This isn't streetwear — it's a statement.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
