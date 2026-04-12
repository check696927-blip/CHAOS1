import chaosBearLogo from "@/assets/chaos-bear-logo.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://cdn-ai.onspace.ai/onspace/files/CNE4o9aTMWcr2BoJfHxo3Z/hero-bg.jpg" 
          alt="Dripping Neon Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-chaos-darker/80 via-chaos-dark/60 to-chaos-darker"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Bear Logo Large with Circular Mask */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-40 h-40 md:w-56 md:h-56">
            <img 
              src={chaosBearLogo}
              alt="CHAOS Bear" 
              className="w-full h-full object-cover rounded-full border-4 border-chaos-purple/30 shadow-[0_0_60px_rgba(157,0,255,0.6),0_0_100px_rgba(255,0,85,0.4)] animate-float"
            />
          </div>
        </div>

        {/* CHAOS Text with Dripping Effect */}
        <div className="relative mb-6">
          <h1 className="font-chaos text-7xl md:text-9xl neon-text-red tracking-wider relative inline-block">
            CHAOS
            {/* Dripping SVG Effect */}
            <svg className="absolute -bottom-8 left-0 w-full h-16 opacity-80" viewBox="0 0 400 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dripGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF0055" stopOpacity="1"/>
                  <stop offset="100%" stopColor="#9D00FF" stopOpacity="0.5"/>
                </linearGradient>
              </defs>
              {[30, 80, 140, 200, 260, 320, 370].map((x, i) => (
                <path
                  key={i}
                  d={`M${x},0 L${x},${20 + Math.random() * 30} Q${x + 3},${30 + Math.random() * 20} ${x},${40 + Math.random() * 20}`}
                  stroke="url(#dripGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  className="drip-svg"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </svg>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="font-neon text-xl md:text-3xl neon-text-purple tracking-[0.3em] mb-12">
          BRACE THE WILD
        </p>

        {/* Description */}
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Unleash your inner savage with premium streetwear that defies the ordinary. 
          Bold designs, neon energy, and limitless chaos.
        </p>

        {/* CTA Button - Single Action */}
        <div className="flex justify-center">
          <a
            href="#new-drops"
            className="group relative bg-gradient-to-r from-chaos-red to-chaos-purple hover:from-chaos-purple hover:to-chaos-pink text-white font-bold py-4 px-10 rounded-lg neon-box-glow hover:scale-105 transition-all overflow-hidden"
          >
            <span className="relative z-10 font-neon tracking-wider text-lg">
              SHOP NEW DROPS
            </span>
            {/* Melting effect */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20 group-hover:animate-drip"></div>
          </a>
        </div>
      </div>
    </section>
  );
};
