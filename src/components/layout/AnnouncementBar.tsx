import { Package } from "lucide-react";

export const AnnouncementBar = () => {
  return (
    <div className="relative bg-gradient-to-r from-chaos-dark/90 via-chaos-purple/20 to-chaos-dark/90 overflow-hidden h-9 border-b border-chaos-purple/10">
      <div className="absolute inset-0 flex items-center">
        <div className="animate-slide-announcement-slow whitespace-nowrap flex items-center gap-12 text-gray-300 font-medium text-xs tracking-wide">
          <span className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-chaos-purple/70" />
            Limited free shipping on orders over $50 🔥
          </span>
          <span className="text-chaos-purple/50">•</span>
          <span className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-chaos-purple/70" />
            Limited free shipping on orders over $50 🔥
          </span>
          <span className="text-chaos-purple/50">•</span>
        </div>
      </div>
    </div>
  );
};
