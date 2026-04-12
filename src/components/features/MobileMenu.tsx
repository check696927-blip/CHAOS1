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
import { safeInitial, getSafeUser } from "@/lib/userSafe";

export const MobileMenu = ({ open, onClose, onOpenAuth }: any) => {
  const { user, isAuthenticated, signout } = useAuth();
  const navigate = useNavigate();

  // ✅ GLOBAL SAFE USER NORMALIZATION
  const safeUser = getSafeUser(user);

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

  // ✅ CRASH-PROOF SIGNOUT (NEVER FAILS UI)
  const handleLogout = async () => {
    try {
      if (typeof signout === "function") {
        await signout();
      }
    } catch (err) {
      console.error("Signout error ignored:", err);
    } finally {
      onClose();
      navigate("/");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-80 bg-chaos-dark">

        {/* HEADER */}
        <div className="p-6 border-b">

          <div className="flex justify-between mb-4">
            <h2 className="font-bold text-xl">MENU</h2>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* USER BLOCK (100% SAFE) */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-xl font-bold">
                {safeInitial(user)}
              </div>

              <div>
                <p className="font-bold">{safeUser.name}</p>
                <p className="text-xs text-gray-400">{safeUser.email}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full bg-gradient-to-r text-white font-bold py-3 rounded-lg"
            >
              Sign In / Register
            </button>
          )}
        </div>

        {/* ACCOUNT */}
        {isAuthenticated && (
          <div className="p-6 border-b">

            <button onClick={() => navigate("/profile")} className="w-full flex gap-3 p-3">
              <User className="w-5 h-5" />
              Profile
            </button>

            <button onClick={() => navigate("/orders")} className="w-full flex gap-3 p-3">
              <ShoppingBag className="w-5 h-5" />
              Orders
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex gap-3 p-3 text-red-400"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>

          </div>
        )}
      </div>
    </div>
  );
};