import { ShareLink, SocialShare, InfluencerStats, SHARE_POINTS, PURCHASE_THROUGH_SHARE_POINTS } from "@/types/social";
import { addPoints } from "./rewards";

const SHARE_LINKS_KEY = 'chaos_share_links';
const SOCIAL_SHARES_KEY = 'chaos_social_shares';

export const generateTrackingCode = (userId: string, productId: string): string => {
  return `${userId.slice(0, 6)}-${productId.slice(0, 6)}-${Date.now().toString(36)}`;
};

export const createShareLink = (
  userId: string,
  productId: string,
  platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok'
): ShareLink => {
  const trackingCode = generateTrackingCode(userId, productId);
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/product/${productId}?ref=${trackingCode}`;

  const shareLink: ShareLink = {
    id: `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    productId,
    platform,
    trackingCode,
    url,
    clicks: 0,
    purchases: 0,
    pointsEarned: 0,
    createdAt: new Date()
  };

  const links = getShareLinks(userId);
  links.push(shareLink);
  localStorage.setItem(`${SHARE_LINKS_KEY}_${userId}`, JSON.stringify(links));

  return shareLink;
};

export const recordShare = (userId: string, productId: string, platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok'): void => {
  const share: SocialShare = {
    id: `share-${Date.now()}`,
    userId,
    productId,
    platform,
    shareLink: createShareLink(userId, productId, platform).url,
    timestamp: new Date()
  };

  const shares = getShares(userId);
  shares.push(share);
  localStorage.setItem(`${SOCIAL_SHARES_KEY}_${userId}`, JSON.stringify(shares));

  // Award points for sharing
  addPoints(userId, SHARE_POINTS, 'bonus', `Shared product on ${platform}`);
};

export const trackShareClick = (trackingCode: string): void => {
  // Find the share link
  const allUsers = Object.keys(localStorage).filter(k => k.startsWith(SHARE_LINKS_KEY));
  
  for (const key of allUsers) {
    const userId = key.replace(`${SHARE_LINKS_KEY}_`, '');
    const links = getShareLinks(userId);
    const link = links.find(l => l.trackingCode === trackingCode);
    
    if (link) {
      link.clicks++;
      localStorage.setItem(`${SHARE_LINKS_KEY}_${userId}`, JSON.stringify(links));
      break;
    }
  }
};

export const recordPurchaseThroughShare = (trackingCode: string, purchaseValue: number): void => {
  const allUsers = Object.keys(localStorage).filter(k => k.startsWith(SHARE_LINKS_KEY));
  
  for (const key of allUsers) {
    const userId = key.replace(`${SHARE_LINKS_KEY}_`, '');
    const links = getShareLinks(userId);
    const link = links.find(l => l.trackingCode === trackingCode);
    
    if (link) {
      link.purchases++;
      link.pointsEarned += PURCHASE_THROUGH_SHARE_POINTS;
      localStorage.setItem(`${SHARE_LINKS_KEY}_${userId}`, JSON.stringify(links));
      
      // Award points to the sharer
      addPoints(
        userId, 
        PURCHASE_THROUGH_SHARE_POINTS, 
        'referral', 
        `Purchase through social share (${link.platform})`,
        undefined,
        trackingCode
      );
      break;
    }
  }
};

export const getShareLinks = (userId: string): ShareLink[] => {
  const stored = localStorage.getItem(`${SHARE_LINKS_KEY}_${userId}`);
  if (!stored) return [];
  
  try {
    const links = JSON.parse(stored);
    return links.map((l: any) => ({
      ...l,
      createdAt: new Date(l.createdAt)
    }));
  } catch {
    return [];
  }
};

export const getShares = (userId: string): SocialShare[] => {
  const stored = localStorage.getItem(`${SOCIAL_SHARES_KEY}_${userId}`);
  if (!stored) return [];
  
  try {
    const shares = JSON.parse(stored);
    return shares.map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp)
    }));
  } catch {
    return [];
  }
};

export const getInfluencerStats = (userId: string): InfluencerStats => {
  const links = getShareLinks(userId);
  const shares = getShares(userId);

  const totalShares = shares.length;
  const totalPurchases = links.reduce((sum, l) => sum + l.purchases, 0);
  const totalRevenue = links.reduce((sum, l) => sum + (l.purchases * 50), 0); // Estimated
  const conversionRate = totalShares > 0 ? (totalPurchases / totalShares) * 100 : 0;

  // Group by product
  const productMap = new Map<string, { shares: number; purchases: number }>();
  links.forEach(link => {
    const existing = productMap.get(link.productId) || { shares: 0, purchases: 0 };
    existing.shares++;
    existing.purchases += link.purchases;
    productMap.set(link.productId, existing);
  });

  const topProducts = Array.from(productMap.entries())
    .map(([productId, stats]) => ({ productId, ...stats }))
    .sort((a, b) => b.purchases - a.purchases)
    .slice(0, 5);

  return {
    totalShares,
    totalPurchases,
    totalRevenue,
    conversionRate,
    topProducts
  };
};

export const isInfluencerTier = (userId: string): boolean => {
  const links = getShareLinks(userId);
  const totalPurchases = links.reduce((sum, l) => sum + l.purchases, 0);
  return totalPurchases >= 100;
};

// Official CHAOS social media profiles
export const CHAOS_SOCIAL_URLS = {
  facebook: "https://www.facebook.com/share/1CceDzksA3/",
  twitter: "https://x.com/CHAOS158761",
  tiktok: "https://www.tiktok.com/@chaos.merch?_r=1&_t=ZS-95ViTQnvc8t",
  instagram: "https://www.instagram.com/chaosmerch1?igsh=cmg1NTlhOGJoNGo4",
} as const;

export const getSocialShareUrl = (platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok', url: string, text: string): string => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'twitter':
      return `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    case 'instagram':
      // Instagram doesn't have direct share URL, copy to clipboard instead
      return url;
    case 'tiktok':
      // TikTok doesn't have direct share URL, copy to clipboard instead
      return url;
  }
};