import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore, selectCartCount } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";
import { User, MapPin, Heart, ShoppingBag, Settings, Edit, Plus, ArrowLeft } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signout } = useAuth();
  const itemCount = useCartStore(selectCartCount);
  const { itemCount: wishlistCount } = useWishlist();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white">
        <AnnouncementBar />
        <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-chaos text-4xl neon-text-red mb-4">Please Sign In</h1>
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

  return (
    <div className="min-h-screen bg-chaos-darker text-white">
      <AnnouncementBar />
      <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-chaos-purple hover:text-chaos-red mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-neon">Back to Shop</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
              {/* User Avatar & Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-chaos-purple to-chaos-red flex items-center justify-center text-3xl font-bold mb-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="font-bold text-lg mb-1">{user.name}</h2>
                <p className="text-sm text-gray-400">{user.email}</p>
                <button className="mt-3 text-xs text-chaos-purple hover:text-chaos-red transition-colors flex items-center gap-1 mx-auto">
                  <Edit className="w-3 h-3" />
                  Edit Profile
                </button>
              </div>

              {/* Navigation */}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-chaos-purple/20 text-chaos-purple border border-chaos-purple/30'
                      : 'hover:bg-chaos-purple/10'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-neon">My Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    activeTab === 'addresses'
                      ? 'bg-chaos-purple/20 text-chaos-purple border border-chaos-purple/30'
                      : 'hover:bg-chaos-purple/10'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-neon">My Addresses</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    activeTab === 'orders'
                      ? 'bg-chaos-purple/20 text-chaos-purple border border-chaos-purple/30'
                      : 'hover:bg-chaos-purple/10'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-neon">My Orders</span>
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-chaos-purple/10 transition-all"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-neon">Wishlist</span>
                </button>

                <button
                  onClick={signout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/20 transition-all text-red-400 mt-6"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-neon">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-8">
                <h2 className="font-chaos text-2xl neon-text-purple mb-6">My Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-chaos-darker border border-gray-800 rounded-lg p-6 text-center">
                    <ShoppingBag className="w-8 h-8 text-chaos-purple mx-auto mb-2" />
                    <p className="text-3xl font-bold neon-text-purple mb-1">0</p>
                    <p className="text-sm text-gray-400">Orders</p>
                  </div>

                  <div className="bg-chaos-darker border border-gray-800 rounded-lg p-6 text-center">
                    <Heart className="w-8 h-8 text-chaos-red mx-auto mb-2" />
                    <p className="text-3xl font-bold neon-text-red mb-1">{wishlistCount}</p>
                    <p className="text-sm text-gray-400">Wishlist Items</p>
                  </div>

                  <div className="bg-chaos-darker border border-gray-800 rounded-lg p-6 text-center">
                    <MapPin className="w-8 h-8 text-chaos-cyan mx-auto mb-2" />
                    <p className="text-3xl font-bold neon-text-cyan mb-1">{user.addresses.length}</p>
                    <p className="text-sm text-gray-400">Saved Addresses</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Name</label>
                      <input
                        type="text"
                        value={user.name}
                        readOnly
                        className="w-full bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Login Method</label>
                    <div className="flex items-center gap-2 bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3">
                      <span className="capitalize text-chaos-purple font-bold">{user.provider}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Member Since</label>
                    <input
                      type="text"
                      value={new Date(user.createdAt).toLocaleDateString()}
                      readOnly
                      className="w-full bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-chaos text-2xl neon-text-purple">My Addresses</h2>
                  <button className="bg-chaos-purple hover:bg-chaos-red px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Address
                  </button>
                </div>

                {user.addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No addresses saved yet</p>
                    <button className="bg-chaos-purple hover:bg-chaos-red px-6 py-3 rounded-lg font-bold transition-all">
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address) => (
                      <div key={address.id} className="bg-chaos-darker border border-gray-800 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-bold">{address.name}</p>
                          {address.isDefault && (
                            <span className="text-xs bg-chaos-purple/20 text-chaos-purple px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{address.phone}</p>
                        <p className="text-sm text-gray-400 mt-2">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-sm text-gray-400">
                          {address.city}, {address.state} {address.zip}
                        </p>
                        <p className="text-sm text-gray-400">{address.country}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-8">
                <h2 className="font-chaos text-2xl neon-text-purple mb-6">My Orders</h2>
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-chaos-red to-chaos-purple px-6 py-3 rounded-lg font-bold transition-all"
                  >
                    Start Shopping
                  </button>
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
