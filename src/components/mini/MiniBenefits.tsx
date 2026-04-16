import { motion } from "framer-motion";
import { Zap, ShieldCheck, Truck, Flame } from "lucide-react";

const BENEFITS = [
  {
    icon: Flame,
    title: "PREMIUM BUILD",
    text: "Heavyweight fabric. Made to survive the chaos.",
    color: "text-chaos-red",
  },
  {
    icon: Zap,
    title: "INSTANT SHIP",
    text: "Dispatched in 24h. Straight to your door.",
    color: "text-chaos-cyan",
  },
  {
    icon: ShieldCheck,
    title: "30-DAY GUARANTEE",
    text: "Not feral enough? Send it back, no questions.",
    color: "text-chaos-purple",
  },
  {
    icon: Truck,
    title: "FREE SHIPPING $50+",
    text: "Hit the threshold. Keep the cash.",
    color: "text-chaos-pink",
  },
];

export function MiniBenefits() {
  return (
    <section className="py-16 md:py-24 border-b border-chaos-cyan/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-chaos text-4xl md:text-6xl neon-text-cyan mb-3">
            WHY CHAOS
          </h2>
          <p className="font-neon text-white/60 tracking-widest text-sm">
            NOT ANOTHER BRAND.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative p-5 md:p-6 bg-chaos-dark/60 backdrop-blur-sm border border-white/10 rounded-xl hover:border-chaos-red/60 transition-colors group"
            >
              <b.icon
                className={`w-8 h-8 md:w-10 md:h-10 mb-3 ${b.color} group-hover:scale-110 transition-transform`}
              />
              <h3 className="font-chaos text-base md:text-lg text-white mb-2">
                {b.title}
              </h3>
              <p className="font-neon text-xs md:text-sm text-white/60 leading-relaxed">
                {b.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
