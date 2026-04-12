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
  ArrowLeft,
} from "lucide-react";

import {
  safeInitial,
  safeAddressCount,
  getSafeUser,
} from "@/lib/userSafe";

const Profile = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, signout } = useAuth();

  const itemCount = useCartStore(selectCartCount);
  const { itemCount: wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders">("profile");

  // ✅ GLOBAL SAFE USER
  const safeUser = getSafeUser(user);

  // 🔐 HARD GUARD
  const isReady = isAuthenticated && user;

  if (!isReady) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white">
        <AnnouncementBar />
        <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />

        <div className="text-center py-16">
          <h1 className="text-4xl mb-4">Please Sign In</h1>

          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r px-8 py-3 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const addressCount = safeAddressCount(safeUser);
  const createdAtSafe = safeUser.createdAt;

  return (
    <div className="min-h-screen bg-chaos-darker text-white">

      <AnnouncementBar />
      <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />

      <div className="container mx-auto px-4 py-8">

        <button onClick={() => navigate("/")} className="mb-6 flex gap-2">
          <ArrowLeft />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* SIDEBAR */}
          <div className="lg:col-span-1">

            <div className="p-6 border rounded-lg">

              {/* AVATAR */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center text-3xl font-bold">
                  {safeInitial(safeUser)}
                </div>

                <h2 className="font-bold">{safeUser.name}</h2>
                <p className="text-sm">{safeUser.email}</p>
              </div>

            </div>
          </div>

          {/* MAIN */}
          <div className="lg:col-span-3">

            {activeTab === "profile" && (
              <div className="p-8 border rounded-lg">

                <div className="grid grid-cols-3 gap-4 mb-8">

                  <div className="text-center">
                    <ShoppingBag />
                    <p>0</p>
                  </div>

                  <div className="text-center">
                    <Heart />
                    <p>{wishlistCount}</p>
                  </div>

                  <div className="text-center">
                    <MapPin />
                    <p>{addressCount}</p>
                  </div>

                </div>

                {/* SAFE FIELDS */}
                <input value={safeUser.name} readOnly />
                <input value={safeUser.email} readOnly />

                <div>{safeUser.provider}</div>

                <input
                  value={new Date(createdAtSafe).toLocaleDateString()}
                  readOnly
                />

              </div>
            )}

            {activeTab === "addresses" && (
              <div className="p-8 border rounded-lg">
                {addressCount === 0 ? (
                  <div>No addresses yet</div>
                ) : (
                  <div>Addresses loaded safely</div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;