import {
  X,
  User,
  MapPin,
  Heart,
  ShoppingBag,
  Settings,
  LogOut,
  Flame,
  Star,
  Zap,
  Gift,
  Users,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { safeInitial } from "@/lib/userSafe";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const MobileMenu = ({ open, onClose, onOpenAuth }: MobileMenuProps) => {
  const { user, isAuthenticated, signout } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (section: string) => {
    const element = document.getElementById(section);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      onClose();
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await signout();
    } finally {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-80 bg-chaos-dark border-l border-chaos-red/30 overflow-y-auto animate-slide-in-right">

        {/* HEADER */}
        <div className="p-6 border-b border-chaos-purple/30">

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-chaos text-2xl neon-text-purple">MENU</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-chaos-red" />
            </button>
          </div>

          {/* USER BLOCK */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chaos-purple to-chaos-red flex items-center justify-center text-xl font-bold">
                {safeInitial(user)}
              </div>

              <div>
                <p className="font-bold">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full bg-gradient-to-r from-chaos-red to-chaos-purple text-white font-bold py-3 rounded-lg"
            >
              Sign In / Register
            </button>
          )}
        </div>

        {/* SHOP */}
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xs text-gray-500 uppercase mb-3">Shop</h3>

          <button onClick={() => handleNavigation("new-drops")} className="w-full flex gap-3 p-3">
            <Flame className="w-5 h-5 text-chaos-red" />
            New Drops
          </button>

          <button onClick={() => handleNavigation("best-sellers")} className="w-full flex gap-3 p-3">
            <Star className="w-5 h-5 text-chaos-purple" />
            Best Sellers
          </button>

          <button onClick={() => handleNavigation("accessories")} className="w-full flex gap-3 p-3">
            <Zap className="w-5 h-5 text-chaos-cyan" />
            Accessories
          </button>

          <button onClick={() => navigate("/style-quiz")} className="w-full flex gap-3 p-3">
            <Sparkles className="w-5 h-5 text-chaos-cyan" />
            Style Quiz
          </button>
        </div>

        {/* ACCOUNT */}
        {isAuthenticated && (
          <div className="p-6 border-b border-gray-800">
            <button onClick={() => navigate("/profile")} className="w-full flex gap-3 p-3">
              <User className="w-5 h-5" />
              Profile
            </button>

            <button onClick={() => navigate("/orders")} className="w-full flex gap-3 p-3">
              <ShoppingBag className="w-5 h-5" />
              Orders
            </button>

            <button onClick={handleLogout} className="w-full flex gap-3 p-3 text-red-400">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};