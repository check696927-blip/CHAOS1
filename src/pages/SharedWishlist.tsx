import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore, selectCartCount } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";
import { getSharedWishlist, addCollaborator, markAsPurchased } from "@/lib/sharedWishlist";
import { SharedWishlist as SharedWishlistType } from "@/types/wishlist";
import { PRODUCTS } from "@/constants/products";
import { Product } from "@/types";
import { 
  Heart, 
  ShoppingCart, 
  Users, 
  Lock, 
  Gift, 
  CheckCircle,
  ArrowLeft,
  Calendar
} from "lucide-react";

const SharedWishlist = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const addToCart = useCartStore((s) => s.addItem);
  const itemCount = useCartStore(selectCartCount);
  const { itemCount: wishlistCount } = useWishlist();
  
  const [wishlist, setWishlist] = useState<SharedWishlistType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (shareCode) {
      const shared = getSharedWishlist(shareCode);
      if (!shared) {
        setError("Wishlist not found");
        setLoading(false);
        return;
      }

      // Check privacy
      if (shared.privacy === 'private' && (!user || user.id !== shared.userId)) {
        setError("This wishlist is private");
        setLoading(false);
        return;
      }

      setWishlist(shared);
      
      // Load products
      const wishlistProducts = PRODUCTS.filter(p => shared.productIds.includes(p.id));
      setProducts(wishlistProducts);
      
      setLoading(false);
    }
  }, [shareCode, user]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      quantity: 1,
      name: product.name,
      image: product.image,
      price: product.price,
    });
    
    if (wishlist?.isGiftRegistry && user) {
      markAsPurchased(wishlist.shareCode, product.id, user.id);
      // Refresh wishlist
      const updated = getSharedWishlist(wishlist.shareCode);
      if (updated) setWishlist(updated);
    }
  };

  const handleJoinAsCollaborator = () => {
    if (wishlist && user) {
      addCollaborator(wishlist.shareCode, user.id);
      const updated = getSharedWishlist(wishlist.shareCode);
      if (updated) setWishlist(updated);
    }
  };

  const isPurchased = (productId: string) => {
    return wishlist?.purchasedItems?.some(p => p.productId === productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-chaos-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error || !wishlist) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white">
        <AnnouncementBar />
        <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="font-chaos text-4xl neon-text-red mb-4">{error}</h1>
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

  const isOwner = user && user.id === wishlist.userId;
  const isCollaborator = user && wishlist.collaborators?.includes(user.id);

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

        {/* Wishlist Header */}
        <div className="bg-gradient-to-br from-chaos-purple/20 to-chaos-red/20 border-2 border-chaos-purple/50 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-8 h-8 text-chaos-red fill-chaos-red" />
                <h1 className="font-chaos text-4xl neon-text-red">{wishlist.name}</h1>
              </div>
              {wishlist.description && (
                <p className="text-gray-300 mb-4">{wishlist.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm">
                {wishlist.isGiftRegistry && (
                  <div className="flex items-center gap-2 bg-chaos-purple/20 border border-chaos-purple/30 px-3 py-1 rounded-full">
                    <Gift className="w-4 h-4 text-chaos-cyan" />
                    <span className="font-bold">Gift Registry</span>
                    {wishlist.occasion && (
                      <span className="text-gray-400">• {wishlist.occasion}</span>
                    )}
                  </div>
                )}
                {wishlist.eventDate && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(wishlist.eventDate).toLocaleDateString()}</span>
                  </div>
                )}
                {wishlist.collaborators && wishlist.collaborators.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{wishlist.collaborators.length + 1} people</span>
                  </div>
                )}
              </div>
            </div>

            {!isOwner && !isCollaborator && wishlist.privacy !== 'private' && (
              <button
                onClick={handleJoinAsCollaborator}
                className="bg-chaos-cyan hover:bg-chaos-purple text-chaos-darker hover:text-white font-bold px-6 py-3 rounded-lg transition-all flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Join as Collaborator
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-16 text-center">
            <Heart className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">This wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const purchased = isPurchased(product.id);
              const discountedPrice = product.price * 0.8;

              return (
                <div
                  key={product.id}
                  className={`bg-chaos-dark border rounded-lg overflow-hidden group hover:border-chaos-purple transition-all ${
                    purchased ? 'border-green-500/50 opacity-60' : 'border-chaos-red/30'
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {purchased && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center">
                          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                          <p className="text-white font-bold">Purchased</p>
                        </div>
                      </div>
                    )}
                    {product.badge && !purchased && (
                      <span className="absolute top-2 left-2 bg-chaos-red text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-neon font-bold mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-gray-500 line-through text-sm">${product.price}</span>
                      <span className="font-bold text-chaos-purple text-xl">
                        ${discountedPrice.toFixed(0)}
                      </span>
                    </div>

                    {!purchased && (
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-gradient-to-r from-chaos-red to-chaos-purple hover:from-chaos-purple hover:to-chaos-pink disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-3 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedWishlist;
