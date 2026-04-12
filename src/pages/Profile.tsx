import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";

import { useAuth } from "@/hooks/useAuth";
import { useCartStore, selectCartCount } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";

import {
  User,
  MapPin,
  Heart,
  ShoppingBag,
  Settings,
  Edit,
  Plus,
  ArrowLeft,
} from "lucide-react";

import {
  safeInitial,
  safeAddressCount,
} from "@/lib/userSafe";

const Profile = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, signout } = useAuth();

  const itemCount = useCartStore(selectCartCount);
  const { itemCount: wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "orders"
  >("profile");

  // 🔐 HARD GUARD — prevents ALL downstream crashes
  const safeUser = user ?? null;
  const isReady = isAuthenticated && safeUser;

  if (!isReady) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white">
        <AnnouncementBar />
        <Header
          cartItemCount={itemCount}
          wishlistItemCount={wishlistCount}
          onOpenWishlist={() => {}}
        />

        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-chaos text-4xl neon-text-red mb-4">
            Please Sign In
          </h1>

          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-chaos-red to-chaos-purple text-white font-bold py-3 px-8 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const nameInitial = safeInitial(safeUser);
  const addressCount = safeAddressCount(safeUser);
  const createdAtSafe =
    safeUser?.createdAt ?? new Date().toISOString();

  return (
    <div className="min-h-screen bg-chaos-darker text-white">
      <AnnouncementBar />
      <Header
        cartItemCount={itemCount}
        wishlistItemCount={wishlistCount}
        onOpenWishlist={() => {}}
      />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-chaos-purple hover:text-chaos-red mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-neon">Back to Shop</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">

              {/* AVATAR */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-chaos-purple to-chaos-red flex items-center justify-center text-3xl font-bold mb-3">
                  {nameInitial}
                </div>

                <h2 className="font-bold text-lg mb-1">
                  {safeUser?.name ?? "Guest"}
                </h2>

                <p className="text-sm text-gray-400">
                  {safeUser?.email ?? "No email"}
                </p>

                <button className="mt-3 text-xs text-chaos-purple flex items-center gap-1 mx-auto">
                  <Edit className="w-3 h-3" />
                  Edit Profile
                </button>
              </div>

              {/* NAVIGATION */}
              <div className="space-y-1">

                <button
                  onClick={() => setActiveTab("profile")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-chaos-purple/10"
                >
                  <User className="w-5 h-5" />
                  My Profile
                </button>

                <button
                  onClick={() => setActiveTab("addresses")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-chaos-purple/10"
                >
                  <MapPin className="w-5 h-5" />
                  My Addresses
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-chaos-purple/10"
                >
                  <ShoppingBag className="w-5 h-5" />
                  My Orders
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-chaos-purple/10"
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>

                <button
                  onClick={async () => {
                    try {
                      await signout();
                    } finally {
                      navigate("/");
                    }
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/20 text-red-400 mt-6"
                >
                  <Settings className="w-5 h-5" />
                  Sign Out
                </button>

              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">

            {activeTab === "profile" && (
              <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-8">

                <h2 className="font-chaos text-2xl neon-text-purple mb-6">
                  My Profile
                </h2>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                  <div className="bg-chaos-darker border border-gray-800 rounded-lg p-6 text-center">
                    <ShoppingBag className="w-8 h-8 text-chaos-purple mx-auto mb-2" />
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-400">Orders</p>
                  </div>

                  <div className="bg-chaos-darker border border-gray-800 rounded-lg p-6 text-center">
                    <Heart className="w-8 h-8 text-chaos-red mx-auto mb-2" />
                    <p className="text-3xl font-bold">{wishlistCount}</p>
                    <p className="text-sm text-gray-400">Wishlist</p>
                  </div>

                  <div className="bg-chaos-darker border border-gray-800 rounded-lg p-6 text-center">
                    <MapPin className="w-8 h-8 text-chaos-cyan mx-auto mb-2" />
                    <p className="text-3xl font-bold">{addressCount}</p>
                    <p className="text-sm text-gray-400">Addresses</p>
                  </div>

                </div>

                {/* USER INFO SAFE BLOCK */}
                <div className="space-y-4">

                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <input
                      value={safeUser?.name ?? ""}
                      readOnly
                      className="w-full bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <input
                      value={safeUser?.email ?? ""}
                      readOnly
                      className="w-full bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Provider</label>
                    <div className="bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3 capitalize">
                      {safeUser?.provider ?? "guest"}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Member Since</label>
                    <input
                      value={new Date(createdAtSafe).toLocaleDateString()}
                      readOnly
                      className="w-full bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3"
                    />
                  </div>

                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-8">

                <h2 className="font-chaos text-2xl mb-6">
                  My Addresses
                </h2>

                {addressCount === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No addresses yet</p>

                    <button className="mt-4 bg-chaos-purple px-6 py-3 rounded-lg">
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    Address system loaded safely (no crash mode active)
                  </div>
                )}

              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-8">
                <h2 className="font-chaos text-2xl mb-6">Orders</h2>

                <div className="text-center text-gray-500">
                  No orders yet
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;