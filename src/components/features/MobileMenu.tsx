import { X, User, MapPin, Heart, ShoppingBag, Settings, LogOut, Home, Flame, Star, Zap, Gift, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
      element.scrollIntoView({ behavior: 'smooth' });
      onClose();
    } else {
      navigate('/');
      setTimeout(() => {
        const elem = document.getElementById(section);
        elem?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      onClose();
    }
  };

  const handleLogout = () => {
    signout();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-80 bg-chaos-dark border-l border-chaos-red/30 overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-chaos-purple/20 to-chaos-red/20 p-6 border-b border-chaos-purple/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-chaos text-2xl neon-text-purple">MENU</h2>
            <button onClick={onClose} className="p-2 hover:bg-chaos-purple/20 rounded-lg transition-all">
              <X className="w-6 h-6 text-chaos-red" />
            </button>
          </div>

          {/* User Section */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chaos-purple to-chaos-red flex items-center justify-center text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
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
              className="w-full bg-gradient-to-r from-chaos-red to-chaos-purple hover:from-chaos-purple hover:to-chaos-pink text-white font-bold py-3 rounded-lg transition-all neon-box-glow"
            >
              Sign In / Register
            </button>
          )}
        </div>

        {/* Shop Sections */}
        <div className="p-6 border-b border-gray-800">
          <h3 className="font-neon text-xs text-gray-500 uppercase tracking-wider mb-3">Shop</h3>
          <div className="space-y-1">
            <button
              onClick={() => handleNavigation('new-drops')}
              className="w-full flex items-center gap-3 p-3 hover:bg-chaos-purple/10 rounded-lg transition-all text-left"
            >
              <Flame className="w-5 h-5 text-chaos-red" />
              <span className="font-neon">New Drops</span>
            </button>
            <button
              onClick={() => handleNavigation('best-sellers')}
              className="w-full flex items-center gap-3 p-3 hover:bg-chaos-purple/10 rounded-lg transition-all text-left"
            >
              <Star className="w-5 h-5 text-chaos-purple" />
              <span className="font-neon">Best Sellers</span>
            </button>
            <button
              onClick={() => handleNavigation('accessories')}
              className="w-full flex items-center gap-3 p-3 hover:bg-chaos-purple/10 rounded-lg transition-all text-left"
            >
              <Zap className="w-5 h-5 text-chaos-cyan" />
              <span className="font-neon">Accessories</span>
            </button>
            <button
              onClick={() => {
                navigate('/rewards');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-chaos-purple/10 rounded-lg transition-all text-left"
            >
              <Gift className="w-5 h-5 text-chaos-cyan" />
              <span className="font-neon">Rewards Program</span>
            </button>
            <button
              onClick={() => {
                navigate('/referrals');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-chaos-purple/10 rounded-lg transition-all text-left"
            >
              <Users className="w-5 h-5 text-chaos-purple" />
              <span className="font-neon">Refer & Earn</span>
            </button>
            <button
              onClick={() => {
                navigate('/punchcard');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-chaos-purple/10 rounded-lg transition-all text-left"
            >
              <Gift className="w-5 h-5 text-chaos-red" />
              <span className="font-neon">Punch Card</span>
            </button>
            <button
              onClick={() => {
                navigate('/style-quiz');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-chaos-purple/10 rounded-lg transition-all text-left"
            >
              <Sparkles className="w-5 h-5 text-chaos-cyan" />
              <span className="font-neon">Style Quiz</span>
            </button>
          </div>
        </div>

        {/* User Menu (if authenticated) */}
        {isAuthenticated && (
          <>
            <div className="p-6 border-b border-gray-800">
              <h3 className="font-neon text-xs text-gray-500 uppercase tracking-wider mb-3">Account</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    navigate('/profile');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-chaos-purple/10 rounded-lg transition-all text-left"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/orders');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-chaos-purple/10 rounded-lg transition-all text-left"
                >
                  <ShoppingBag className="w-5 h-5 text-gray-400" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/profile#addresses');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-chaos-purple/10 rounded-lg transition-all text-left"
                >
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>Addresses</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/profile#settings');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-chaos-purple/10 rounded-lg transition-all text-left"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all text-red-400 font-bold"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img 
              src="https://cdn-ai.onspace.ai/onspace/files/5FW5Jq6exi5rojAuoiQPtw/bear-logo.png" 
              alt="CHAOS" 
              className="w-8 h-8 object-contain opacity-80"
            />
            <span className="font-chaos text-lg neon-text-red">CHAOS</span>
          </div>
          <p className="text-center text-xs text-gray-500 font-neon">
            BRACE THE WILD © 2026
          </p>
        </div>
      </div>
    </div>
  );
};
