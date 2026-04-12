import { Settings, Volume2, VolumeX, MousePointer, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { EffectSettings } from "@/types";

interface IntensityControlProps {
  settings: EffectSettings;
  onUpdate: (settings: Partial<EffectSettings>) => void;
}

export const IntensityControl = ({ settings, onUpdate }: IntensityControlProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Control Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-chaos-dark border-2 border-chaos-purple/50 rounded-lg p-4 w-64 space-y-4 animate-in slide-in-from-bottom-2 duration-200">
          <h3 className="font-neon text-sm text-chaos-purple tracking-wider">
            EFFECT CONTROLS
          </h3>

          {/* Intensity Slider */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 flex justify-between">
              <span>Intensity</span>
              <span className="text-chaos-cyan">{settings.intensity}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.intensity}
              onChange={(e) => onUpdate({ intensity: Number(e.target.value) })}
              className="w-full h-2 bg-chaos-darker rounded-lg appearance-none cursor-pointer accent-chaos-purple"
            />
          </div>

          {/* Toggle Options */}
          <div className="space-y-2">
            <button
              onClick={() => onUpdate({ clickEffects: !settings.clickEffects })}
              className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
                settings.clickEffects
                  ? 'bg-chaos-purple/20 text-chaos-purple'
                  : 'bg-chaos-darker text-gray-500'
              }`}
            >
              <span className="flex items-center gap-2 text-xs">
                <MousePointer className="w-4 h-4" />
                Click Effects
              </span>
              {settings.clickEffects ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onUpdate({ scrollEffects: !settings.scrollEffects })}
              className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
                settings.scrollEffects
                  ? 'bg-chaos-red/20 text-chaos-red'
                  : 'bg-chaos-darker text-gray-500'
              }`}
            >
              <span className="flex items-center gap-2 text-xs">
                <Settings className="w-4 h-4" />
                Scroll Effects
              </span>
              {settings.scrollEffects ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onUpdate({ audioVisualization: !settings.audioVisualization })}
              className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
                settings.audioVisualization
                  ? 'bg-chaos-cyan/20 text-chaos-cyan'
                  : 'bg-chaos-darker text-gray-500'
              }`}
            >
              <span className="flex items-center gap-2 text-xs">
                {settings.audioVisualization ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Audio Visualizer
              </span>
              {settings.audioVisualization ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-chaos-red to-chaos-purple hover:from-chaos-purple hover:to-chaos-pink text-white p-3 rounded-full shadow-lg neon-box-glow hover:scale-110 transition-all"
      >
        <Settings className={`w-5 h-5 ${isOpen ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};
