import { useState } from "react";
import { Product } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { createShareLink, recordShare, getSocialShareUrl } from "@/lib/social";
import { Share2, Instagram, Facebook, Twitter, Music2, Check, Copy } from "lucide-react";

interface SocialShareButtonProps {
  product: Product;
}

export const SocialShareButton = ({ product }: SocialShareButtonProps) => {
  const { user, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async (platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok') => {
    if (!isAuthenticated || !user) {
      alert("Please sign in to earn rewards from sharing!");
      return;
    }

    // Create tracking link
    const shareLink = createShareLink(user.id, product.id, platform);
    const shareText = `Check out ${product.name} on CHAOS! 🔥`;

    // Record the share for points
    recordShare(user.id, product.id, platform);

    // Get platform-specific share URL
    const shareUrl = getSocialShareUrl(platform, shareLink.url, shareText);

    if (platform === 'instagram' || platform === 'tiktok') {
      // Copy to clipboard for Instagram/TikTok
      await navigator.clipboard.writeText(shareLink.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      alert(`Link copied! Paste it in your ${platform} bio or story. You'll earn points when friends purchase through your link!`);
    } else {
      // Open share dialog for Facebook/Twitter
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    setShowMenu(false);

    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-chaos-purple border-2 border-chaos-cyan text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right';
    toast.innerHTML = `✨ +25 points! Shared on ${platform}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 bg-chaos-dark border-2 border-chaos-cyan hover:bg-chaos-cyan/20 text-chaos-cyan font-bold py-3 px-6 rounded-lg transition-all"
      >
        <Share2 className="w-5 h-5" />
        <span className="font-neon">Share & Earn</span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
          <div className="absolute top-full mt-2 right-0 bg-chaos-darker border-2 border-chaos-purple rounded-lg shadow-xl p-4 z-50 w-64 animate-in fade-in slide-in-from-top-2">
            <p className="text-xs text-gray-400 mb-3 text-center">
              Earn <span className="text-chaos-cyan font-bold">25 points</span> per share + <span className="text-chaos-purple font-bold">200 points</span> per purchase!
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => handleShare('instagram')}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all"
              >
                <Instagram className="w-5 h-5" />
                <span className="font-bold">Instagram</span>
                {copied && <Check className="w-4 h-4 ml-auto" />}
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
              >
                <Facebook className="w-5 h-5" />
                <span className="font-bold">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 p-3 bg-sky-500 hover:bg-sky-600 rounded-lg transition-all"
              >
                <Twitter className="w-5 h-5" />
                <span className="font-bold">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('tiktok')}
                className="w-full flex items-center gap-3 p-3 bg-black hover:bg-gray-900 border border-white rounded-lg transition-all"
              >
                <Music2 className="w-5 h-5" />
                <span className="font-bold">TikTok</span>
                {copied && <Check className="w-4 h-4 ml-auto" />}
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-xs text-center text-gray-500">
                Unlock <span className="text-yellow-400 font-bold">Influencer Tier</span> at 100+ purchases
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
