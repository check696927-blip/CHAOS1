import { useEffect, useState } from "react";

interface AudioVisualizerProps {
  intensity: number;
}

export const AudioVisualizer = ({ intensity }: AudioVisualizerProps) => {
  const [bars, setBars] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    const animate = () => {
      setBars(prev => 
        prev.map(() => {
          // Simulate audio reactivity with smooth random values
          const target = Math.random() * 100;
          return target;
        })
      );
    };

    const interval = setInterval(animate, 150);
    return () => clearInterval(interval);
  }, []);

  const scale = intensity / 100;

  return (
    <div className="flex items-end justify-center gap-1 h-24 opacity-60">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-2 rounded-t-full transition-all duration-150 ease-out"
          style={{
            height: `${height * scale}%`,
            background: `linear-gradient(to top, 
              rgba(255,0,85,${0.8 * scale}), 
              rgba(157,0,255,${0.6 * scale}), 
              rgba(0,255,255,${0.4 * scale})
            )`,
            boxShadow: `0 0 ${10 * scale}px rgba(255,0,85,${0.5 * scale})`,
          }}
        />
      ))}
    </div>
  );
};
