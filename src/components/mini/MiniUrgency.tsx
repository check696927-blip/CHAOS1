import { useEffect, useState } from "react";

interface MiniUrgencyProps {
  initialStock?: number;
  minutes?: number;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function MiniUrgency({ initialStock = 17, minutes = 15 }: MiniUrgencyProps) {
  const [stock] = useState(initialStock);
  const [seconds, setSeconds] = useState(minutes * 60);

  useEffect(() => {
    const key = "mini-urgency-expires";
    const existing = sessionStorage.getItem(key);
    const expires = existing
      ? parseInt(existing, 10)
      : Date.now() + minutes * 60 * 1000;
    if (!existing) sessionStorage.setItem(key, String(expires));

    const tick = () => {
      const remaining = Math.max(0, Math.floor((expires - Date.now()) / 1000));
      setSeconds(remaining);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [minutes]);

  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const stockPct = Math.min(100, Math.max(8, (stock / 50) * 100));

  return (
    <section className="py-12 md:py-16 border-b border-chaos-pink/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-2xl bg-gradient-to-br from-chaos-red/10 via-chaos-purple/10 to-chaos-cyan/10 border border-chaos-red/40 neon-border-red">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-neon text-chaos-red tracking-[0.3em] text-xs mb-2 animate-neon-pulse">
                ⚠ LOW STOCK ALERT
              </div>
              <div className="font-chaos text-2xl md:text-3xl text-white mb-3">
                ONLY <span className="neon-text-red">{stock}</span> LEFT
              </div>
              <div className="w-64 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-chaos-red to-chaos-pink transition-all duration-700"
                  style={{ width: `${stockPct}%` }}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="font-neon text-chaos-cyan tracking-[0.3em] text-xs mb-2">
                OFFER ENDS IN
              </div>
              <div className="flex gap-2 font-chaos text-3xl md:text-5xl">
                <span className="px-3 py-2 bg-chaos-dark border border-chaos-cyan/50 rounded-lg neon-text-cyan min-w-[70px] text-center">
                  {pad(mm)}
                </span>
                <span className="neon-text-cyan self-center">:</span>
                <span className="px-3 py-2 bg-chaos-dark border border-chaos-cyan/50 rounded-lg neon-text-cyan min-w-[70px] text-center">
                  {pad(ss)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
