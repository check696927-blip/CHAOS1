import { useState } from "react";
import { X, Copy, Check, Share2, Users, Gift, Lock, Globe, UserCheck } from "lucide-react";
import { Product } from "@/types";
import { createSharedWishlist, getShareableUrl } from "@/lib/sharedWishlist";
import { useAuth } from "@/hooks/useAuth";

interface ShareWishlistModalProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
}

export const ShareWishlistModal = ({ open, onClose, products }: ShareWishlistModalProps) => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'friends-only'>('private');
  const [isGiftRegistry, setIsGiftRegistry] = useState(false);
  const [occasion, setOccasion] = useState<'birthday' | 'wedding' | 'anniversary' | 'holiday' | 'other'>('birthday');
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCreate = () => {
    if (!user || !name) return;

    const wishlist = createSharedWishlist(
      user.id,
      name,
      products.map(p => p.id),
      {
        privacy,
        description,
        occasion: isGiftRegistry ? occasion : undefined,
        isGiftRegistry
      }
    );

    setShareUrl(getShareableUrl(wishlist.shareCode));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-chaos-dark border-2 border-chaos-purple rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          <div className="sticky top-0 bg-chaos-dark border-b border-chaos-purple/30 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Share2 className="w-6 h-6 text-chaos-cyan" />
              <h2 className="font-chaos text-2xl neon-text-purple">Share Wishlist</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-chaos-red/20 rounded-lg transition-all">
              <X className="w-6 h-6 text-chaos-red" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {!shareUrl ? (
              <>
                {/* Wishlist Name */}
                <div>
                  <label className="block text-sm font-neon font-bold mb-2">Wishlist Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., My Birthday Wishlist 2026"
                    className="w-full bg-chaos-darker border-2 border-chaos-purple/30 focus:border-chaos-cyan rounded-lg px-4 py-3 outline-none transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-neon font-bold mb-2">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a message for people viewing your wishlist..."
                    rows={3}
                    className="w-full bg-chaos-darker border-2 border-chaos-purple/30 focus:border-chaos-cyan rounded-lg px-4 py-3 outline-none transition-all resize-none"
                  />
                </div>

                {/* Privacy Settings */}
                <div>
                  <label className="block text-sm font-neon font-bold mb-3">Privacy Settings</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPrivacy('public')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        privacy === 'public'
                          ? 'border-chaos-cyan bg-chaos-cyan/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Globe className="w-6 h-6" />
                      <span className="text-xs font-bold">Public</span>
                      <span className="text-xs text-gray-400 text-center">Anyone with link</span>
                    </button>

                    <button
                      onClick={() => setPrivacy('friends-only')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        privacy === 'friends-only'
                          ? 'border-chaos-cyan bg-chaos-cyan/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <UserCheck className="w-6 h-6" />
                      <span className="text-xs font-bold">Friends Only</span>
                      <span className="text-xs text-gray-400 text-center">Friends can view</span>
                    </button>

                    <button
                      onClick={() => setPrivacy('private')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        privacy === 'private'
                          ? 'border-chaos-cyan bg-chaos-cyan/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Lock className="w-6 h-6" />
                      <span className="text-xs font-bold">Private</span>
                      <span className="text-xs text-gray-400 text-center">Only you</span>
                    </button>
                  </div>
                </div>

                {/* Gift Registry */}
                <div className="border-t border-gray-800 pt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGiftRegistry}
                      onChange={(e) => setIsGiftRegistry(e.target.checked)}
                      className="w-5 h-5 accent-chaos-purple"
                    />
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-chaos-purple" />
                      <span className="font-bold">Make this a Gift Registry</span>
                    </div>
                  </label>
                  <p className="text-xs text-gray-400 ml-8 mt-2">
                    Allow others to mark items as purchased so you don't receive duplicates
                  </p>

                  {isGiftRegistry && (
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value as any)}
                      className="mt-4 ml-8 bg-chaos-darker border-2 border-chaos-purple/30 rounded-lg px-4 py-2 outline-none"
                    >
                      <option value="birthday">Birthday</option>
                      <option value="wedding">Wedding</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="holiday">Holiday</option>
                      <option value="other">Other Occasion</option>
                    </select>
                  )}
                </div>

                {/* Products Preview */}
                <div className="border-t border-gray-800 pt-6">
                  <h3 className="font-neon font-bold mb-3">{products.length} Items in Wishlist</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {products.slice(0, 8).map(product => (
                      <img
                        key={product.id}
                        src={product.image}
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded border border-chaos-red/30"
                      />
                    ))}
                  </div>
                  {products.length > 8 && (
                    <p className="text-center text-sm text-gray-400 mt-3">
                      +{products.length - 8} more items
                    </p>
                  )}
                </div>

                {/* Create Button */}
                <button
                  onClick={handleCreate}
                  disabled={!name}
                  className="w-full bg-gradient-to-r from-chaos-red to-chaos-purple hover:from-chaos-purple hover:to-chaos-pink disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-4 rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  Create Shareable Wishlist
                </button>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-chaos-cyan to-chaos-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="font-chaos text-2xl neon-text-cyan mb-2">Wishlist Created!</h3>
                  <p className="text-gray-400 mb-6">Share this link with friends and family</p>

                  <div className="flex items-center gap-3 bg-chaos-darker border-2 border-chaos-cyan/30 rounded-lg p-4">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 bg-transparent outline-none text-chaos-cyan font-mono text-sm"
                    />
                    <button
                      onClick={handleCopy}
                      className="bg-chaos-cyan hover:bg-chaos-purple text-chaos-darker hover:text-white font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {isGiftRegistry && (
                    <div className="mt-6 bg-gradient-to-r from-chaos-purple/20 to-chaos-cyan/20 border border-chaos-purple/30 rounded-lg p-4">
                      <p className="text-sm text-center">
                        🎁 Gift Registry Active! Friends can mark items as purchased to avoid duplicates.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="w-full border-2 border-chaos-purple hover:bg-chaos-purple/20 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
