import { X, Sparkles } from "lucide-react";

interface DiscountPopupProps {
  onClose: () => void;
}

export const DiscountPopup = ({ onClose }: DiscountPopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative bg-gradient-to-br from-chaos-dark via-chaos-darker to-black border border-chaos-purple/40 rounded-xl max-w-lg w-full p-10 animate-in zoom-in duration-500 shadow-[0_0_80px_rgba(157,0,255,0.3)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-6">
          {/* Subtle Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-chaos-purple opacity-80" />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <p className="text-sm font-neon text-chaos-purple/80 tracking-[0.3em] uppercase">
              Exclusive Access Unlocked
            </p>
            <h2 className="font-chaos text-5xl neon-text-red tracking-wide">
              20% OFF
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              Limited drop — this order only
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-base leading-relaxed max-w-sm mx-auto">
            Your discount has been <span className="text-chaos-purple font-semibold">automatically applied</span>. Complete your order to unlock premium streetwear.
          </p>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-chaos-red/90 to-chaos-purple/90 hover:from-chaos-red hover:to-chaos-purple text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(255,0,85,0.3)] hover:shadow-[0_0_40px_rgba(255,0,85,0.5)]"
          >
            <span className="font-neon tracking-wider text-sm">
              UNLOCK DISCOUNT
            </span>
          </button>

          <p className="text-xs text-gray-600 pt-2">
            No code needed • Applied at checkout
          </p>
        </div>
      </div>
    </div>
  );
};
