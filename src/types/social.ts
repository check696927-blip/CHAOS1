export interface ShareLink {
  id: string;
  userId: string;
  productId: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok';
  trackingCode: string;
  url: string;
  clicks: number;
  purchases: number;
  pointsEarned: number;
  createdAt: Date;
}

export interface SocialShare {
  id: string;
  userId: string;
  productId: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok';
  shareLink: string;
  timestamp: Date;
}

export interface InfluencerStats {
  totalShares: number;
  totalPurchases: number;
  totalRevenue: number;
  conversionRate: number;
  topProducts: { productId: string; shares: number; purchases: number }[];
}

export const INFLUENCER_TIER_THRESHOLD = 100; // 100 successful shares
export const SHARE_POINTS = 25; // Points for sharing
export const PURCHASE_THROUGH_SHARE_POINTS = 200; // Points when someone buys through your link
