import { useEffect, useRef } from "react";

interface MiniVideoSectionProps {
  videos: string[];
  posters?: string[];
}

export function MiniVideoSection({ videos, posters = [] }: MiniVideoSectionProps) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    refs.current.forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, [videos]);

  if (!videos.length) return null;

  return (
    <section className="relative py-16 md:py-24 border-b border-chaos-purple/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-chaos text-4xl md:text-6xl neon-text-purple mb-3">
            SEE IT LIVE
          </h2>
          <p className="font-neon text-white/60 tracking-widest text-sm">
            REAL PEOPLE. REAL CHAOS.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {videos.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[9/16] rounded-xl overflow-hidden border border-chaos-purple/40 hover:border-chaos-cyan/70 transition-colors neon-box-glow group"
            >
              <video
                ref={(el) => (refs.current[i] = el)}
                src={src}
                poster={posters[i]}
                muted
                loop
                playsInline
                preload="none"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
