import { InteractionEffect } from "@/types";

interface InteractionEffectsProps {
  effects: InteractionEffect[];
  intensity: number;
}

export const InteractionEffects = ({ effects, intensity }: InteractionEffectsProps) => {
  const scale = intensity / 100;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {effects.map((effect) => (
        <div
          key={effect.id}
          className="absolute w-2 h-2 rounded-full animate-ping"
          style={{
            left: `${effect.x}px`,
            top: `${effect.y}px`,
            background: `radial-gradient(circle, rgba(255,0,85,${0.8 * scale}), rgba(157,0,255,${0.4 * scale}), transparent)`,
            boxShadow: `0 0 ${20 * scale}px rgba(255,0,85,${0.6 * scale}), 0 0 ${40 * scale}px rgba(157,0,255,${0.4 * scale})`,
          }}
        />
      ))}
    </div>
  );
};
